
import os
import sys

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


# Configurar PostgreSQL para utilizar UTF-8
os.environ["PGCLIENTENCODING"] = "utf-8"


# Configurar la salida de consola para Windows
if sys.platform == "win32":
    if sys.stdout:
        sys.stdout.reconfigure(encoding="utf-8")
    if sys.stderr:
        sys.stderr.reconfigure(encoding="utf-8")


# Crear la conexión con PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={
        "options": "-c client_encoding=utf8"
    },
    pool_pre_ping=True,
    pool_recycle=300
)


# Configurar las sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Crear la base para los modelos
Base = declarative_base()


# Obtener una sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
