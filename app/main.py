
from pathlib import Path
import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.db.database import get_db, Base, engine
from app.db import models
from app.core.config import settings
from app.routers import auth, productos, pedidos, usuarios


# Crear las tablas que falten si está habilitado
if os.getenv("CREAR_TABLAS", "false").lower() == "true":
    Base.metadata.create_all(bind=engine)


# Crear la aplicación
app = FastAPI(title="YERBA MATE AR")


# Comprimir respuestas grandes
app.add_middleware(
    GZipMiddleware,
    minimum_size=1000
)


# Configuración CORS
origins = [
    origen.strip()
    for origen in settings.CORS_ORIGINS.split(",")
    if origen.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Carpeta de imágenes
BASE_DIR = Path(__file__).resolve().parent.parent
CARPETA_UPLOADS = BASE_DIR / "uploads"
CARPETA_PRODUCTOS = CARPETA_UPLOADS / "productos"

CARPETA_PRODUCTOS.mkdir(parents=True, exist_ok=True)


# Archivos estáticos con caché
class StaticConCache(StaticFiles):
    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)

        if response.status_code == 200:
            response.headers["Cache-Control"] = "public, max-age=86400"

        return response


app.mount(
    "/static",
    StaticConCache(directory=str(CARPETA_UPLOADS)),
    name="static"
)


# Rutas
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(pedidos.router)
app.include_router(usuarios.router)


# Verificar funcionamiento de la API y la base de datos
@app.get("/salud")
def salud(db=Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "estado": "ok",
            "base": "ok"
        }
    except Exception as e:
        return {
            "estado": "error",
            "detalle": str(e)
        }


# Página principal
@app.get("/")
def inicio():
    return {
        "mensaje": "API de E-Commerce DSI2-IRESM funcionando correctamente"
    }
