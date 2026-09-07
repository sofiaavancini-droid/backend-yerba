from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.producto import ProductoResponse as ProductoOut
from app.services import producto_service

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoOut])
def listar_productos(
    page: int = 1,
    limit: int = 12,
    nombre: str | None = None,
    db: Session = Depends(get_db),
):
    return producto_service.listar(db, page=page, limit=limit, nombre=nombre)