from typing import Optional
from sqlalchemy.orm import Session
from app.db.models import Producto


def listar(
    db: Session,
    page: int = 1,
    limit: int = 12,
    nombre: Optional[str] = None,
):
    query = db.query(Producto)

    if nombre:
        query = query.filter(Producto.nombre.ilike(f"%{nombre}%"))

    offset = (page - 1) * limit
    return query.offset(offset).limit(limit).all()