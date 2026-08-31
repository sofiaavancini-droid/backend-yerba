export default function CarritoModal({ 
  carrito, 
  onCerrar, 
  onIncrementar, 
  onDecrementar, 
  onEliminar, 
  onFinalizarCompra 
}) {
  // Calculamos el total de la compra
  const total = carrito.reduce((acc, item) => acc + (item.precio_final * item.cantidad), 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Cabecera del modal */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tu Carrito de Compras</h2>
          <button 
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2"
          >
            ✕
          </button>
        </div>

        {/* Lista de productos */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {carrito.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              El carrito está vacío. ¡Agregá algunas yerbas para empezar!
            </p>
          ) : (
            carrito.map((item) => (
              <div 
                key={item.id} 
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{item.nombre}</h4>
                  <p className="text-emerald-600 font-semibold">${item.precio_final}</p>
                </div>

                {/* Botones para sumar / restar cantidad */}
                <div className="flex items-center gap-2 mx-4">
                  <button 
                    onClick={() => onDecrementar(item.id)}
                    className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="font-semibold text-gray-800 px-2">{item.cantidad}</span>
                  <button 
                    onClick={() => onIncrementar(item.id)}
                    className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal y Eliminar */}
                <div className="text-right">
                  <p className="font-bold text-gray-900 mb-1">
                    ${item.precio_final * item.cantidad}
                  </p>
                  <button 
                    onClick={() => onEliminar(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total y Botón Finalizar */}
        {carrito.length > 0 && (
          <div className="border-t pt-4 mt-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-2xl text-emerald-600">${total}</span>
            </div>

            <button
              onClick={onFinalizarCompra}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md active:scale-[0.99]"
            >
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}