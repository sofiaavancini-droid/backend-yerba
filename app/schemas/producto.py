from typing import Optional
from pydantic import BaseModel, Field

# Esquema base con atributos comunes
class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_final: float = Field(gt=0, description="El precio debe ser mayor a 0")
    stock: int = Field(ge=0, description="El stock no puede ser negativo")

# Esquema para la creación de un producto
class ProductoCreate(ProductoBase):
    pass

# Esquema para actualizar un producto (todos los campos son opcionales)
class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_final: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)

# Esquema de respuesta para la API
class ProductoOut(ProductoBase):
    id: int

    class Config:
        from_attributes = True