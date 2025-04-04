from fastapi import FastAPI
from app.database import SessionLocal
from sqlalchemy import text

app = FastAPI()

@app.get("/")
def read_root():
    return {"mensaje": "Hola desde FastAPI"}
