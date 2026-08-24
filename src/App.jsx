import Catalogo from './pages/Catalogo';

export default function App() {
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
        <Catalogo />
      </main>
    </div>
  );
}