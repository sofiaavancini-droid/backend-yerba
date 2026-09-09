from app.db.session import SessionLocal
from app.db.models import Producto

PRODUCTOS = [
    {
        "nombre": "Yerba Mate Playadito 1kg",
        "precio_final": 4200.0,
        "stock": 100,
        "cuotas": 3,
        "garantia": "Garantía de calidad"
    },
    {
        "nombre": "Yerba Mate Taragüi 500g",
        "precio_final": 2400.0,
        "stock": 50,
        "cuotas": 6,
        "garantia": "Sin garantía"
    },
    {
        "nombre": "Yerba Mate Canarias 1kg",
        "precio_final": 6500.0,
        "stock": 30,
        "cuotas": 3,
        "garantia": "Garantía de fábrica"
    },
    {
        "nombre": "Yerba Mate Rosamonte Especial 500g",
        "precio_final": 2800.0,
        "stock": 80,
        "cuotas": 3,
        "garantia": "Garantía de fábrica"
    },
    {
        "nombre": "Yerba Mate CBSé Hierbas Serranas 500g",
        "precio_final": 2200.0,
        "stock": 60,
        "cuotas": 1,
        "garantia": "Sin garantía"
    }
]

def cargar_productos():
    db = SessionLocal()
    try:
        # Eliminar registros con valores inconsistentes si existieran
        db.query(Producto).filter(Producto.precio_final.is_(None)).delete(synchronize_session=False)
        
        for prod_data in PRODUCTOS:
            producto = Producto(**prod_data)
            db.add(producto)
            
        db.commit()
        print("¡Productos cargados exitosamente!")
    except Exception as e:
        db.rollback()
        print(f"Error al cargar productos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    cargar_productos()
