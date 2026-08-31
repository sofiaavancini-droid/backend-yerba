export default function ProductCard({ producto, onAgregar }) {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{producto.nombre}</h3>
        <p className="text-2xl font-extrabold text-green-600 mb-2">
          ${producto.precio_final}
        </p>
        
        {producto.cuotas ? (
          <p className="text-sm text-gray-600">
            {producto.cuotas} cuotas de <span className="font-semibold">${producto.cuotas_valor}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">Sin cuotas</p>
        )}

        {producto.garantia ? (
          <p className="text-xs text-gray-500 mt-1">
            Garantía: {producto.garantia} meses
          </p>
        ) : (
          <p className="text-xs text-gray-400 italic mt-1">Sin garantía</p>
        )}
      </div>

      <button 
        type="button"
        onClick={() => {
          if (onAgregar) {
            onAgregar(producto);
          } else {
            console.error("No se recibió la función onAgregar en ProductCard");
          }
        }}
        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition-colors active:scale-95 cursor-pointer"
      >
        Agregar al carrito
      </button>
    </div>
  );
}