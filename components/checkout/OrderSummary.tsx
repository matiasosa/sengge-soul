'use client'

import Image from 'next/image'
import type { CartItem } from '@/types/customization'

interface OrderSummaryProps {
  item: CartItem
}

export function OrderSummary({ item }: OrderSummaryProps) {
  const formattedSubtotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(item.subtotal)

  const formattedUnitPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(item.unitPrice)

  return (
    <div className="flex gap-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <Image
          src={item.imagePath || '/images/products/default.png'}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{item.productName}</h3>

          {/* Customization Details */}
          <div className="mt-1 space-y-1 text-sm text-slate-600">
            {item.ribbonName && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Moño:</span>
                <span>{item.ribbonName}</span>
              </div>
            )}
            {item.appliqueName && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Aplique:</span>
                <span>{item.appliqueName}</span>
              </div>
            )}
            {item.customTextName && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Nombre:</span>
                <span className="italic">"{item.customTextName}"</span>
              </div>
            )}
            {item.customTextDescription && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Descripción:</span>
                <span className="italic">"{item.customTextDescription}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-medium">{formattedUnitPrice}</span>
            <span className="mx-1">×</span>
            <span>{item.quantity}</span>
          </div>
          <div className="text-base font-semibold text-slate-900">
            {formattedSubtotal}
          </div>
        </div>
      </div>
    </div>
  )
}
