"""Churn Risk API routes."""
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import PaginatedResponse, ChurnRiskMerchant, APIResponse
from app.services import get_churn_risks, calculate_churn_scores

router = APIRouter(prefix="/churn", tags=["Churn Risk"])


@router.get("/risks", response_model=PaginatedResponse[ChurnRiskMerchant])
async def list_churn_risks(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    risk_level: str | None = Query(None, description="Filter by risk level"),
    sort_by: str = Query("score", description="Sort field"),
    sort_desc: bool = Query(True, description="Sort descending"),
    db: Session = Depends(get_db)
):
    """Get paginated list of merchants with churn risk scores."""
    return get_churn_risks(
        db,
        page=page,
        per_page=per_page,
        risk_level=risk_level,
        sort_by=sort_by,
        sort_desc=sort_desc
    )


@router.post("/recalculate", response_model=APIResponse[dict])
async def recalculate_churn_scores(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Trigger recalculation of churn scores (background task)."""
    # For immediate feedback, we'll run synchronously
    # In production, this should be a Celery task
    count = calculate_churn_scores(db)
    return APIResponse(
        data={"message": f"Recalculated churn scores for {count} merchants"},
        meta={"merchants_updated": count}
    )
