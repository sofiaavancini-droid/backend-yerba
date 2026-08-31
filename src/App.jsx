import { useState } from 'react';
import Catalogo from './pages/Catalogo';
import CarritoModal from './components/CarritoModal';

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const [verCarrito, setVerCarrito] = useState(false);

  // 1. Agregar producto o incrementar cantidad
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // 2. Incrementar cantidad (+1)
  const incrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // 3. Decrementar cantidad (-1)
  const decrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // 4. Eliminar producto completo
  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  // 5. Finalizar compra
  const finalizarCompra = () => {
    alert("¡Compra finalizada! Muchas gracias por tu compra.");
    setCarrito([]); // Vacía el carrito
    setVerCarrito(false); // Cierra el modal
  };

  // Total de unidades acumuladas en el carrito
  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-gray-800">
      <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            Yerba Mate Ar
          </h1>

          {/* Botón para abrir el carrito */}
          <button 
            onClick={() => setVerCarrito(true)}
            className="flex items-center gap-2 h-9 px-3 rounded-full bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition cursor-pointer"
          >
            <span>🛒</span>
            <span>{totalUnidades}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Catalogo onAgregarAlCarrito={agregarAlCarrito} />
      </main>

      {/* Ventana Modal del Carrito */}
      {verCarrito && (
        <CarritoModal 
          carrito={carrito}
          onCerrar={() => setVerCarrito(false)}
          onIncrementar={incrementarCantidad}
          onDecrementar={decrementarCantidad}
          onEliminar={eliminarProducto}
          onFinalizarCompra={finalizarCompra}
        />
      )}
    </div>
  );
}