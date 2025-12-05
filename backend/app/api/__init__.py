"""API module."""
from .dashboard import router as dashboard_router
from .churn import router as churn_router
from .merchants import router as merchants_router
from .upload import router as upload_router

__all__ = ["dashboard_router", "churn_router", "merchants_router", "upload_router"]
