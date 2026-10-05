
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import Pedido, ItemPedido, Producto, Usuario
from app.schemas.pedido import PedidoCreate


def crear_pedido(
    db: Session,
    usuario: Usuario,
    datos: PedidoCreate
) -> Pedido:

    if not datos.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El pedido debe contener al menos un producto."
        )

    total_calculado = Decimal("0")
    items_a_crear = []

    try:
        for item in datos.items:

            producto = (
                db.query(Producto)
                .filter(Producto.id == item.producto_id)
                .with_for_update()
                .first()
            )

            # Producto inexistente
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"El producto con ID {item.producto_id} no existe."
                )

            # Falta de stock
            if producto.stock < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Sin stock de {producto.nombre}: quedan {producto.stock}"
                )

            # Descontar stock
            producto.stock -= item.cantidad

            # Calcular total
            subtotal = producto.precio_final * item.cantidad
            total_calculado += subtotal

            # Guardar precio del momento de la compra
            items_a_crear.append(
                ItemPedido(
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    precio_unitario=producto.precio_final
                )
            )

        # Crear pedido como ACEPTADO
        nuevo_pedido = Pedido(
            usuario_id=usuario.id,
            total=total_calculado,
            estado="aceptado",
            items=items_a_crear
        )

        db.add(nuevo_pedido)
        db.commit()
        db.refresh(nuevo_pedido)

        return nuevo_pedido

    except Exception:
        db.rollback()
        raise
