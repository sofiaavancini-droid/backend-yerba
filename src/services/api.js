const API_URL = "http://localhost:8000"; 

export async function getProductos() {
  const respuesta = await fetch(`${API_URL}/productos`);
  
  if (!respuesta.ok) {
    throw new Error("Error al consultar el backend");
  }
  
  return respuesta.json();
}