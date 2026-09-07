from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Usuario
from app.schemas.producto import ProductoOut, ProductoCreate, ProductoUpdate
from app.services import producto_service
from app.dependencies import require_admin

router = APIRouter(prefix="/productos", tags=["Productos"])

# Endpoints abiertos (Consulta pública)
@router.get("/", response_model=List[ProductoOut])
def listar(db: Session = Depends(get_db)):
    return producto_service.obtener_todos(db)

@router.get("/{id}", response_model=ProductoOut)
def obtener(id: int, db: Session = Depends(get_db)):
    return producto_service.obtener_por_id(db, id)

# Endpoints protegidos (Solo administradores)
@router.post("/", response_model=ProductoOut, status_code=status.HTTP_201_CREATED)
def crear(datos: ProductoCreate, db: Session = Depends(get_db), admin: Usuario = Depends(require_admin)):
    return producto_service.crear(db, datos)

@router.put("/{id}", response_model=ProductoOut)
def actualizar(id: int, datos: ProductoUpdate, db: Session = Depends(get_db), admin: Usuario = Depends(require_admin)):
    return producto_service.actualizar(db, id, datos)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar(id: int, db: Session = Depends(get_db), admin: Usuario = Depends(require_admin)):
    producto_service.eliminar(db, id)
    return None