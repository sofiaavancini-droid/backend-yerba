from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import productos

app = FastAPI(title=settings.PROJECT_NAME)

# Configuración de CORS usando los orígenes definidos en el .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montaje del router de productos
app.include_router(productos.router)


@app.get("/")
def raiz():
    return {"status": "ok", "app": settings.PROJECT_NAME}