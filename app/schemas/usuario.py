from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

# Esquema para crear un nuevo usuario
class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    acepto_tratamiento: bool

# Esquema de salida pública del usuario
class UsuarioOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str
    acepto_tratamiento: bool
    fecha_consentimiento: Optional[datetime] = None

    class Config:
        from_attributes = True

# Esquema de respuesta para el token JWT
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# Esquema para renovar el token de acceso
class RefreshIn(BaseModel):
    refresh_token: str