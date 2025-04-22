from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, insert, update, delete
from sqlalchemy.exc import SQLAlchemyError
from app.database import SessionLocal
from app.crear_esquema import chart_of_accounts

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Crear una nueva cuenta contable
@router.post("/api/chart-accounts", status_code=201)
def create_chart_account(account: dict, db: Session = Depends(get_db)):
    try:
        query = insert(chart_of_accounts).values(
            account=account["account"],
            description=account["description"],
        )
        result = db.execute(query)
        db.commit()
        return {"id": result.lastrowid, "message": "Chart account created successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Obtener todas las cuentas contables
@router.get("/api/chart-accounts")
def get_all_chart_accounts(db: Session = Depends(get_db)):
    try:
        stmt = select(chart_of_accounts)
        result = db.execute(stmt).mappings().all()
        return result
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Obtener una cuenta contable por ID
@router.get("/api/chart-accounts/{account_id}")
def get_chart_account(account_id: int, db: Session = Depends(get_db)):
    try:
        query = select(chart_of_accounts).where(chart_of_accounts.c.id == account_id)
        result = db.execute(query).fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Chart account not found")
        return dict(result)
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Actualizar una cuenta contable
@router.put("/api/chart-accounts/{account_id}")
def update_chart_account(account_id: int, account: dict, db: Session = Depends(get_db)):
    try:
        query = (
            update(chart_of_accounts)
            .where(chart_of_accounts.c.id == account_id)
            .values(
                account=account["account"],
                description=account["description"],
            )
        )
        result = db.execute(query)
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Chart account not found")
        return {"message": "Chart account updated successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# Eliminar una cuenta contable
@router.delete("/api/chart-accounts/{account_id}")
def delete_chart_account(account_id: int, db: Session = Depends(get_db)):
    try:
        query = delete(chart_of_accounts).where(chart_of_accounts.c.id == account_id)
        result = db.execute(query)
        db.commit()
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Chart account not found")
        return {"message": "Chart account deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")