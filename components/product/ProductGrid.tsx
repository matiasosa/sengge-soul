import type { Product } from '@/types/database'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🕯️</div>
        <h3 className="text-lg font-semibold text-slate-900">
          No hay productos disponibles
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Vuelve pronto para ver nuestros productos
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
