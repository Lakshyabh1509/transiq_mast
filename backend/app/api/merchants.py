"""Merchant API routes."""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db import get_db
from app.models import DimMerchant, FactTransaction
from app.schemas import PaginatedResponse, PaginationMeta, MerchantResponse, APIResponse

router = APIRouter(prefix="/merchants", tags=["Merchants"])


@router.get("", response_model=PaginatedResponse[MerchantResponse])
async def list_merchants(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = Query(None, description="Search by name"),
    category: str | None = Query(None, description="Filter by category"),
    is_active: bool | None = Query(None, description="Filter by active status"),
    db: Session = Depends(get_db)
):
    """Get paginated list of merchants."""
    query = db.query(DimMerchant)
    
    if search:
        query = query.filter(DimMerchant.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(DimMerchant.category == category)
    if is_active is not None:
        query = query.filter(DimMerchant.is_active == is_active)
    
    total = query.count()
    
    merchants = query.order_by(DimMerchant.name).offset(
        (page - 1) * per_page
    ).limit(per_page).all()
    
    return PaginatedResponse(
        data=[MerchantResponse.model_validate(m) for m in merchants],
        meta=PaginationMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=(total + per_page - 1) // per_page
        )
    )


@router.get("/categories", response_model=APIResponse[list[str]])
async def list_categories(db: Session = Depends(get_db)):
    """Get list of unique merchant categories."""
    categories = db.query(DimMerchant.category).distinct().all()
    return APIResponse(data=[c[0] for c in categories])


@router.get("/{merchant_id}", response_model=APIResponse[MerchantResponse])
async def get_merchant(merchant_id: int, db: Session = Depends(get_db)):
    """Get merchant details by ID."""
    merchant = db.query(DimMerchant).filter(DimMerchant.merchant_id == merchant_id).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return APIResponse(data=MerchantResponse.model_validate(merchant))


@router.get("/{merchant_id}/stats", response_model=APIResponse[dict])
async def get_merchant_stats(merchant_id: int, db: Session = Depends(get_db)):
    """Get transaction stats for a specific merchant."""
    merchant = db.query(DimMerchant).filter(DimMerchant.merchant_id == merchant_id).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    
    stats = db.query(
        func.count(FactTransaction.transaction_id).label("total_transactions"),
        func.sum(FactTransaction.amount).label("total_revenue"),
        func.avg(FactTransaction.amount).label("avg_transaction")
    ).filter(FactTransaction.merchant_id == merchant_id).first()
    
    return APIResponse(data={
        "merchant_id": merchant_id,
        "total_transactions": stats.total_transactions or 0,
        "total_revenue": float(stats.total_revenue or 0),
        "avg_transaction": float(stats.avg_transaction or 0)
    })
