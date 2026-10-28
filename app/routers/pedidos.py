

from datetime import datetime, timezone
import secrets

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
# VER TODOS LOS PEDIDOS (SOLO ADMIN)
# =========================

@router.get("/admin/todos")
def listar_todos_los_pedidos(
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if usuario.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo un administrador puede ver todos los pedidos."
        )

    pedidos = (
        db.query(Pedido)
        .order_by(Pedido.creado_en.desc())
        .all()
    )

    resultado = []

    for pedido in pedidos:
        resultado.append({
            "id": pedido.id,
            "cliente": {
                "id": pedido.usuario.id,
                "nombre": pedido.usuario.nombre,
                "email": pedido.usuario.email
            },
            "fecha": pedido.creado_en,
            "estado": pedido.estado,
            "total": pedido.total,
            "items": [
                {
                    "producto_id": item.producto_id,
                    "producto": (
                        item.producto.nombre
                        if item.producto
                        else "Producto eliminado"
                    ),
                    "cantidad": item.cantidad,
                    "precio_unitario": item.precio_unitario
                }
                for item in pedido.items
            ]
        })

    return resultado


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
# CAMBIAR ESTADO (SOLO ADMIN)
# =========================

@router.put("/{pedido_id}/estado")
def cambiar_estado_pedido(
    pedido_id: int,
    nuevo_estado: str,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if usuario.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo un administrador puede cambiar el estado del pedido."
        )

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


# =========================
# ARREPENTIMIENTO DE COMPRA
# =========================

@router.post(
    "/{pedido_id}/revocacion",
    status_code=status.HTTP_201_CREATED
)
def revocar_pedido(
    pedido_id: int,
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pedido = (
        db.query(Pedido)
        .filter(Pedido.id == pedido_id)
        .first()
    )

    # Verificar que el pedido exista y pertenezca al usuario
    if pedido is None or pedido.usuario_id != usuario.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe ese pedido."
        )

    # Verificar si ya está cancelado
    if pedido.estado == "cancelado":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este pedido ya fue cancelado."
        )

    # Verificar límite de 10 días
    ahora = datetime.now(timezone.utc)
    creado_en = pedido.creado_en

    if creado_en.tzinfo is None:
        creado_en = creado_en.replace(tzinfo=timezone.utc)

    dias_transcurridos = (
        ahora - creado_en
    ).total_seconds() / 86400

    if dias_transcurridos > 10:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya pasaron más de 10 días desde la compra."
        )

    # Cambiar estado a cancelado
    pedido.estado = "cancelado"

    db.commit()
    db.refresh(pedido)

    # Generar código de arrepentimiento
    codigo = (
        f"ARR-{datetime.now().strftime('%Y%m%d')}-"
        f"{secrets.token_hex(3).upper()}"
    )

    return {
        "codigo": codigo,
        "pedido_id": pedido.id,
        "creada_en": datetime.now(timezone.utc)
    }
