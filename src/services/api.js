const BASE_URL = import.meta.env.VITE_API_URL;

export async function getProductos({ page = 0, limit = 5, nombre = "" } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (nombre) params.set("nombre", nombre);

  const res = await fetch(`${BASE_URL}/productos/?${params}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getProducto(id) {
  const res = await fetch(`${BASE_URL}/productos/${id}`);
  if (!res.ok) throw new Error("Producto no encontrado");
  return res.json();
}