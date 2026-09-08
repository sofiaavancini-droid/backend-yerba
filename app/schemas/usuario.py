from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator

class UsuarioCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    acepto_tratamiento: bool

    @field_validator("acepto_tratamiento")
    def validar_consentimiento(cls, v):
        if not v:
            raise ValueError("Debe aceptar el tratamiento de datos personales para registrarse.")
        return v

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str
    fecha_consentimiento: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str