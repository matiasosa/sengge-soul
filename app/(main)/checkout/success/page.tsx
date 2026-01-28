'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const clearCart = useCartStore((state) => state.clearCart)

  // Clear cart on successful payment
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center">
      <MaxWidthWrapper className="py-16">
        <div className="mx-auto max-w-lg text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900">
            ¡Pago exitoso!
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Tu pedido ha sido confirmado
          </p>

          {/* Order Number */}
          {orderNumber && (
            <div className="mt-6 rounded-lg bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Número de pedido</p>
              <p className="text-2xl font-bold text-[#782048]">{orderNumber}</p>
            </div>
          )}

          {/* Info Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white border border-slate-200 p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Confirmación</p>
                  <p className="text-sm text-slate-600">
                    Te enviamos un email con los detalles
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white border border-slate-200 p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Envío</p>
                  <p className="text-sm text-slate-600">
                    Prepararemos tu pedido pronto
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 rounded-lg bg-slate-100 p-4 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">Próximos pasos:</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#782048]">1.</span>
                Recibirás un email de confirmación con los detalles de tu pedido
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#782048]">2.</span>
                Comenzaremos a preparar tus souvenirs personalizados
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#782048]">3.</span>
                Te notificaremos cuando tu pedido sea enviado
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#782048] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#5a1836]"
          >
            Volver al inicio
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-4 text-sm text-slate-500">
            ¿Tenés alguna pregunta? Contactanos por WhatsApp
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#782048]"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
