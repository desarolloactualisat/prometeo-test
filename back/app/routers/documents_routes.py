# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from tempfile import NamedTemporaryFile
import shutil
from fastapi import APIRouter, HTTPException, Depends

from app.leer_pdf import extraer_gastos
router = APIRouter()
app = FastAPI()

@router.get("/api/documents")
async def gastos_comprobados():
    print("solicitud recibida:")
    try:
        gastos = extraer_gastos()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar PDF: {e}"
        )
    print("gastos:", gastos)
    if not gastos:
        raise HTTPException(
            status_code=422,
            detail="No se encontró la sección 'Gastos Comprobados'"
        )

    return {"gastos": gastos}
