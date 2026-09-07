from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Configuración del encriptador de contraseñas con bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Genera el hash de una contraseña plana."""
    return pwd_context.hash(password)

def verificar_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si una contraseña plana coincide con el hash almacenado."""
    return pwd_context.verify(plain_password, hashed_password)

def crear_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un token JWT firmado."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Usa el tiempo configurado en tus settings (settings.ACCESS_MIN)
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_MIN)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt