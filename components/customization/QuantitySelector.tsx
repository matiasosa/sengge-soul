'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 150,
}: QuantitySelectorProps) {
  const canDecrease = quantity > min
  const canIncrease = quantity < max

  const handleDecrease = () => {
    if (canDecrease) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrease = () => {
    if (canIncrease) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value)
    } else if (e.target.value === '') {
      onQuantityChange(min)
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">
        Cantidad
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={!canDecrease}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-colors',
            canDecrease
              ? 'border-slate-300 hover:border-[#782048] hover:bg-[#782048]/5 text-slate-700'
              : 'border-slate-200 text-slate-300 cursor-not-allowed'
          )}
        >
          <Minus className="h-4 w-4" />
        </button>

        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          onFocus={handleFocus}
          min={min}
          max={max}
          className="h-10 w-20 rounded-lg border-2 border-slate-300 text-center text-lg font-semibold focus:border-[#782048] focus:outline-none focus:ring-2 focus:ring-[#782048]/20"
        />

        <button
          type="button"
          onClick={handleIncrease}
          disabled={!canIncrease}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-colors',
            canIncrease
              ? 'border-slate-300 hover:border-[#782048] hover:bg-[#782048]/5 text-slate-700'
              : 'border-slate-200 text-slate-300 cursor-not-allowed'
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {quantity >= max && (
        <p className="mt-2 text-xs text-amber-600">
          Para pedidos mayores a {max} unidades, por favor contáctanos directamente.
        </p>
      )}
    </div>
  )
}
