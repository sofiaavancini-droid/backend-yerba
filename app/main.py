from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import productos, auth

app = FastAPI(
    title="Yerba E-commerce API",
    version="1.0.0"
)

# Configuración de CORS para el Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar Routers
app.include_router(auth.router)
app.include_router(productos.router)

@app.get("/")
def root():
    return {"mensaje": "API de E-commerce Yerba funcionando correctamente"}