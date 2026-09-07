import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Forzar la codificación del cliente de PostgreSQL a UTF-8 a nivel del sistema
os.environ["PGCLIENTENCODING"] = "utf-8"

# Configurar salida de consola para Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={
        "options": "-c client_encoding=utf8"
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Función generadora requerida por routers/productos.py
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()