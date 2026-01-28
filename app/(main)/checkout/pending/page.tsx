'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Clock, Mail, ArrowRight } from 'lucide-react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

function PendingContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center">
      <MaxWidthWrapper className="py-16">
        <div className="mx-auto max-w-lg text-center">
          {/* Pending Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900">
            Pago en proceso
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Tu pago está siendo procesado
          </p>

          {/* Order Number */}
          {orderNumber && (
            <div className="mt-6 rounded-lg bg-white border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Número de pedido</p>
              <p className="text-2xl font-bold text-[#782048]">{orderNumber}</p>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 flex-shrink-0">
                <Mail className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">¿Qué significa esto?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Tu pago está siendo procesado por el banco o entidad financiera.
                  Esto puede tomar desde unos minutos hasta 1-2 días hábiles.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Te enviaremos un email cuando el pago sea confirmado.
                </p>
              </div>
            </div>
          </div>

          {/* What to do */}
          <div className="mt-6 rounded-lg bg-slate-100 p-4 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">Mientras tanto:</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#782048]">•</span>
                Guardá el número de pedido para futuras consultas
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#782048]">•</span>
                Revisá tu email (y la carpeta de spam) para actualizaciones
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#782048]">•</span>
                No intentes pagar de nuevo para evitar cargos duplicados
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
            ¿Tenés dudas? Contactanos por WhatsApp con tu número de pedido
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default function PendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#782048]"></div>
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  )
}
