from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, insert, update, delete
from sqlalchemy.exc import SQLAlchemyError
from app.database import SessionLocal
from app.crear_esquema import bank_accounts

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Crear una nueva cuenta bancaria
@router.post("/api/bank-accounts", status_code=201)
def create_bank_account(bank: dict, db: Session = Depends(get_db)):
    try:
        query = insert(bank_accounts).values(
            bank=bank["bank"],
            account_number=bank["account_number"],
            currency=bank["currency"],
            chart_account_id=bank["chart_account_id"],
        )
        result = db.execute(query)
        db.commit()
        return {"id": result.lastrowid, "message": "Bank account created successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/api/bank-accounts")
def get_all_bank_accounts(db: Session = Depends(get_db)):
    try:
        stmt = select(bank_accounts) 
        rows = db.execute(stmt).mappings().all()  
        return rows                         
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
# Obtener una cuenta bancaria por ID
@router.get("/api/bank-accounts/{account_id}")
def get_bank_account(account_id: int, db: Session = Depends(get_db)):
    try:
        query = select(bank_accounts).where(bank_accounts.c.id == account_id)
        result = db.execute(query).fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Bank account not found")
        return dict(result)
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Actualizar una cuenta bancaria
@router.put("/api/bank-accounts/{account_id}")
def update_bank_account(account_id: int, bank: dict, db: Session = Depends(get_db)):
    try:
        query = (
            update(bank_accounts)
            .where(bank_accounts.c.id == account_id)
            .values(
                bank=bank["bank"],
                account_number=bank["account_number"],
                currency=bank["currency"],
                chart_account_id=bank["chart_account_id"],
            )
        )
        result = db.execute(query)
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Bank account not found")
        return {"message": "Bank account updated successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Eliminar una cuenta bancaria
@router.delete("/api/bank-accounts/{account_id}")
def delete_bank_account(account_id: int, db: Session = Depends(get_db)):
    try:
        query = delete(bank_accounts).where(bank_accounts.c.id == account_id)
        result = db.execute(query)
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Bank account not found")
        return {"message": "Bank account deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")