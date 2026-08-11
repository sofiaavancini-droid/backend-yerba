import ProductCard from './components/ProductCard';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Mi Tienda Online - DSI2</h1>
      <div className="max-w-xs mx-auto">
        <ProductCard />
      </div>
    </div>
  );
}