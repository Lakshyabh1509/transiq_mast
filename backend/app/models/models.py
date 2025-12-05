"""Star Schema database models for transaction analytics."""
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import (
    Column, Integer, String, Date, DateTime, Numeric, 
    ForeignKey, Boolean, Index, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
import enum

from app.db import Base


class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class PaymentMethod(str, enum.Enum):
    CREDIT = "credit"
    DEBIT = "debit"
    DIGITAL_WALLET = "digital_wallet"
    BANK_TRANSFER = "bank_transfer"


# ============================================
# DIMENSION TABLES
# ============================================

class DimDate(Base):
    """Date dimension for optimized analytics queries."""
    __tablename__ = "dim_date"
    
    date_key = Column(Integer, primary_key=True)  # YYYYMMDD format
    full_date = Column(Date, nullable=False, unique=True, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday
    day_name = Column(String(10), nullable=False)
    week_of_year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    month_name = Column(String(10), nullable=False)
    quarter = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    is_weekend = Column(Boolean, nullable=False, default=False)
    is_month_start = Column(Boolean, nullable=False, default=False)
    is_month_end = Column(Boolean, nullable=False, default=False)
    
    # Relationships
    transactions = relationship("FactTransaction", back_populates="date_dim")


class DimMerchant(Base):
    """Merchant dimension."""
    __tablename__ = "dim_merchant"
    
    merchant_id = Column(Integer, primary_key=True, autoincrement=True)
    merchant_code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100))
    registration_date = Column(Date, nullable=False)
    city = Column(String(100))
    country = Column(String(100), default="US")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    transactions = relationship("FactTransaction", back_populates="merchant")
    churn_scores = relationship("MerchantChurnScore", back_populates="merchant")
    
    __table_args__ = (
        Index("idx_merchant_category", "category"),
        Index("idx_merchant_active", "is_active"),
    )


class DimCustomer(Base):
    """Customer dimension."""
    __tablename__ = "dim_customer"
    
    customer_id = Column(Integer, primary_key=True, autoincrement=True)
    customer_code = Column(String(50), unique=True, nullable=False, index=True)
    segment = Column(String(50), nullable=False)  # premium, standard, basic
    acquisition_source = Column(String(100))  # organic, referral, paid
    first_transaction_date = Column(Date)
    city = Column(String(100))
    country = Column(String(100), default="US")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    transactions = relationship("FactTransaction", back_populates="customer")
    
    __table_args__ = (
        Index("idx_customer_segment", "segment"),
    )


# ============================================
# FACT TABLE
# ============================================

class FactTransaction(Base):
    """Central fact table for transactions."""
    __tablename__ = "fact_transaction"
    
    transaction_id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_code = Column(String(100), unique=True, nullable=False, index=True)
    
    # Foreign Keys (indexed for fast joins)
    merchant_id = Column(Integer, ForeignKey("dim_merchant.merchant_id"), nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("dim_customer.customer_id"), nullable=False, index=True)
    date_key = Column(Integer, ForeignKey("dim_date.date_key"), nullable=False, index=True)
    
    # Measures
    amount = Column(Numeric(12, 2), nullable=False)
    fee_amount = Column(Numeric(10, 2), default=0)
    currency = Column(String(3), default="USD")
    payment_method = Column(SQLEnum(PaymentMethod), nullable=False)
    
    # Transaction metadata
    transaction_time = Column(DateTime, nullable=False)
    is_successful = Column(Boolean, default=True)
    is_refunded = Column(Boolean, default=False)
    
    # Relationships
    merchant = relationship("DimMerchant", back_populates="transactions")
    customer = relationship("DimCustomer", back_populates="transactions")
    date_dim = relationship("DimDate", back_populates="transactions")
    
    __table_args__ = (
        Index("idx_transaction_date_merchant", "date_key", "merchant_id"),
        Index("idx_transaction_amount", "amount"),
    )


# ============================================
# ANALYTICS TABLES
# ============================================

class MerchantChurnScore(Base):
    """Precomputed churn risk scores per merchant."""
    __tablename__ = "merchant_churn_score"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    merchant_id = Column(Integer, ForeignKey("dim_merchant.merchant_id"), nullable=False, index=True)
    
    score = Column(Numeric(5, 4), nullable=False)  # 0.0000 to 1.0000
    risk_level = Column(SQLEnum(RiskLevel), nullable=False)
    prediction_date = Column(Date, nullable=False)
    
    # Contributing factors
    days_since_last_transaction = Column(Integer)
    transaction_trend = Column(Numeric(5, 2))  # % change
    revenue_trend = Column(Numeric(5, 2))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    merchant = relationship("DimMerchant", back_populates="churn_scores")
    
    __table_args__ = (
        Index("idx_churn_merchant_date", "merchant_id", "prediction_date"),
        Index("idx_churn_risk", "risk_level"),
    )
