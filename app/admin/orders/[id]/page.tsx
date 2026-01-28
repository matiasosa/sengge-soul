import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock } from 'lucide-react'
import { OrderStatusUpdate } from '@/components/admin/OrderStatusUpdate'

async function getOrder(id: number) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
      statusHistory: {
        include: { changedBy: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(cents / 100)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

function getStatusBadge(status: string, large = false) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const labels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }

  return (
    <span className={`px-3 py-1 rounded-full font-medium ${large ? 'text-sm' : 'text-xs'} ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  )
}

function getPaymentBadge(status: string) {
  const styles: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }

  const labels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  )
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const orderId = parseInt(id)

  if (isNaN(orderId)) {
    notFound()
  }

  const order = await getOrder(orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a pedidos
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{order.orderNumber}</h1>
            {getStatusBadge(order.status, true)}
          </div>
          <p className="text-slate-600 mt-1">Creado el {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({order.orderItems.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {order.orderItems.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={item.productImagePath || '/images/products/default.png'}
                      alt={item.productName}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <div className="mt-1 text-sm text-slate-600 space-y-0.5">
                      {item.ribbonName && <p>Cinta: {item.ribbonName}</p>}
                      {item.appliqueName && <p>Aplique: {item.appliqueName}</p>}
                      {item.customTextName && <p>Texto: "{item.customTextName}"</p>}
                      {item.customTextDescription && <p>Descripción: "{item.customTextDescription}"</p>}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-slate-600">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                      <p className="font-semibold text-slate-900">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Envío</span>
                <span className="font-medium">{order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-[#782048]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {order.statusHistory.map((history) => (
                <div key={history.id} className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {history.fromStatus && (
                      <>
                        {getStatusBadge(history.fromStatus)}
                        <span className="text-slate-400">→</span>
                      </>
                    )}
                    {getStatusBadge(history.toStatus)}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatDate(history.createdAt)}
                    {history.changedBy && ` por ${history.changedBy.name}`}
                  </p>
                  {history.notes && (
                    <p className="text-sm text-slate-500 mt-1 italic">"{history.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-slate-500">Nombre</p>
                <p className="font-medium text-slate-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{order.customerEmail}</p>
              </div>
              {order.customerPhone && (
                <div>
                  <p className="text-sm text-slate-500">Teléfono</p>
                  <p className="font-medium text-slate-900">{order.customerPhone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Envío
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-slate-500">Dirección</p>
                <p className="font-medium text-slate-900">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Ciudad</p>
                <p className="font-medium text-slate-900">{order.shippingCity}, {order.shippingProvince}</p>
              </div>
              {order.shippingPostalCode && (
                <div>
                  <p className="text-sm text-slate-500">Código Postal</p>
                  <p className="font-medium text-slate-900">{order.shippingPostalCode}</p>
                </div>
              )}
              {order.shippingNotes && (
                <div>
                  <p className="text-sm text-slate-500">Notas</p>
                  <p className="text-slate-900 italic">"{order.shippingNotes}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pago
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Estado</p>
                {getPaymentBadge(order.paymentStatus)}
              </div>
              {order.mercadoPagoPaymentId && (
                <div>
                  <p className="text-sm text-slate-500">ID MercadoPago</p>
                  <p className="font-mono text-sm text-slate-900">{order.mercadoPagoPaymentId}</p>
                </div>
              )}
              {order.paidAt && (
                <div>
                  <p className="text-sm text-slate-500">Fecha de pago</p>
                  <p className="font-medium text-slate-900">{formatDate(order.paidAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
