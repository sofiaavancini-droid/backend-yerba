from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal

# --- ENTRADA (Lo que envía el cliente) ---
class ItemIn(BaseModel):
    producto_id: int
    cantidad: int = Field(gt=0, description="La cantidad debe ser mayor a 0")

class PedidoCreate(BaseModel):
    items: list[ItemIn] = Field(min_length=1, description="El pedido debe incluir al menos un producto")

# --- SALIDA (Lo que devuelve la API) ---
class ItemOut(BaseModel):
    id: int
    producto_id: int
    cantidad: int
    precio_unitario: Decimal

    model_config = {"from_attributes": True}

class PedidoOut(BaseModel):
    id: int
    estado: str
    total: Decimal
    creado_en: datetime
    items: list[ItemOut]

    model_config = {"from_attributes": True}