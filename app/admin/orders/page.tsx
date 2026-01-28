import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Search, Filter } from 'lucide-react'

async function getOrders(status?: string) {
  return prisma.order.findMany({
    where: status && status !== 'all' ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: true,
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

function getStatusBadge(status: string) {
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
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
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
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  )
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const status = params.status
  const orders = await getOrders(status)

  const statusFilters = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'confirmed', label: 'Confirmados' },
    { value: 'shipped', label: 'Enviados' },
    { value: 'delivered', label: 'Entregados' },
    { value: 'cancelled', label: 'Cancelados' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
          <p className="text-slate-600 mt-1">{orders.length} pedidos en total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === 'all' ? '/admin/orders' : `/admin/orders?status=${filter.value}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (status === filter.value || (!status && filter.value === 'all'))
                ? 'bg-[#782048] text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No hay pedidos con este filtro
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    Pedido
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    Cliente
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    Estado
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    Pago
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    Total
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                    Fecha
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                      <p className="text-sm text-slate-500">{order.orderItems.length} productos</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{order.customerName}</p>
                      <p className="text-sm text-slate-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4">{getPaymentBadge(order.paymentStatus)}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#782048] hover:text-[#5a1836] font-medium text-sm flex items-center gap-1"
                      >
                        Ver
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
