from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import require_admin
from app.db.database import get_db
from app.db.models import Producto

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/")
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)]
)
def crear_producto(datos: dict, db: Session = Depends(get_db)):
    producto = Producto(**datos)

    db.add(producto)
    db.commit()
    db.refresh(producto)

    return producto


@router.put(
    "/{producto_id}",
    dependencies=[Depends(require_admin)]
)
def actualizar_producto(
    producto_id: int,
    datos: dict,
    db: Session = Depends(get_db)
):
    producto = db.query(Producto).filter(
        Producto.id == producto_id
    ).first()

    if not producto:
        return {"mensaje": "Producto no encontrado"}

    for campo, valor in datos.items():
        setattr(producto, campo, valor)

    db.commit()
    db.refresh(producto)

    return producto


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
        return {"mensaje": "Producto no encontrado"}

    db.delete(producto)
    db.commit()

    return {"mensaje": "Producto eliminado"}