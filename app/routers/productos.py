
from pathlib import Path
import secrets

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session

from app.dependencies import require_admin
from app.db.database import get_db
from app.db.models import Producto
from app.schemas.producto import (
    ProductoCreate,
    ProductoUpdate,
    ProductoOut,
)


router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)


# Configuración de imágenes
CARPETA_PRODUCTOS = Path("uploads") / "productos"
TAMANO_MAXIMO = 2 * 1024 * 1024  # 2 MB

FORMATOS_VALIDOS = {
    ".jpg": lambda contenido: contenido.startswith(b"\xff\xd8\xff"),
    ".jpeg": lambda contenido: contenido.startswith(b"\xff\xd8\xff"),
    ".png": lambda contenido: contenido.startswith(
        b"\x89PNG\r\n\x1a\n"
    ),
    ".webp": lambda contenido: (
        len(contenido) >= 12
        and contenido[:4] == b"RIFF"
        and contenido[8:12] == b"WEBP"
    ),
}


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
        stock=datos.stock,
        imagen_url=datos.imagen_url
    )

    db.add(producto)
    db.commit()
    db.refresh(producto)

    return producto


# SUBIR IMAGEN DE UN PRODUCTO
@router.post(
    "/{producto_id}/imagen",
    dependencies=[Depends(require_admin)]
)
async def subir_imagen_producto(
    producto_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    producto = db.query(Producto).filter(
        Producto.id == producto_id
    ).first()

    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    extension = Path(archivo.filename or "").suffix.lower()

    if extension not in FORMATOS_VALIDOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato no permitido. Usá JPG, JPEG, PNG o WEBP."
        )

    contenido = await archivo.read(TAMANO_MAXIMO + 1)
    await archivo.close()

    if not contenido:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo está vacío"
        )

    if len(contenido) > TAMANO_MAXIMO:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="La imagen no puede superar los 2 MB"
        )

    if not FORMATOS_VALIDOS[extension](contenido):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El contenido no coincide con el formato de imagen"
        )

    CARPETA_PRODUCTOS.mkdir(parents=True, exist_ok=True)

    nombre_archivo = f"{secrets.token_hex(8)}{extension}"
    ruta_archivo = CARPETA_PRODUCTOS / nombre_archivo

    ruta_archivo.write_bytes(contenido)

    producto.imagen_url = f"/static/productos/{nombre_archivo}"

    try:
        db.commit()
        db.refresh(producto)
    except Exception:
        db.rollback()
        ruta_archivo.unlink(missing_ok=True)
        raise

    return {
        "mensaje": "Imagen subida correctamente",
        "producto_id": producto.id,
        "imagen_url": producto.imagen_url
    }


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
            status_code=status.HTTP_404_NOT_FOUND,
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    db.delete(producto)
    db.commit()

    return {
        "mensaje": "Producto eliminado correctamente"
    }
