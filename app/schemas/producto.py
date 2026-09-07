from pydantic import BaseModel
from typing import Optional

class ProductoCreate(BaseModel):
    nombre: str
    precio_final: float
    cuotas_cantidad: Optional[int] = None
    cuotas_valor: Optional[float] = None
    garantia_meses: Optional[int] = None
    stock: int

class ProductoResponse(ProductoCreate):
    id: int

    class Config:
        from_attributes = True

ProductoOut = ProductoResponse