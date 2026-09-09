from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from decimal import Decimal
from app.db.models import Pedido, ItemPedido, Producto, Usuario
from app.schemas.pedido import PedidoCreate

def crear_pedido(db: Session, usuario: Usuario, datos: PedidoCreate) -> Pedido:
    pedido = Pedido(usuario_id=usuario.id, estado="pendiente", total=Decimal("0"))
    total_acumulado = Decimal("0")
    
    try:
        for item in datos.items:
            # with_for_update bloquea la fila para evitar race conditions
            producto = db.query(Producto).filter(Producto.id == item.producto_id).with_for_update().first()
            
            if not producto:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"El producto ID {item.producto_id} no existe")
            
            if producto.stock < item.cantidad:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Sin stock de {producto.nombre}: quedan {producto.stock} unidades disponibles."
                )
            
            # Descuento de stock y congelamiento de precio
            producto.stock -= item.cantidad
            subtotal = Decimal(str(producto.precio_final)) * item.cantidad
            total_acumulado += subtotal
            
            item_db = ItemPedido(
                producto_id=producto.id,
                cantidad=item.cantidad,
                precio_unitario=producto.precio_final
            )
            pedido.items.append(item_db)
            
        pedido.total = total_acumulado
        db.add(pedido)
        db.commit()
        db.refresh(pedido)
        return pedido

    except Exception:
        db.rollback()  # Garantiza atomicidad: o se guarda todo o nada
        raise