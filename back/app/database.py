import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Recupera las variables de entorno, con valores por defecto si es necesario.
DATABASE_USER = os.getenv("MYSQL_USER")
DATABASE_PASSWORD = os.getenv("MYSQL_PASSWORD")
DATABASE_HOST = os.getenv("MYSQL_HOST")  # Usa el nombre del servicio definido en docker-compose
DATABASE_NAME = os.getenv("MYSQL_DATABASE")
DATABASE_PORT = os.getenv("MYSQL_PORT")

# Construye la cadena de conexión. En este ejemplo usamos mysql-connector-python.
DATABASE_URL = (
    f"mysql+mysqlconnector://{DATABASE_USER}:{DATABASE_PASSWORD}"
    f"@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
)

# Crea el engine y la sesión
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
