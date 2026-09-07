from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Usuario
from app.core.config import settings

# Indica a Swagger que la URL para obtener el token es /auth/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> Usuario:
    error_credenciales = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de autenticación inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decodificamos el token usando el SECRET_KEY
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        tipo: str = payload.get("tipo")
        
        # Validamos que el token contenga email y sea de tipo "access"
        if email is None or tipo != "access":
            raise error_credenciales
            
    except JWTError:
        raise error_credenciales

    # Buscamos al usuario en la base de datos
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario is None:
        raise error_credenciales
        
    return usuario


def require_admin(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    # Soporta si el rol está guardado como 'rol' == 'admin' o booleano 'es_admin'
    es_admin = getattr(usuario, "es_admin", False) or getattr(usuario, "rol", "") == "admin"
    
    if not es_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Necesitás permisos de administrador para realizar esta acción"
        )
        
    return usuario