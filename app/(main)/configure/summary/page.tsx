'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { OrderSummary } from '@/components/checkout/OrderSummary'

export default function SummaryPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  // Redirect to catalog if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/catalog')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null // Will redirect
  }

  const subtotal = getTotalPrice()
  const shipping = 0 // Free shipping for now
  const total = subtotal + shipping

  const formattedSubtotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(subtotal / 100)

  const formattedTotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(total / 100)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/catalog"
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5 text-slate-700" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Resumen del Pedido</h1>
                <p className="text-sm text-slate-600">Revisá tu pedido antes de continuar</p>
              </div>
            </div>
            <ShoppingBag className="h-8 w-8 text-[#782048]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Productos ({items.length})
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <OrderSummary key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/catalog"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#782048] transition-colors hover:text-[#5a1836]"
            >
              <ArrowLeft className="h-4 w-4" />
              Seguir comprando
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Total del Pedido
              </h2>

              <div className="space-y-3 border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">{formattedSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-[#782048]">{formattedTotal}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="mt-6 w-full rounded-lg bg-[#782048] px-6 py-3 text-center font-semibold text-white transition-all hover:bg-[#5a1836] active:scale-[0.98]"
              >
                Continuar con el pago
              </button>

              {/* Trust badges */}
              <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pago seguro con MercadoPago</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Envío a todo el país</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Productos personalizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
