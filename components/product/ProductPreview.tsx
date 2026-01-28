'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductPreviewProps {
  productSlug: string
  ribbonSlug?: string
  appliqueSlug?: string
  textName?: string
  textDescription?: string
  className?: string
}

export function ProductPreview({
  productSlug,
  ribbonSlug = 'azul',
  appliqueSlug = 'corona',
  textName = '',
  textDescription = '',
  className,
}: ProductPreviewProps) {
  const isLabelProduct = productSlug.includes('-label')

  // Get image path based on product type
  const getImagePath = () => {
    if (isLabelProduct) {
      // Label products have a single static image
      return `/images/products/${productSlug}.jpg`
    } else {
      // Box products have color variations with applique
      return `/images/products/${productSlug}-${ribbonSlug}-${appliqueSlug}.png`
    }
  }

  // Calculate font size based on text length (simple adaptive sizing)
  const getTextSize = (text: string, isName: boolean) => {
    const length = text.length
    if (isName) {
      if (length <= 5) return 'text-4xl md:text-5xl'
      if (length <= 10) return 'text-3xl md:text-4xl'
      if (length <= 15) return 'text-2xl md:text-3xl'
      return 'text-xl md:text-2xl'
    } else {
      if (length <= 10) return 'text-2xl md:text-3xl'
      if (length <= 20) return 'text-xl md:text-2xl'
      return 'text-lg md:text-xl'
    }
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50">
        <Image
          src={getImagePath()}
          alt="Product preview"
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Text Overlay - positioned in the center/bottom area */}
        {(textName || textDescription) && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              {textName && (
                <div
                  className={cn(
                    'font-serif italic text-slate-800 drop-shadow-sm',
                    getTextSize(textName, true)
                  )}
                  style={{
                    textShadow: '0 1px 3px rgba(255,255,255,0.8)',
                  }}
                >
                  {textName}
                </div>
              )}
              {textDescription && (
                <div
                  className={cn(
                    'mt-2 font-serif text-slate-700 drop-shadow-sm',
                    getTextSize(textDescription, false)
                  )}
                  style={{
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                  }}
                >
                  {textDescription}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-slate-500">Vista previa de tu diseño</p>
      </div>
    </div>
  )
}
