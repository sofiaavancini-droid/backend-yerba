export default function ProductCard({ producto }) {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{producto.nombre}</h3>
        <p className="text-2xl font-extrabold text-green-600 mb-2">
          ${producto.precio_final}
        </p>
        <p className="text-sm text-gray-600">
          {producto.cuotas_cantidad} cuotas de <span className="font-semibold">${producto.cuotas_valor}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Garantía: {producto.garantia_meses} meses
        </p>
      </div>
      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
        Agregar al carrito
      </button>
    </div>
  );
}