from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from app.db.database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    precio_final = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    cuotas = Column(Integer, default=1)
    garantia = Column(String, nullable=True)

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    rol = Column(String, default="customer", nullable=False)
    
    # Ley 25.326: Consentimiento
    acepto_tratamiento = Column(Boolean, default=False, nullable=False)
    fecha_consentimiento = Column(DateTime(timezone=True))