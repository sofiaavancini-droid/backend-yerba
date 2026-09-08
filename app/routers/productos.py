from fastapi import APIRouter, Depends, status
from app.dependencies import require_admin

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/")
def listar_productos():
    # Abierto a todo el público
    return [{"id": 1, "nombre": "Producto Ejemplo"}]

@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_producto(datos: dict):
    # Solo accesible para usuarios con rol 'admin'
    return {"mensaje": "Producto creado con éxito"}

@router.put("/{producto_id}", dependencies=[Depends(require_admin)])
def actualizar_producto(producto_id: int, datos: dict):
    return {"mensaje": "Producto actualizado"}

@router.delete("/{producto_id}", dependencies=[Depends(require_admin)])
def eliminar_producto(producto_id: int):
    return {"mensaje": "Producto eliminado"}