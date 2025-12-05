"""Analytics service for dashboard KPIs and charts."""
from datetime import date, timedelta
from decimal import Decimal
from sqlalchemy import func, and_, case, distinct
from sqlalchemy.orm import Session

from app.models import FactTransaction, DimMerchant, DimCustomer, DimDate, MerchantChurnScore
from app.schemas import (
    KPIMetric, DashboardKPIs, TimeSeriesPoint,
    RevenueByCategory, PaymentMethodSplit
)
from app.core.cache import cache


def format_currency(value: float) -> str:
    """Format value as USD currency."""
    if value >= 1_000_000:
        return f"${value/1_000_000:.1f}M"
    elif value >= 1_000:
        return f"${value/1_000:.1f}K"
    return f"${value:,.2f}"


def format_number(value: float) -> str:
    """Format large numbers."""
    if value >= 1_000_000:
        return f"{value/1_000_000:.1f}M"
    elif value >= 1_000:
        return f"{value/1_000:.1f}K"
    return f"{value:,.0f}"


def format_percent(value: float) -> str:
    """Format as percentage."""
    return f"{value:.1f}%"


def calculate_change(current: float, previous: float) -> tuple[float, str]:
    """Calculate percentage change and trend direction."""
    if previous == 0:
        return 0, "stable"
    change = ((current - previous) / previous) * 100
    trend = "up" if change > 0 else "down" if change < 0 else "stable"
    return round(change, 1), trend


@cache(expire=300, prefix="kpi")
async def get_dashboard_kpis(db: Session) -> DashboardKPIs:
    """Get all dashboard KPIs with comparison to previous period."""
    today = date.today()
    current_month_start = today.replace(day=1)
    prev_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
    
    current_start_key = int(current_month_start.strftime("%Y%m%d"))
    prev_start_key = int(prev_month_start.strftime("%Y%m%d"))
    prev_end_key = int((current_month_start - timedelta(days=1)).strftime("%Y%m%d"))
    
    # Current period metrics
    current_stats = db.query(
        func.count(FactTransaction.transaction_id).label("volume"),
        func.sum(FactTransaction.amount).label("revenue"),
        func.avg(FactTransaction.amount).label("avg_tx")
    ).filter(FactTransaction.date_key >= current_start_key).first()
    
    # Previous period metrics
    prev_stats = db.query(
        func.count(FactTransaction.transaction_id).label("volume"),
        func.sum(FactTransaction.amount).label("revenue"),
        func.avg(FactTransaction.amount).label("avg_tx")
    ).filter(
        and_(
            FactTransaction.date_key >= prev_start_key,
            FactTransaction.date_key <= prev_end_key
        )
    ).first()
    
    # Active merchants (had transaction in last 30 days)
    thirty_days_ago_key = int((today - timedelta(days=30)).strftime("%Y%m%d"))
    active_merchants_current = db.query(
        func.count(distinct(FactTransaction.merchant_id))
    ).filter(FactTransaction.date_key >= thirty_days_ago_key).scalar() or 0
    
    sixty_days_ago_key = int((today - timedelta(days=60)).strftime("%Y%m%d"))
    active_merchants_prev = db.query(
        func.count(distinct(FactTransaction.merchant_id))
    ).filter(
        and_(
            FactTransaction.date_key >= sixty_days_ago_key,
            FactTransaction.date_key < thirty_days_ago_key
        )
    ).scalar() or 0
    
    # Churn rate (merchants with high risk / total merchants)
    total_merchants = db.query(func.count(DimMerchant.merchant_id)).scalar() or 1
    high_risk = db.query(func.count(MerchantChurnScore.id)).filter(
        MerchantChurnScore.risk_level.in_(["high", "critical"])
    ).scalar() or 0
    churn_rate = (high_risk / total_merchants) * 100 if total_merchants else 0
    
    # Build metrics
    vol_curr = current_stats.volume or 0
    vol_prev = prev_stats.volume or 0
    vol_change, vol_trend = calculate_change(vol_curr, vol_prev)
    
    rev_curr = float(current_stats.revenue or 0)
    rev_prev = float(prev_stats.revenue or 0)
    rev_change, rev_trend = calculate_change(rev_curr, rev_prev)
    
    avg_curr = float(current_stats.avg_tx or 0)
    avg_prev = float(prev_stats.avg_tx or 0)
    avg_change, avg_trend = calculate_change(avg_curr, avg_prev)
    
    merch_change, merch_trend = calculate_change(active_merchants_current, active_merchants_prev)
    
    return DashboardKPIs(
        total_volume=KPIMetric(
            value=vol_curr,
            formatted_value=format_number(vol_curr),
            previous_value=vol_prev,
            change_percent=vol_change,
            trend=vol_trend
        ),
        total_revenue=KPIMetric(
            value=rev_curr,
            formatted_value=format_currency(rev_curr),
            previous_value=rev_prev,
            change_percent=rev_change,
            trend=rev_trend
        ),
        active_merchants=KPIMetric(
            value=active_merchants_current,
            formatted_value=format_number(active_merchants_current),
            previous_value=active_merchants_prev,
            change_percent=merch_change,
            trend=merch_trend
        ),
        churn_rate=KPIMetric(
            value=churn_rate,
            formatted_value=format_percent(churn_rate),
            change_percent=0,
            trend="stable"
        ),
        avg_transaction=KPIMetric(
            value=avg_curr,
            formatted_value=format_currency(avg_curr),
            previous_value=avg_prev,
            change_percent=avg_change,
            trend=avg_trend
        )
    )


@cache(expire=300, prefix="chart")
async def get_revenue_trend(db: Session, days: int = 30) -> list[TimeSeriesPoint]:
    """Get daily revenue trend for the past N days."""
    today = date.today()
    start_date = today - timedelta(days=days)
    start_key = int(start_date.strftime("%Y%m%d"))
    
    results = db.query(
        DimDate.full_date,
        func.sum(FactTransaction.amount).label("revenue")
    ).join(
        FactTransaction, DimDate.date_key == FactTransaction.date_key
    ).filter(
        DimDate.date_key >= start_key
    ).group_by(
        DimDate.full_date
    ).order_by(
        DimDate.full_date
    ).all()
    
    return [
        TimeSeriesPoint(
            date=row.full_date.strftime("%Y-%m-%d"),
            value=float(row.revenue or 0)
        )
        for row in results
    ]


@cache(expire=300, prefix="chart")
async def get_revenue_by_category(db: Session, limit: int = 6) -> list[RevenueByCategory]:
    """Get revenue breakdown by merchant category."""
    results = db.query(
        DimMerchant.category,
        func.sum(FactTransaction.amount).label("revenue")
    ).join(
        FactTransaction, DimMerchant.merchant_id == FactTransaction.merchant_id
    ).group_by(
        DimMerchant.category
    ).order_by(
        func.sum(FactTransaction.amount).desc()
    ).limit(limit).all()
    
    total = sum(float(r.revenue) for r in results)
    
    return [
        RevenueByCategory(
            category=row.category,
            revenue=float(row.revenue),
            percentage=round((float(row.revenue) / total) * 100, 1) if total else 0
        )
        for row in results
    ]


@cache(expire=300, prefix="chart")
async def get_payment_method_split(db: Session) -> list[PaymentMethodSplit]:
    """Get transaction count by payment method."""
    results = db.query(
        FactTransaction.payment_method,
        func.count(FactTransaction.transaction_id).label("count")
    ).group_by(
        FactTransaction.payment_method
    ).all()
    
    total = sum(r.count for r in results)
    
    return [
        PaymentMethodSplit(
            method=row.payment_method.value.replace("_", " ").title(),
            count=row.count,
            percentage=round((row.count / total) * 100, 1) if total else 0
        )
        for row in results
    ]
