'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, ShoppingBag, CreditCard, Truck, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

interface CustomerForm {
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  notes: string
}

const PROVINCES = [
  'Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CustomerForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<CustomerForm>>({})

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/catalog')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  const subtotal = getTotalPrice()
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerForm> = {}

    if (!form.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es requerido'
    if (!form.address.trim()) newErrors.address = 'La dirección es requerida'
    if (!form.city.trim()) newErrors.city = 'La ciudad es requerida'
    if (!form.province) newErrors.province = 'La provincia es requerida'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof CustomerForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map((item) => ({
            productId: item.productId,
            productSlug: item.productSlug,
            productName: item.productName,
            ribbonId: item.ribbonId,
            ribbonName: item.ribbonName,
            appliqueId: item.appliqueId,
            appliqueName: item.appliqueName,
            customTextName: item.customTextName,
            customTextDescription: item.customTextDescription,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            imagePath: item.imagePath,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pedido')
      }

      // Redirect to MercadoPago
      if (data.initPoint) {
        window.location.href = data.initPoint
      } else {
        throw new Error('No se pudo obtener el link de pago')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MaxWidthWrapper className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/configure/summary"
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al resumen
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-1 text-slate-600">Completá tus datos para finalizar la compra</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Customer Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#782048]/10">
                    <User className="h-5 w-5 text-[#782048]" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Datos de contacto</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048] ${
                        errors.name ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Juan Pérez"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048] ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="juan@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048] ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="+54 11 1234-5678"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#782048]/10">
                    <Truck className="h-5 w-5 text-[#782048]" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Dirección de envío</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048] ${
                        errors.address ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048] ${
                        errors.city ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Buenos Aires"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-slate-700 mb-1">
                      Provincia *
                    </label>
                    <select
                      id="province"
                      name="province"
                      value={form.province}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048] ${
                        errors.province ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Seleccionar...</option>
                      {PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048]"
                      placeholder="1000"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
                      Notas adicionales
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#782048] resize-none"
                      placeholder="Instrucciones especiales para la entrega..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#782048]/10">
                    <CreditCard className="h-5 w-5 text-[#782048]" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Método de pago</h2>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/mercadopago-logo.png"
                      alt="MercadoPago"
                      width={120}
                      height={30}
                      className="h-8 w-auto"
                    />
                    <div>
                      <p className="font-medium text-slate-900">MercadoPago</p>
                      <p className="text-sm text-slate-600">
                        Pagá con tarjeta de crédito, débito o dinero en cuenta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Tu pedido</h2>

                {/* Cart Items */}
                <div className="max-h-64 overflow-y-auto space-y-3 border-b border-slate-200 pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
                        <Image
                          src={item.imagePath || '/images/products/default.png'}
                          alt={item.productName}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.quantity} x {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Envío</span>
                    <span className="font-medium text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <span className="text-lg font-bold text-[#782048]">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-[#782048] py-3 font-semibold text-white transition-colors hover:bg-[#5a1836] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pagar con MercadoPago
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-slate-500">
                  Al continuar, aceptás nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        </form>
      </MaxWidthWrapper>
    </div>
  )
}
