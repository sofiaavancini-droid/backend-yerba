from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.db.models import Usuario

oauth2 = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    try:
        p = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if p.get("tipo") != "access":
            raise error
    except JWTError:
        raise error

    usuario = db.query(Usuario).filter(Usuario.email == p.get("sub")).first()
    if usuario is None:
        raise error
    return usuario

def require_admin(usuario: Usuario = Depends(get_current_user)):
    if usuario.rol != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Necesitás ser admin")
    return usuario