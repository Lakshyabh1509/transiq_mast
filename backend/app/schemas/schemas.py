"""Pydantic schemas for API request/response models."""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, Generic, TypeVar
from pydantic import BaseModel, Field
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class PaymentMethod(str, Enum):
    CREDIT = "credit"
    DEBIT = "debit"
    DIGITAL_WALLET = "digital_wallet"
    BANK_TRANSFER = "bank_transfer"


# ============================================
# BASE SCHEMAS
# ============================================

class MerchantBase(BaseModel):
    merchant_code: str
    name: str
    category: str
    subcategory: Optional[str] = None
    city: Optional[str] = None
    country: str = "US"


class MerchantResponse(MerchantBase):
    merchant_id: int
    registration_date: date
    is_active: bool
    
    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    customer_code: str
    segment: str
    acquisition_source: Optional[str] = None


class CustomerResponse(CustomerBase):
    customer_id: int
    first_transaction_date: Optional[date] = None
    is_active: bool
    
    class Config:
        from_attributes = True


class TransactionBase(BaseModel):
    amount: Decimal
    payment_method: PaymentMethod
    currency: str = "USD"


class TransactionResponse(TransactionBase):
    transaction_id: int
    transaction_code: str
    merchant_id: int
    customer_id: int
    transaction_time: datetime
    is_successful: bool
    is_refunded: bool
    fee_amount: Decimal
    
    class Config:
        from_attributes = True


# ============================================
# ANALYTICS SCHEMAS
# ============================================

class KPIMetric(BaseModel):
    """Single KPI with comparison context."""
    value: float
    formatted_value: str
    previous_value: Optional[float] = None
    change_percent: Optional[float] = None
    trend: Optional[str] = None  # "up", "down", "stable"


class DashboardKPIs(BaseModel):
    """All dashboard KPIs."""
    total_volume: KPIMetric
    total_revenue: KPIMetric
    active_merchants: KPIMetric
    churn_rate: KPIMetric
    avg_transaction: KPIMetric


class TimeSeriesPoint(BaseModel):
    """Single point in time series."""
    date: str
    value: float


class ChartData(BaseModel):
    """Generic chart data."""
    labels: list[str]
    datasets: list[dict]


class RevenueByCategory(BaseModel):
    category: str
    revenue: float
    percentage: float


class PaymentMethodSplit(BaseModel):
    method: str
    count: int
    percentage: float


class ChurnRiskMerchant(BaseModel):
    """Merchant churn risk entry."""
    merchant_id: int
    merchant_name: str
    category: str
    risk_score: float
    risk_level: RiskLevel
    days_inactive: Optional[int] = None
    transaction_trend: Optional[float] = None
    revenue_trend: Optional[float] = None
    last_transaction_date: Optional[date] = None


# ============================================
# PAGINATION & RESPONSE WRAPPERS
# ============================================

T = TypeVar("T")


class PaginationMeta(BaseModel):
    page: int = 1
    per_page: int = 20
    total: int
    total_pages: int


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response wrapper."""
    data: list[T]
    meta: PaginationMeta


class APIResponse(BaseModel, Generic[T]):
    """Standard non-paginated response wrapper."""
    data: T
    meta: Optional[dict] = None


# ============================================
# CSV UPLOAD
# ============================================

class CSVUploadResult(BaseModel):
    """Result of CSV upload processing."""
    success: bool
    rows_processed: int
    rows_inserted: int
    rows_updated: int
    rows_failed: int
    errors: list[dict] = []


class CSVUploadError(BaseModel):
    row_number: int
    error: str
    data: Optional[dict] = None
