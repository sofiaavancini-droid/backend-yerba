
import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.db.models import Usuario


router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)


# VER MIS DATOS
@router.get("/me/datos")
def mis_datos(
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "titular": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol
        },
        "consentimiento": {
            "acepto_tratamiento": usuario.acepto_tratamiento,
            "fecha": usuario.fecha_consentimiento
        },
        "pedidos": [
            {
                "id": pedido.id,
                "estado": pedido.estado,
                "total": pedido.total,
                "creado_en": pedido.creado_en
            }
            for pedido in usuario.pedidos
        ]
    }


# EXPORTAR MIS DATOS
@router.get("/me/exportar")
def exportar_mis_datos(
    usuario: Usuario = Depends(get_current_user)
):
    datos = {
        "titular": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol
        },
        "consentimiento": {
            "acepto_tratamiento": usuario.acepto_tratamiento,
            "fecha": usuario.fecha_consentimiento
        },
        "pedidos": [
            {
                "id": pedido.id,
                "estado": pedido.estado,
                "total": str(pedido.total),
                "creado_en": pedido.creado_en.isoformat()
            }
            for pedido in usuario.pedidos
        ]
    }

    contenido = json.dumps(
        datos,
        ensure_ascii=False,
        indent=2
    )

    return Response(
        content=contenido,
        media_type="application/json",
        headers={
            "Content-Disposition": 'attachment; filename="mis-datos.json"'
        }
    )


# ELIMINAR MI CUENTA
@router.delete("/me")
def eliminar_mi_cuenta(
    usuario: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Anonimizar los datos personales
    usuario.nombre = "Usuario eliminado"
    usuario.email = f"eliminado_{usuario.id}@cuenta.eliminada"
    usuario.hashed_password = "CUENTA_ELIMINADA"
    usuario.acepto_tratamiento = False

    db.commit()

    return {
        "mensaje": "Tu cuenta fue dada de baja correctamente."
    }
