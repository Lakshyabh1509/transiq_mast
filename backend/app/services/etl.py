"""ETL Service for CSV processing with Pandas."""
import pandas as pd
from datetime import date, datetime
from io import StringIO
from typing import Tuple
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert

from app.models import DimDate, DimMerchant, DimCustomer, FactTransaction, PaymentMethod
from app.schemas import CSVUploadResult, CSVUploadError
from app.core.cache import invalidate_cache


def populate_date_dimension(db: Session, start_date: date, end_date: date) -> int:
    """
    Populate the DimDate table with dates in range.
    Returns number of dates inserted.
    """
    dates_inserted = 0
    current = start_date
    
    while current <= end_date:
        date_key = int(current.strftime("%Y%m%d"))
        
        # Check if already exists
        exists = db.query(DimDate).filter(DimDate.date_key == date_key).first()
        if not exists:
            dim_date = DimDate(
                date_key=date_key,
                full_date=current,
                day_of_week=current.weekday(),
                day_name=current.strftime("%A"),
                week_of_year=current.isocalendar()[1],
                month=current.month,
                month_name=current.strftime("%B"),
                quarter=(current.month - 1) // 3 + 1,
                year=current.year,
                is_weekend=current.weekday() >= 5,
                is_month_start=current.day == 1,
                is_month_end=(current.replace(day=28) + pd.Timedelta(days=4)).replace(day=1) - pd.Timedelta(days=1) == current
            )
            db.add(dim_date)
            dates_inserted += 1
        
        current += pd.Timedelta(days=1)
    
    db.commit()
    return dates_inserted


def validate_csv_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, list[CSVUploadError]]:
    """
    Validate CSV data and return clean rows + error list.
    Bad rows are rejected, not the whole upload.
    """
    errors = []
    valid_mask = pd.Series([True] * len(df))
    
    # Required columns
    required_cols = ["transaction_id", "merchant_code", "customer_code", "amount", "transaction_date"]
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    
    # Validate amounts (must be positive numbers)
    amount_invalid = pd.to_numeric(df["amount"], errors="coerce").isna() | (pd.to_numeric(df["amount"], errors="coerce") <= 0)
    for idx in df[amount_invalid].index:
        errors.append(CSVUploadError(
            row_number=idx + 2,  # +2 for header and 0-index
            error="Invalid amount value",
            data={"amount": str(df.loc[idx, "amount"])}
        ))
    valid_mask &= ~amount_invalid
    
    # Validate dates
    date_invalid = pd.to_datetime(df["transaction_date"], errors="coerce").isna()
    for idx in df[date_invalid].index:
        errors.append(CSVUploadError(
            row_number=idx + 2,
            error="Invalid date format",
            data={"transaction_date": str(df.loc[idx, "transaction_date"])}
        ))
    valid_mask &= ~date_invalid
    
    # Return clean and error data
    return df[valid_mask].copy(), errors


def process_csv_upload(
    db: Session,
    csv_content: str,
    delimiter: str = ","
) -> CSVUploadResult:
    """
    Process CSV upload with upsert logic.
    """
    try:
        df = pd.read_csv(StringIO(csv_content), delimiter=delimiter)
    except Exception as e:
        return CSVUploadResult(
            success=False,
            rows_processed=0,
            rows_inserted=0,
            rows_updated=0,
            rows_failed=0,
            errors=[{"error": f"Failed to parse CSV: {str(e)}"}]
        )
    
    total_rows = len(df)
    
    # Validate
    try:
        clean_df, validation_errors = validate_csv_data(df)
    except ValueError as e:
        return CSVUploadResult(
            success=False,
            rows_processed=0,
            rows_inserted=0,
            rows_updated=0,
            rows_failed=total_rows,
            errors=[{"error": str(e)}]
        )
    
    rows_failed = len(validation_errors)
    rows_inserted = 0
    rows_updated = 0
    
    # Process each valid row
    for _, row in clean_df.iterrows():
        try:
            # Upsert Merchant
            merchant = db.query(DimMerchant).filter(
                DimMerchant.merchant_code == row["merchant_code"]
            ).first()
            
            if not merchant:
                merchant = DimMerchant(
                    merchant_code=row["merchant_code"],
                    name=row.get("merchant_name", row["merchant_code"]),
                    category=row.get("category", "Unknown"),
                    registration_date=date.today(),
                )
                db.add(merchant)
                db.flush()
            
            # Upsert Customer
            customer = db.query(DimCustomer).filter(
                DimCustomer.customer_code == row["customer_code"]
            ).first()
            
            if not customer:
                customer = DimCustomer(
                    customer_code=row["customer_code"],
                    segment=row.get("segment", "standard"),
                    acquisition_source=row.get("acquisition_source", "organic"),
                )
                db.add(customer)
                db.flush()
            
            # Get/create date dimension
            tx_date = pd.to_datetime(row["transaction_date"]).date()
            date_key = int(tx_date.strftime("%Y%m%d"))
            
            dim_date = db.query(DimDate).filter(DimDate.date_key == date_key).first()
            if not dim_date:
                populate_date_dimension(db, tx_date, tx_date)
            
            # Check if transaction exists (upsert)
            tx_code = str(row["transaction_id"])
            existing_tx = db.query(FactTransaction).filter(
                FactTransaction.transaction_code == tx_code
            ).first()
            
            payment_method = PaymentMethod.CREDIT
            if "payment_method" in row:
                pm = str(row["payment_method"]).lower().replace(" ", "_")
                if pm in PaymentMethod.__members__:
                    payment_method = PaymentMethod(pm)
            
            if existing_tx:
                # Update
                existing_tx.amount = float(row["amount"])
                existing_tx.payment_method = payment_method
                rows_updated += 1
            else:
                # Insert
                transaction = FactTransaction(
                    transaction_code=tx_code,
                    merchant_id=merchant.merchant_id,
                    customer_id=customer.customer_id,
                    date_key=date_key,
                    amount=float(row["amount"]),
                    payment_method=payment_method,
                    transaction_time=pd.to_datetime(row["transaction_date"]),
                    is_successful=row.get("is_successful", True),
                )
                db.add(transaction)
                rows_inserted += 1
                
        except Exception as e:
            rows_failed += 1
            validation_errors.append(CSVUploadError(
                row_number=_ + 2,
                error=str(e)
            ))
    
    db.commit()
    
    # Invalidate analytics cache
    invalidate_cache()
    
    return CSVUploadResult(
        success=rows_failed < total_rows,
        rows_processed=total_rows,
        rows_inserted=rows_inserted,
        rows_updated=rows_updated,
        rows_failed=rows_failed,
        errors=[e.model_dump() for e in validation_errors[:50]]  # Limit errors returned
    )
