from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user  # <-- Importación correcta para tu proyecto
from app.db.models import Pedido, Usuario
from app.schemas.pedido import PedidoCreate, PedidoOut
from app.services import pedido_service

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

# POST /pedidos/ -> Checkout
@router.post("/", response_model=PedidoOut, status_code=status.HTTP_201_CREATED)
def checkout(
    datos: PedidoCreate,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return pedido_service.crear_pedido(db, usuario, datos)

# GET /pedidos/mios -> Historial propio (DEBE IR ANTES DE /{pedido_id})
@router.get("/mios", response_model=list[PedidoOut])
def mis_pedidos(
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Pedido)
        .filter(Pedido.usuario_id == usuario.id)
        .order_by(Pedido.creado_en.desc())
        .all()
    )

# GET /pedidos/{pedido_id} -> Detalle de un pedido
@router.get("/{pedido_id}", response_model=PedidoOut)
def obtener_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()

    # Si no existe O no pertenece al usuario (y tampoco es admin), devolvemos 404
    if pedido is None or (pedido.usuario_id != usuario.id and usuario.rol != "admin"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe ese pedido"
        )

    return pedido