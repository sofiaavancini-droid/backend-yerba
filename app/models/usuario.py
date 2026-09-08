from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime

# ⚠️ Verificá si tu 'Base' está en app.db.database, app.db.session o app.db.base
from app.db.database import Base 

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    rol = Column(String, default="customer", nullable=False)
    acepto_tratamiento = Column(Boolean, nullable=False)
    fecha_consentimiento = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)