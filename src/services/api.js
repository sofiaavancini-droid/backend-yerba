const API_URL = "http://localhost:8000";

export async function getProductos() {
  const respuesta = await fetch(`${API_URL}/productos`);
  if (!respuesta.ok) {
    throw new Error("Error al obtener los productos del backend");
  }
  return await respuesta.json();
}