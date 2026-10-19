
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import auth, productos, pedidos, usuarios


# Inicialización de la aplicación FastAPI
app = FastAPI(
    title=getattr(settings, "PROJECT_NAME", "YERBA MATE AR"),
    version="1.0.0"
)


# Configuración de CORS
cors_origins_str = getattr(
    settings,
    "cors_origins",
    "http://localhost:5173,http://127.0.0.1:5173"
)

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


# Crear la carpeta para guardar las imágenes
CARPETA_UPLOADS = Path("uploads")
CARPETA_PRODUCTOS = CARPETA_UPLOADS / "productos"
CARPETA_PRODUCTOS.mkdir(parents=True, exist_ok=True)


# Habilitar el acceso a las imágenes
app.mount(
    "/static",
    StaticFiles(directory=str(CARPETA_UPLOADS)),
    name="static"
)


# Registro de Routers
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
