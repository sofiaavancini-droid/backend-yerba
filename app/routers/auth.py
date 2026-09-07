from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.db.database import get_db
from app.db.models import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut, Token, RefreshIn
from app.core.security import hash_password, verificar_password, crear_token
from app.core.config import settings
from app.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/register", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def register(datos: UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.email == datos.email).first():
        raise HTTPException(status_code=400, detail="Ese email ya existe")

    usuario = Usuario(
        nombre=datos.nombre,
        email=datos.email,
        hashed_password=hash_password(datos.password),
        acepto_tratamiento=True,
        fecha_consentimiento=datetime.now(timezone.utc),
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    u = db.query(Usuario).filter(Usuario.email == form.username).first()
    if not u or not verificar_password(form.password, u.hashed_password):
        raise HTTPException(status_code=401, detail="Datos incorrectos")

    return {
        "access_token": crear_token(u.email, u.rol, settings.ACCESS_MIN, "access"),
        "refresh_token": crear_token(u.email, u.rol, settings.REFRESH_MIN, "refresh"),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UsuarioOut)
def me(usuario: Usuario = Depends(get_current_user)):
    return usuario

@router.post("/refresh", response_model=Token)
def refresh(datos: RefreshIn, db: Session = Depends(get_db)):
    error = HTTPException(status_code=401, detail="Refresh inválido")
    try:
        p = jwt.decode(datos.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise error

    if p.get("tipo") != "refresh":
        raise HTTPException(status_code=401, detail="Ese no es un refresh token")

    u = db.query(Usuario).filter(Usuario.email == p.get("sub")).first()
    if not u:
        raise error

    return {
        "access_token": crear_token(u.email, u.rol, settings.ACCESS_MIN, "access"),
        "refresh_token": crear_token(u.email, u.rol, settings.REFRESH_MIN, "refresh"),
        "token_type": "bearer",
    }