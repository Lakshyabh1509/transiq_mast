"""Churn prediction service."""
from datetime import date, timedelta
from decimal import Decimal
from sqlalchemy import func, and_, distinct
from sqlalchemy.orm import Session

from app.models import (
    FactTransaction, DimMerchant, MerchantChurnScore, 
    RiskLevel as ModelRiskLevel
)
from app.schemas import ChurnRiskMerchant, PaginatedResponse, PaginationMeta


def calculate_risk_level(score: float) -> ModelRiskLevel:
    """Map score to risk level."""
    if score >= 0.8:
        return ModelRiskLevel.CRITICAL
    elif score >= 0.6:
        return ModelRiskLevel.HIGH
    elif score >= 0.4:
        return ModelRiskLevel.MEDIUM
    return ModelRiskLevel.LOW


def calculate_churn_scores(db: Session) -> int:
    """
    Calculate churn risk scores for all merchants.
    Run as background job after data upload.
    
    Scoring factors:
    - Days since last transaction (higher = riskier)
    - Transaction volume trend (declining = riskier)
    - Revenue trend (declining = riskier)
    """
    today = date.today()
    thirty_days_ago = today - timedelta(days=30)
    sixty_days_ago = today - timedelta(days=60)
    
    merchants = db.query(DimMerchant).filter(DimMerchant.is_active == True).all()
    scores_updated = 0
    
    for merchant in merchants:
        m_id = merchant.merchant_id
        
        # Days since last transaction
        last_tx = db.query(func.max(FactTransaction.transaction_time)).filter(
            FactTransaction.merchant_id == m_id
        ).scalar()
        
        days_inactive = (today - last_tx.date()).days if last_tx else 90
        
        # Transaction count trend (last 30 days vs prior 30 days)
        recent_key = int(thirty_days_ago.strftime("%Y%m%d"))
        prior_key = int(sixty_days_ago.strftime("%Y%m%d"))
        
        recent_count = db.query(func.count(FactTransaction.transaction_id)).filter(
            and_(
                FactTransaction.merchant_id == m_id,
                FactTransaction.date_key >= recent_key
            )
        ).scalar() or 0
        
        prior_count = db.query(func.count(FactTransaction.transaction_id)).filter(
            and_(
                FactTransaction.merchant_id == m_id,
                FactTransaction.date_key >= prior_key,
                FactTransaction.date_key < recent_key
            )
        ).scalar() or 1
        
        tx_trend = ((recent_count - prior_count) / prior_count) * 100 if prior_count else 0
        
        # Revenue trend
        recent_rev = db.query(func.sum(FactTransaction.amount)).filter(
            and_(
                FactTransaction.merchant_id == m_id,
                FactTransaction.date_key >= recent_key
            )
        ).scalar() or 0
        
        prior_rev = db.query(func.sum(FactTransaction.amount)).filter(
            and_(
                FactTransaction.merchant_id == m_id,
                FactTransaction.date_key >= prior_key,
                FactTransaction.date_key < recent_key
            )
        ).scalar() or 1
        
        rev_trend = ((float(recent_rev) - float(prior_rev)) / float(prior_rev)) * 100 if prior_rev else 0
        
        # Calculate score (0-1)
        # Inactivity component (0-0.4)
        inactivity_score = min(days_inactive / 60, 1.0) * 0.4
        
        # Transaction trend component (0-0.3)
        # Negative trend increases score
        tx_trend_score = max(0, min(-tx_trend / 100, 1.0)) * 0.3
        
        # Revenue trend component (0-0.3)
        rev_trend_score = max(0, min(-rev_trend / 100, 1.0)) * 0.3
        
        total_score = inactivity_score + tx_trend_score + rev_trend_score
        risk_level = calculate_risk_level(total_score)
        
        # Upsert churn score
        existing = db.query(MerchantChurnScore).filter(
            and_(
                MerchantChurnScore.merchant_id == m_id,
                MerchantChurnScore.prediction_date == today
            )
        ).first()
        
        if existing:
            existing.score = total_score
            existing.risk_level = risk_level
            existing.days_since_last_transaction = days_inactive
            existing.transaction_trend = tx_trend
            existing.revenue_trend = rev_trend
        else:
            new_score = MerchantChurnScore(
                merchant_id=m_id,
                score=total_score,
                risk_level=risk_level,
                prediction_date=today,
                days_since_last_transaction=days_inactive,
                transaction_trend=tx_trend,
                revenue_trend=rev_trend
            )
            db.add(new_score)
        
        scores_updated += 1
    
    db.commit()
    return scores_updated


def get_churn_risks(
    db: Session,
    page: int = 1,
    per_page: int = 20,
    risk_level: str | None = None,
    sort_by: str = "score",
    sort_desc: bool = True
) -> PaginatedResponse[ChurnRiskMerchant]:
    """Get paginated list of merchants with churn risk scores."""
    query = db.query(
        MerchantChurnScore,
        DimMerchant.name,
        DimMerchant.category
    ).join(
        DimMerchant, MerchantChurnScore.merchant_id == DimMerchant.merchant_id
    )
    
    # Filter by risk level
    if risk_level:
        query = query.filter(MerchantChurnScore.risk_level == risk_level)
    
    # Get latest scores only
    subquery = db.query(
        MerchantChurnScore.merchant_id,
        func.max(MerchantChurnScore.prediction_date).label("max_date")
    ).group_by(MerchantChurnScore.merchant_id).subquery()
    
    query = query.join(
        subquery,
        and_(
            MerchantChurnScore.merchant_id == subquery.c.merchant_id,
            MerchantChurnScore.prediction_date == subquery.c.max_date
        )
    )
    
    # Count total
    total = query.count()
    
    # Sorting
    sort_col = getattr(MerchantChurnScore, sort_by, MerchantChurnScore.score)
    if sort_desc:
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())
    
    # Pagination
    offset = (page - 1) * per_page
    results = query.offset(offset).limit(per_page).all()
    
    merchants = [
        ChurnRiskMerchant(
            merchant_id=row[0].merchant_id,
            merchant_name=row[1],
            category=row[2],
            risk_score=float(row[0].score),
            risk_level=row[0].risk_level.value,
            days_inactive=row[0].days_since_last_transaction,
            transaction_trend=float(row[0].transaction_trend) if row[0].transaction_trend else None,
            revenue_trend=float(row[0].revenue_trend) if row[0].revenue_trend else None
        )
        for row in results
    ]
    
    return PaginatedResponse(
        data=merchants,
        meta=PaginationMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=(total + per_page - 1) // per_page
        )
    )
