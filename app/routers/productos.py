from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Usuario, Producto
from app.dependencies import require_admin
from app.schemas.producto import ProductoCreate, ProductoUpdate, ProductoOut

router = APIRouter(prefix="/productos", tags=["Productos"])


# 🟢 GET público: Cualquiera puede ver el catálogo
@router.get("/", response_model=List[ProductoOut])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()


# 🔴 POST protegido: Solo ADMIN puede crear productos
@router.post("/", response_model=ProductoOut, status_code=status.HTTP_201_CREATED)
def crear_producto(
    datos: ProductoCreate, 
    db: Session = Depends(get_db), 
    admin: Usuario = Depends(require_admin)
):
    nuevo_producto = Producto(**datos.model_dump())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto


# 🔴 PUT protegido: Solo ADMIN puede actualizar productos
@router.put("/{producto_id}", response_model=ProductoOut)
def actualizar_producto(
    producto_id: int, 
    datos: ProductoUpdate, 
    db: Session = Depends(get_db), 
    admin: Usuario = Depends(require_admin)
):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Producto no encontrado"
        )
    
    # Actualizar solo los campos enviados
    for key, value in datos.model_dump(exclude_unset=True).items():
        setattr(producto, key, value)
        
    db.commit()
    db.refresh(producto)
    return producto


# 🔴 DELETE protegido: Solo ADMIN puede borrar productos
@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    producto_id: int, 
    db: Session = Depends(get_db), 
    admin: Usuario = Depends(require_admin)
):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Producto no encontrado"
        )
    
    db.delete(producto)
    db.commit()
    return None