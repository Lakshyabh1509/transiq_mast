"""Upload API routes for CSV processing."""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import APIResponse, CSVUploadResult
from app.services import process_csv_upload

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/csv", response_model=APIResponse[CSVUploadResult])
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and process a CSV file with transaction data.
    
    Expected columns:
    - transaction_id: Unique transaction identifier
    - merchant_code: Merchant identifier
    - customer_code: Customer identifier  
    - amount: Transaction amount (positive number)
    - transaction_date: Date/datetime of transaction
    
    Optional columns:
    - merchant_name, category, segment, payment_method, is_successful
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        contents = await file.read()
        csv_content = contents.decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")
    
    result = process_csv_upload(db, csv_content)
    
    return APIResponse(
        data=result,
        meta={"filename": file.filename}
    )
