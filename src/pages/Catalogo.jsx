import { useState, useEffect } from "react";
import { getProductos } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Limpiamos errores anteriores si los hubiera

    getProductos()
      .then((data) => {
        setProductos(data);
      })
      .catch((err) => {
        console.error(err);
        setError("No pudimos cargar los productos. Intentá más tarde.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 1. Estado de carga
  if (isLoading) {
    return <p className="text-center p-8 text-gray-600">Cargando productos...</p>;
  }

  // 2. Estado de error
  if (error) {
    return <p className="text-center p-8 text-red-600 font-semibold">{error}</p>;
  }

  // 3. Estado vacío
  if (productos.length === 0) {
    return <p className="text-center p-8 text-gray-500">Todavía no hay productos disponibles.</p>;
  }

  // 4. Catálogo listo con datos
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  );
}