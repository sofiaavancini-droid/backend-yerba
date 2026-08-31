import { useState, useEffect } from "react";
import { getProductos } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Catalogo({ onAgregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getProductos({ page, limit: 5, nombre: busqueda })
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
  }, [page, busqueda]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Buscador */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Buscar productos por nombre..."
          value={busqueda}
          onChange={(e) => {
            setPage(0);
            setBusqueda(e.target.value);
          }}
          className="border border-gray-300 bg-white rounded-xl px-4 py-3 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        />
      </div>

      {/* Estados */}
      {isLoading && (
        <p className="text-center py-12 text-gray-500 font-medium">Cargando productos...</p>
      )}

      {error && !isLoading && (
        <p className="text-center py-12 text-red-600 font-semibold">{error}</p>
      )}

      {!isLoading && !error && productos.length === 0 && (
        <p className="text-center py-12 text-gray-500">
          No se encontraron productos para esta búsqueda.
        </p>
      )}

      {/* Grilla de productos */}
      {!isLoading && !error && productos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <ProductCard 
              key={p.id} 
              producto={p} 
              onAgregar={onAgregarAlCarrito} 
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {!isLoading && !error && (
        <div className="flex justify-center items-center gap-6 pt-6 border-t border-gray-200">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition shadow-sm"
          >
            Anterior
          </button>

          <span className="font-semibold text-gray-700 px-2">
            Página {page + 1}
          </span>

          <button
            disabled={productos.length < 5}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 transition shadow-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}