from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
from app.core.config import settings

# Configuración del hashing con Passlib y Bcrypt
pw_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pw_context.hash(password)

def verificar_password(plain_password: str, hashed_password: str) -> bool:
    return pw_context.verify(plain_password, hashed_password)

def crear_token(data: dict, expires_delta: timedelta, tipo_token: str) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "tipo": tipo_token})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)