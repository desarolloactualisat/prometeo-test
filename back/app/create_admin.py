from sqlalchemy.orm import Session
from .database import engine, SessionLocal  #TODO: Asegúrate de que estos estén bien configurados
from .models import Base, User
from .auth import hash_password
from dotenv import load_dotenv
load_dotenv() 

# Crear las tablas si aún no existen
Base.metadata.create_all(bind=engine)

def create_admin(email: str, password: str):
    db: Session = SessionLocal()
    try:
        # Verifica si ya existe un usuario con ese nombre
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print("El usuario admin ya existe.")
            return

        hashed = hash_password(password)
        admin_user = User(email=email, hashed_password=hashed, is_admin=1)
        db.add(admin_user)
        db.commit()
        print("Usuario admin creado exitosamente.")
    except Exception as e:
        print("Error al crear el usuario admin:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Ajusta estos valores según lo que necesites
    create_admin("admin@prometeo.com", "admprometeo246")
