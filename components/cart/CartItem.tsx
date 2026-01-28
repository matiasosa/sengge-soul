'use client'

import { Minus, Plus, X } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  const canDecrease = item.quantity > 1
  const canIncrease = item.quantity < 150

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format((item.unitPrice * item.quantity) / 100)

  const handleDecrease = () => {
    if (canDecrease) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (canIncrease) {
      updateQuantity(item.id, item.quantity + 1)
    }
  }

  return (
    <div className="flex gap-4 py-4 border-b border-slate-200">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
        <Image
          src={item.imagePath || '/images/products/default.png'}
          alt={item.productName}
          fill
          className="object-contain p-2"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {item.productName}
            </h3>

            {/* Customization details */}
            <div className="mt-1 space-y-0.5 text-xs text-slate-600">
              {item.ribbonName && (
                <p>Cinta: {item.ribbonName}</p>
              )}
              {item.appliqueName && (
                <p>Aplique: {item.appliqueName}</p>
              )}
              {item.customTextName && (
                <p>Texto: &quot;{item.customTextName}&quot;</p>
              )}
              {item.customTextDescription && (
                <p className="text-xs italic">&quot;{item.customTextDescription}&quot;</p>
              )}
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeItem(item.id)}
            className="text-slate-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quantity and Price */}
        <div className="mt-2 flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={!canDecrease}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded border transition-colors',
                canDecrease
                  ? 'border-slate-300 hover:border-[#782048] hover:bg-[#782048]/5 text-slate-700'
                  : 'border-slate-200 text-slate-300 cursor-not-allowed'
              )}
            >
              <Minus className="h-3 w-3" />
            </button>

            <span className="text-sm font-medium text-slate-900 w-8 text-center">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={!canIncrease}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded border transition-colors',
                canIncrease
                  ? 'border-slate-300 hover:border-[#782048] hover:bg-[#782048]/5 text-slate-700'
                  : 'border-slate-200 text-slate-300 cursor-not-allowed'
              )}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <p className="text-sm font-bold text-[#782048]">
            {formattedPrice}
          </p>
        </div>
      </div>
    </div>
  )
}
