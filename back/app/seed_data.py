# app/seed_data.py

from app.database import SessionLocal, engine
from app.models import Base, Module, Profile, Permission, User
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def seed_db():
    # Lista de las tablas que consideras 'módulos' (tal como mencionaste)
    table_names = [
        "usuarios", 
        "cuentas_contables", 
        "perfiles", 
        "modulos", 
        "permisos",
        "tipos_gastos", 
        "detalle_gastos", 
        "catalogo_productos",
        "cuentas_bancarias", 
        "document_financial_operation",
        "comprobantes", 
        "documento_purchaseorder", 
        "pedimentos",
        "factura_cg", 
        "desglose_cg"
    ]

    db = SessionLocal()
    
    try:
        # 1) Crear módulos (si no existen)
        modules_in_db = db.query(Module).all()
        existing_module_names = {m.name for m in modules_in_db}

        for table_name in table_names:
            if table_name not in existing_module_names:
                new_mod = Module(
                    name=table_name,
                    description=f"Módulo para la tabla {table_name}"
                )
                db.add(new_mod)
        db.commit()

        # 2) Crear el perfil superadmin (si no existe)
        superadmin = db.query(Profile).filter_by(name="superadmin").first()
        if not superadmin:
            superadmin = Profile(
                name="superadmin",
                description="Perfil con todos los permisos"
            )
            db.add(superadmin)
            db.commit()

        # 3) Otorgar permisos a superadmin para todos los módulos
        all_modules = db.query(Module).all()
        for module in all_modules:
            perm = db.query(Permission).filter_by(
                profile_id=superadmin.id,
                module_id=module.id
            ).first()
            if not perm:
                new_perm = Permission(
                    profile_id=superadmin.id,
                    module_id=module.id,
                    can_access=True,
                    can_add=True,
                    can_edit=True,
                    can_delete=True,
                )
                db.add(new_perm)
        db.commit()

        # 4) Crear usuario 'admin' con perfil superadmin (si no existe)
        admin_user = db.query(User).filter_by(username="admin").first()
        if not admin_user:
            hashed_pwd = pwd_context.hash("admin123")
            admin_user = User(
                profile_id=superadmin.id,
                username="admin",
                first_name="Super",
                last_name="Admin",
                email="admin@prometeo.com",
                password=hashed_pwd
            )
            db.add(admin_user)
            db.commit()

        print("Seed completado exitosamente.")

    except IntegrityError as e:
        db.rollback()
        print("Ocurrió un error de integridad al hacer el seed:", e)
    finally:
        db.close()

if __name__ == "__main__":
    # Crear las tablas en caso de que no existan (sólo si usas el declarative Base)
    Base.metadata.create_all(bind=engine)
    seed_db()
