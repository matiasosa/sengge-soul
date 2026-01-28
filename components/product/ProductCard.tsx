'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types/database'

interface ProductCardProps {
  product: Product
}

// Color options for box products
const RIBBON_COLORS = [
  { slug: 'azul', name: 'Azul', hex: '#013466' },
  { slug: 'plateado', name: 'Plateado', hex: '#C0C0C0' },
  { slug: 'dorado', name: 'Dorado', hex: '#ffd900cd' },
  { slug: 'celeste', name: 'Celeste', hex: '#87CEEB' },
  { slug: 'rosa', name: 'Rosa', hex: '#FFC0CB' },
]

export function ProductCard({ product }: ProductCardProps) {
  const isLabelProduct = product.slug.includes('-label')
  const [selectedColor, setSelectedColor] = useState(RIBBON_COLORS[0].slug)

  // Format price to ARS
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(product.basePrice / 100)

  // Get image path based on product type
  const getImagePath = () => {
    if (isLabelProduct) {
      // Label products have a single static image
      return `/images/products/${product.slug}.jpg`
    } else {
      // Box products have color variations with corona applique
      return `/images/products/${product.slug}-${selectedColor}-corona.png`
    }
  }

  // Build the customize URL with the selected color for box products
  const customizeUrl = isLabelProduct
    ? `/configure/customize?p=${product.slug}`
    : `/configure/customize?p=${product.slug}&ribbon=${selectedColor}`

  return (
    <Link
      href={customizeUrl}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:shadow-lg hover:border-[#782048]"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <Image
          src={getImagePath()}
          alt={product.name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#782048] transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Color Selector for Box Products */}
        {!isLabelProduct && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-2">Colores disponibles:</p>
            <div className="flex gap-2">
              {RIBBON_COLORS.map((color) => (
                <button
                  key={color.slug}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedColor(color.slug)
                  }}
                  className={`h-6 w-6 rounded-full border-2 transition-all ${
                    selectedColor === color.slug
                      ? 'border-[#782048] scale-110'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-3 flex flex-wrap gap-2">
          {product.supportsRibbon && (
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
              🎀 Cinta
            </span>
          )}
          {product.supportsApplique && (
            <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700">
              ✨ Aplique
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            ✏️ Texto
          </span>
        </div>

        {/* Price and CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[#782048]">{formattedPrice}</p>
          </div>

          <div className="flex items-center gap-1 text-[#782048] group-hover:gap-2 transition-all">
            <span className="text-sm font-medium">Personalizar</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
