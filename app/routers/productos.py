from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import require_admin
from app.db.database import get_db
from app.db.models import Producto
from app.schemas.producto import ProductoCreate, ProductoUpdate, ProductoOut


router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)


# LISTAR PRODUCTOS
@router.get("/", response_model=list[ProductoOut])
def listar_productos(
    db: Session = Depends(get_db)
):
    return db.query(Producto).all()


# CREAR PRODUCTO
@router.post(
    "/",
    response_model=ProductoOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)]
)
def crear_producto(
    datos: ProductoCreate,
    db: Session = Depends(get_db)
):
    producto = Producto(
        nombre=datos.nombre,
        descripcion=datos.descripcion,
        precio_final=datos.precio_final,
        stock=datos.stock
    )

    db.add(producto)
    db.commit()
    db.refresh(producto)

    return producto


# ACTUALIZAR PRODUCTO
@router.put(
    "/{producto_id}",
    response_model=ProductoOut,
    dependencies=[Depends(require_admin)]
)
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    db: Session = Depends(get_db)
):
    producto = db.query(Producto).filter(
        Producto.id == producto_id
    ).first()

    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    datos_actualizados = datos.model_dump(
        exclude_unset=True
    )

    for campo, valor in datos_actualizados.items():
        setattr(producto, campo, valor)

    db.commit()
    db.refresh(producto)

    return producto


# ELIMINAR PRODUCTO
@router.delete(
    "/{producto_id}",
    dependencies=[Depends(require_admin)]
)
def eliminar_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    producto = db.query(Producto).filter(
        Producto.id == producto_id
    ).first()

    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )

    db.delete(producto)
    db.commit()

    return {
        "mensaje": "Producto eliminado correctamente"
    }
