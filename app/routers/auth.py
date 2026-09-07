from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Usuario
from app.core.security import crear_token, verificar_password, hash_password
from app.schemas.usuario import UsuarioCreate, UsuarioOut

router = APIRouter()

@router.post("/register", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def register(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el usuario existe
    db_user = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # 2. Crear y guardar el nuevo usuario
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        hashed_password=hash_password(usuario.password),
        acepto_tratamiento=usuario.acepto_tratamiento
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Buscar el usuario
    u = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    
    # 2. Validar credenciales
    if not u or not verificar_password(form_data.password, u.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Generar Access Token
    access_token = crear_token(
        data={"sub": u.email, "es_admin": getattr(u, "es_admin", False), "type": "access"}
    )
    
    # 4. Generar Refresh Token
    refresh_token = crear_token(
        data={"sub": u.email, "type": "refresh"},
        expires_delta=timedelta(days=7)
    )
    
    # 5. Responder
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }