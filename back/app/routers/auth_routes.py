from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from app.database import SessionLocal
# Importar la tabla users desde crear_esquema.py
from app.crear_esquema import users
from app.auth_utils import verify_password, create_access_token, verify_token
from pydantic import BaseModel

router = APIRouter()

# Modelo para las credenciales de inicio de sesión


class LoginCredentials(BaseModel):
    email: str
    password: str

# Dependencia para obtener la sesión de la base de datos


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/api/auth/login")
def login(credentials: LoginCredentials, db: Session = Depends(get_db)):

    print("Login endpoint called with:", credentials)
    # Buscar al usuario en la base de datos por email
    query = select(users).where(users.c.email == credentials.email)
    user = db.execute(query).fetchone()

    # Verificar si el usuario existe y si la contraseña es válida
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Crear un token JWT para el usuario
    token_data = {"sub": user.email, "id": user.id}
    access_token = create_access_token(token_data)

    # Retornar el token y los datos del usuario
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    }


@router.post("/api/auth/logout")
def logout():
  return JSONResponse(content={"message": "Successfully logged out"}, status_code=200)
