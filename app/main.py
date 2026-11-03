

from pathlib import Path
import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.db.database import get_db, Base, engine
from app.db import models
from app.core.config import settings
from app.routers import auth, productos, pedidos, usuarios


# Crear las tablas que falten si está habilitado
if os.getenv("CREAR_TABLAS_AL_INICIAR", "false").lower() == "true":
    Base.metadata.create_all(bind=engine)


# Inicialización de FastAPI
app = FastAPI(
    title=getattr(settings, "PROJECT_NAME", "YERBA MATE AR"),
    version="1.0.0"
)


# Configuración de CORS
cors_origins_str = settings.CORS_ORIGINS

origins = (
    [origin.strip() for origin in cors_origins_str.split(",")]
    if cors_origins_str
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Configurar la carpeta de imágenes con una ruta absoluta
BASE_DIR = Path(__file__).resolve().parent.parent
CARPETA_UPLOADS = BASE_DIR / "uploads"
CARPETA_PRODUCTOS = CARPETA_UPLOADS / "productos"

CARPETA_PRODUCTOS.mkdir(parents=True, exist_ok=True)


# Habilitar el acceso a las imágenes
app.mount(
    "/static",
    StaticFiles(directory=str(CARPETA_UPLOADS)),
    name="static"
)


# Registrar las rutas
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(pedidos.router)
app.include_router(usuarios.router)


# Ruta principal
@app.get("/", tags=["Raiz"])
def raiz():
    return {
        "mensaje": "API de E-Commerce DSI2-IRESM funcionando correctamente"
    }


# Comprobar conexión con la base de datos
@app.get("/salud", tags=["Salud"])
def salud(db=Depends(get_db)):
    db.execute(text("SELECT 1"))

    return {
        "estado": "ok",
        "base": "ok"
    }
