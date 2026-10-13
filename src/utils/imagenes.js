const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export function urlImagen(producto) {
  if (!producto?.imagen_url) {
    return null;
  }

  if (
    producto.imagen_url.startsWith("http://") ||
    producto.imagen_url.startsWith("https://")
  ) {
    return producto.imagen_url;
  }

  return `${BASE_URL}${
    producto.imagen_url.startsWith("/") ? "" : "/"
  }${producto.imagen_url}`;
}