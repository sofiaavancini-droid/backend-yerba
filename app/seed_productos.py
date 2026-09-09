from app.db.session import SessionLocal
from app.db.models import Producto

PRODUCTOS = [
    {
        "nombre": "Yerba Mate Playadito 1kg",
        "descripcion": "Yerba mate con palo, suave y de suave sabor duradero.",
        "precio": 4200.0,
        "descuento": 10,
        "stock": 100,
        "imagen_url": "https://placehold.co/300x300?text=Playadito+1kg",
        "categoria": "Yerba Mate",
        "cuotas": 3,
        "garantia": "Garantía de calidad"
    },
    {
        "nombre": "Yerba Mate Taragüi 500g",
        "descripcion": "Yerba mate elaborada con palo, carácter intesamente clásico.",
        "precio": 2400.0,
        "descuento": 0,
        "stock": 50,
        "imagen_url": "https://placehold.co/300x300?text=Taragui+500g",
        "categoria": "Yerba Mate",
        "cuotas": 6,
        "garantia": "Sin garantía"
    },
    {
        "nombre": "Yerba Mate Canarias 1kg",
        "descripcion": "Yerba mate uruguaya sin palo, sabor fuerte y amargo concentrado.",
        "precio": 6500.0,
        "descuento": 5,
        "stock": 30,
        "imagen_url": "https://placehold.co/300x300?text=Canarias+1kg",
        "categoria": "Yerba Mate Sin Palo",
        "cuotas": 3,
        "garantia": "Garantía de fábrica"
    },
    {
        "nombre": "Yerba Mate Rosamonte Especial 500g",
        "descripcion": "Estacionamiento natural prolongado, sabor equilibrado y consistente.",
        "precio": 2800.0,
        "descuento": 0,
        "stock": 80,
        "imagen_url": "https://placehold.co/300x300?text=Rosamonte+500g",
        "categoria": "Yerba Mate Especial",
        "cuotas": 3,
        "garantia": "Garantía de fábrica"
    },
    {
        "nombre": "Yerba Mate CBSé Hierbas Serranas 500g",
        "descripcion": "Mezcla de yerba mate con menta, poleo y peperina.",
        "precio": 2200.0,
        "descuento": 15,
        "stock": 60,
        "imagen_url": "https://placehold.co/300x300?text=CBSe+Serranas",
        "categoria": "Yerba Compuesta",
        "cuotas": 1,
        "garantia": "Sin garantía"
    }
]

def cargar_productos():
    db = SessionLocal()
    try:
        # Opcional: Eliminar el 'Producto Ejemplo' genérico si existe
        db.query(Producto).filter(Producto.nombre == "Producto Ejemplo").delete()
        
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