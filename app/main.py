from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, productos, pedidos

# Inicialización de la aplicación FastAPI
app = FastAPI(
    title=getattr(settings, "PROJECT_NAME", "YERBA MATE AR"),
    version="1.0.0"
)

# Configuración del Middleware de CORS
cors_origins_str = getattr(settings, "cors_origins", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in cors_origins_str.split(",")] if cors_origins_str else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de Routers
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(pedidos.router)


@app.get("/", tags=["Raiz"])
def raiz():
    return {"mensaje": "API de E-Commerce DSI2-IRESM funcionando correctamente"}