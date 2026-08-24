from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Permite la conexión desde el frontend de React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Producto(BaseModel):
    id: int
    nombre: str
    precio_final: float
    cuotas_cantidad: int
    cuotas_valor: float
    garantia_meses: int

# Productos de prueba en memoria
productos_db = [
    {
        "id": 1,
        "nombre": "Yerba Mate Playadito 1kg",
        "precio_final": 4200.0,
        "cuotas_cantidad": 3,
        "cuotas_valor": 1400.0,
        "garantia_meses": 6
    },
    {
        "id": 2,
        "nombre": "Yerba Mate Canarias 1kg",
        "precio_final": 5800.0,
        "cuotas_cantidad": 6,
        "cuotas_valor": 966.66,
        "garantia_meses": 6
    },
    {
        "id": 3,
        "nombre": "Yerba Mate Rosamonte 500g",
        "precio_final": 2500.0,
        "cuotas_cantidad": 3,
        "cuotas_valor": 833.33,
        "garantia_meses": 3
    }
]

@app.get("/productos", response_model=List[Producto])
def obtener_productos():
    return productos_db