const API_URL = "http://127.0.0.1:8000"; 

// src/services/api.js

export async function getProductos({ page = 0, limit = 6, nombre = "" } = {}) {
  const params = new URLSearchParams({ 
    skip: page * limit, 
    limit 
  });

  if (nombre) {
    params.append("nombre", nombre);
  }

  const respuesta = await fetch(`${API_URL}/productos?${params}`);

  if (!respuesta.ok) {
    throw new Error("Error al consultar el backend");
  }

  return respuesta.json();
}