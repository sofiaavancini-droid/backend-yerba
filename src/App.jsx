import ProductCard from './components/ProductCard';

export default function App() {
  const products = [
    {
      id: 1,
      title: 'Yerba Mate Orgánica 1kg',
      price: 4500,
      image: '/org.jpg', // Si es JPG cambiá a /org.jpg
      tag: 'ORGÁNICO',
    },
    {
      id: 2,
      title: 'Yerba Mate con Hierbas',
      price: 3800,
      image: '/yerbamte.png', // Si es JPG cambiá a /yerbamte.jpg
      tag: null,
    },
    {
      id: 3,
      title: 'Mate Completo de Madera',
      price: 12000,
      image: '/mate.png', // Si es JPG cambiá a /mate.jpg
      tag: 'PREMIUM',
    },
    {
      id: 4,
      title: 'Termo Acero Inox 1L',
      price: 35000,
      image: '/termo.png', // Si es JPG cambiá a /termo.jpg
      tag: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-gray-800">
      <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            Yerba Mate Ar
          </h1>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            🛒
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              tag={product.tag}
            />
          ))}
        </div>
      </main>
    </div>
  );
}