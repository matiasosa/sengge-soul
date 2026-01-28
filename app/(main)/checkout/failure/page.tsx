'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RefreshCw, HelpCircle, ArrowLeft } from 'lucide-react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

function FailureContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center">
      <MaxWidthWrapper className="py-16">
        <div className="mx-auto max-w-lg text-center">
          {/* Failure Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900">
            Pago rechazado
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            No pudimos procesar tu pago
          </p>

          {/* Order Reference */}
          {orderNumber && (
            <div className="mt-6 rounded-lg bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Referencia del pedido</p>
              <p className="text-xl font-bold text-slate-900">{orderNumber}</p>
            </div>
          )}

          {/* Possible Reasons */}
          <div className="mt-8 rounded-lg bg-white border border-slate-200 p-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-slate-500" />
              Posibles razones:
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Fondos insuficientes en la tarjeta
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Datos de la tarjeta incorrectos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                El banco rechazó la transacción
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                Límite de compra excedido
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#782048] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#5a1836]"
            >
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Link>

            <Link
              href="/configure/summary"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al carrito
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Si el problema persiste, contactanos por WhatsApp para ayudarte
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default function FailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#782048]"></div>
        </div>
      }
    >
      <FailureContent />
    </Suspense>
  )
}
