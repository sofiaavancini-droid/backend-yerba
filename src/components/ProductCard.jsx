export default function ProductCard({ title, price, image, tag }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-md">
      {/* Imagen con Badge de Categoría */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center"
        />
        {tag && (
          <span className="absolute top-2 right-2 rounded-md bg-[#3b4c2a] px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-100 uppercase">
            {tag}
          </span>
        )}
      </div>

      {/* Información del producto */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>
          <p className="mt-3 text-lg font-bold text-gray-900">
            ${price.toLocaleString('es-AR')}
          </p>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-[#48ab55] py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#3b9347] active:bg-[#327e3d]"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}