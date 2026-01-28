'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

interface CartButtonProps {
  onClick?: () => void
  className?: string
  showNotificationText?: boolean
}

export function CartButton({ onClick, className, showNotificationText = false }: CartButtonProps) {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center rounded-lg transition-all hover:bg-slate-100',
        showNotificationText ? 'h-10 px-4 bg-green-50' : 'h-10 w-10',
        className
      )}
      aria-label="Shopping cart"
    >
      {showNotificationText ? (
        <span className="text-sm font-medium text-green-700 whitespace-nowrap">
          Producto agregado al carrito
        </span>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 text-slate-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#782048] text-xs font-semibold text-white">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </>
      )}
    </button>
  )
}
