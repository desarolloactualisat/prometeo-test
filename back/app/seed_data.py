# app/seed_data.py
# ------------------------------------------------------------------
# Inserta datos iniciales para el modelo RBAC:
#   • modules  – uno por cada “tabla‑módulo” de la app
#   • profiles – perfil superadmin
#   • permissions – acceso total del superadmin a todos los módulos
#   • users – usuario administrador con contraseña bcrypt
# ------------------------------------------------------------------

from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

from app.database import SessionLocal, engine
from app.models import Base, Module, Profile, Permission, User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Si decides que “módulo” == “tabla”, mantén la lista sincronizada con tu esquema:
MODULE_NAMES = [
    "users",
    "chart_of_accounts",
    "profiles",
    "modules",
    "permissions",
    "expense_types",
    "expense_details",
    "product_catalog",
    "bank_accounts",
    "financial_operations",
    "invoices",
    "purchase_orders",
    "import_declarations",
    "cg_invoice",
    "cg_breakdown",
]


def seed_db() -> None:
    db = SessionLocal()

    try:
        # ----------------------------------------------------------
        # 1) MÓDULOS
        # ----------------------------------------------------------
        existing = {m.name for m in db.query(Module.name).all()}

        for name in MODULE_NAMES:
            if name not in existing:
                db.add(
                    Module(
                        name=name,
                        description=f"Logical module for '{name}' table",
                    )
                )
        db.commit()

        # ----------------------------------------------------------
        # 2) PERFIL SUPERADMIN
        # ----------------------------------------------------------
        superadmin = db.query(Profile).filter_by(name="superadmin").first()
        if not superadmin:
            superadmin = Profile(
                name="superadmin",
                description="Perfil con acceso total a todos los módulos",
            )
            db.add(superadmin)
            db.commit()

        # ----------------------------------------------------------
        # 3) PERMISOS DEL SUPERADMIN
        # ----------------------------------------------------------
        all_modules = db.query(Module).all()
        for mod in all_modules:
            exists = (
                db.query(Permission)
                .filter_by(profile_id=superadmin.id, module_id=mod.id)
                .first()
            )
            if not exists:
                db.add(
                    Permission(
                        profile_id=superadmin.id,
                        module_id=mod.id,
                        can_access=True,
                        can_add=True,
                        can_edit=True,
                        can_delete=True,
                    )
                )
        db.commit()

        # ----------------------------------------------------------
        # 4) USUARIO ADMIN
        # ----------------------------------------------------------
        if not db.query(User).filter_by(username="admin").first():
            admin = User(
                profile_id=superadmin.id,
                username="admin",
                first_name="Super",
                last_name="Admin",
                email="admin@prometeo.com",
                hashed_password=pwd_context.hash("admin123"),
            )
            db.add(admin)
            db.commit()

        print("✅  Seed completado correctamente.")

    except IntegrityError as e:
        db.rollback()
        print("❌  Error de integridad en el seed:", e.orig)
    finally:
        db.close()


if __name__ == "__main__":
    # Crea todas las tablas si aún no existen (útil en desarrollo)
    Base.metadata.create_all(bind=engine)
    seed_db()
