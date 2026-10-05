
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.db.models import Pedido, Usuario
from app.schemas.pedido import PedidoCreate, PedidoOut
from app.services import pedido_service


router = APIRouter(
    prefix="/pedidos",
    tags=["Pedidos"]
)


# =========================
# CREAR PEDIDO
# =========================

@router.post(
    "/",
    response_model=PedidoOut,
    status_code=status.HTTP_201_CREATED
)
def checkout(
    datos: PedidoCreate,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return pedido_service.crear_pedido(
        db,
        usuario,
        datos
    )


# =========================
# VER MIS PEDIDOS
# =========================

@router.get(
    "/mios",
    response_model=list[PedidoOut]
)
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


# =========================
# VER UN PEDIDO
# =========================

@router.get(
    "/{pedido_id}",
    response_model=PedidoOut
)
def obtener_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pedido = (
        db.query(Pedido)
        .filter(Pedido.id == pedido_id)
        .first()
    )

    if pedido is None or (
        pedido.usuario_id != usuario.id
        and usuario.rol != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe ese pedido"
        )

    return pedido


# =========================
# CAMBIAR ESTADO
# =========================

@router.put("/{pedido_id}/estado")
def cambiar_estado_pedido(
    pedido_id: int,
    nuevo_estado: str,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Solo admin puede cambiar el estado
    if usuario.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo un administrador puede cambiar el estado del pedido."
        )

    # Estados permitidos
    if nuevo_estado not in [
        "pendiente",
        "aceptado",
        "cancelado"
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El estado debe ser pendiente, aceptado o cancelado."
        )

    pedido = (
        db.query(Pedido)
        .filter(Pedido.id == pedido_id)
        .first()
    )

    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado."
        )

    pedido.estado = nuevo_estado

    db.commit()
    db.refresh(pedido)

    return pedido