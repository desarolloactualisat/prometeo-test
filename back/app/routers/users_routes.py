from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, join
from app.database import SessionLocal
from app.crear_esquema import users, modules, profiles, permissions
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

@router.get("/api/users/{user_id}/permissions")
def get_user_permissions(user_id: int, db: Session = Depends(get_db)):
    """
    Fetch permissions for a specific user by user_id.
    """
    permissions_query = (
        select(
            modules.c.name.label("module_name"),
            permissions.c.can_access,
            permissions.c.can_add,
            permissions.c.can_edit,
            permissions.c.can_delete,
        )
        .select_from(
            join(users, profiles, users.c.profile_id == profiles.c.id)
            .join(permissions, permissions.c.profile_id == profiles.c.id)
            .join(modules, permissions.c.module_id == modules.c.id)
        )
        .where(users.c.id == user_id)
    )
    permissions_result = db.execute(permissions_query).fetchall()

    permissions_list = [
        {
            "module_name": row.module_name,
            "permissions": {
                "can_access": row.can_access,
                "can_add": row.can_add,
                "can_edit": row.can_edit,
                "can_delete": row.can_delete,
            },
        }
        for row in permissions_result
    ]

    return {"user_id": user_id, "permissions": permissions_list}