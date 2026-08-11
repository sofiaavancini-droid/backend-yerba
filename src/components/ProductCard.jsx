export default function ProductCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="h-48 w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-gray-400 font-medium">Imagen del producto</span>
      </div>
      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Almacén</span>
      <h3 className="text-lg font-bold text-gray-900 mt-1">Yerba Mate Orgánica 1kg</h3>
      <p className="text-xl font-extrabold text-gray-900 mt-2">$4.500</p>
      <p className="text-xs text-gray-500">Incluye IVA (21%)</p>
      <button className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700 transition-colors">
        Agregar al carrito
      </button>
    </div>
  );
}