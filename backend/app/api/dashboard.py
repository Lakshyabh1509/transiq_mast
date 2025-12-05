"""Dashboard and Analytics API routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import APIResponse, DashboardKPIs, TimeSeriesPoint, RevenueByCategory, PaymentMethodSplit
from app.services import (
    get_dashboard_kpis, get_revenue_trend,
    get_revenue_by_category, get_payment_method_split
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/kpis", response_model=APIResponse[DashboardKPIs])
async def get_kpis(db: Session = Depends(get_db)):
    """Get all dashboard KPI metrics with period comparisons."""
    data = await get_dashboard_kpis(db)
    return APIResponse(data=data)


@router.get("/revenue-trend", response_model=APIResponse[list[TimeSeriesPoint]])
async def revenue_trend(days: int = 30, db: Session = Depends(get_db)):
    """Get daily revenue trend for the past N days."""
    data = await get_revenue_trend(db, days=days)
    return APIResponse(data=data, meta={"days": days})


@router.get("/revenue-by-category", response_model=APIResponse[list[RevenueByCategory]])
async def revenue_by_category(limit: int = 6, db: Session = Depends(get_db)):
    """Get revenue breakdown by merchant category."""
    data = await get_revenue_by_category(db, limit=limit)
    return APIResponse(data=data)


@router.get("/payment-methods", response_model=APIResponse[list[PaymentMethodSplit]])
async def payment_methods(db: Session = Depends(get_db)):
    """Get transaction count by payment method."""
    data = await get_payment_method_split(db)
    return APIResponse(data=data)
