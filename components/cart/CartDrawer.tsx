'use client'

import { X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { CartItem } from './CartItem'
import { cn } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()

  const totalPrice = getTotalPrice()
  const formattedTotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(totalPrice / 100)

  const handleCheckout = () => {
    onClose()
    router.push('/configure/summary')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[999] transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-xl z-[1000] transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-screen flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Tu Carrito
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
              aria-label="Close cart"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Agregá productos personalizados para comenzar tu pedido
                </p>
                <button
                  onClick={() => {
                    onClose()
                    router.push('/catalog')
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#782048] px-6 py-3 text-white font-semibold transition-colors hover:bg-[#782048]/90"
                >
                  Ver Catálogo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="px-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 bg-white p-4 space-y-3">
              {/* Clear cart button */}
              <button
                onClick={clearCart}
                className="text-sm text-slate-600 hover:text-red-500 transition-colors"
              >
                Vaciar carrito
              </button>

              {/* Total */}
              <div className="flex items-center justify-between py-2">
                <span className="text-base font-medium text-slate-900">
                  Total:
                </span>
                <span className="text-2xl font-bold text-[#782048]">
                  {formattedTotal}
                </span>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#782048] px-6 py-3 text-white font-semibold transition-colors hover:bg-[#782048]/90"
              >
                Continuar con la compra
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
