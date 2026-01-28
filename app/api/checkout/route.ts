import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { prisma } from '@/lib/prisma'

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

interface CartItem {
  productId: number
  productSlug: string
  productName: string
  ribbonId?: number
  ribbonName?: string
  appliqueId?: number
  appliqueName?: string
  customTextName?: string
  customTextDescription?: string
  unitPrice: number
  quantity: number
  imagePath?: string
}

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode?: string
  notes?: string
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SS-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, items } = body as { customer: CustomerData; items: CartItem[] }

    // Validate input
    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const shippingCost = 0 // Free shipping
    const total = subtotal + shippingCost

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        shippingCity: customer.city,
        shippingProvince: customer.province,
        shippingPostalCode: customer.postalCode || null,
        shippingNotes: customer.notes || null,
        subtotal,
        shippingCost,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            ribbonId: item.ribbonId || null,
            ribbonName: item.ribbonName || null,
            appliqueId: item.appliqueId || null,
            appliqueName: item.appliqueName || null,
            customTextName: item.customTextName || null,
            customTextDescription: item.customTextDescription || null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice * item.quantity,
            productImagePath: item.imagePath || null,
          })),
        },
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: 'pending',
            notes: 'Pedido creado',
          },
        },
      },
    })

    // Create MercadoPago preference
    const preference = new Preference(client)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const isLocalhost = baseUrl.includes('localhost')

    // Build preference body - auto_return and notification_url only work with public URLs
    const preferenceBody: Parameters<typeof preference.create>[0]['body'] = {
      items: items.map((item) => ({
        id: `${item.productSlug}-${item.ribbonName || 'default'}-${item.appliqueName || 'default'}`,
        title: item.productName,
        description: [
          item.ribbonName && `Cinta: ${item.ribbonName}`,
          item.appliqueName && `Aplique: ${item.appliqueName}`,
          item.customTextName && `Texto: "${item.customTextName}"`,
        ]
          .filter(Boolean)
          .join(' | ') || 'Producto personalizado',
        quantity: item.quantity,
        unit_price: item.unitPrice / 100, // Convert from cents to pesos
        currency_id: 'ARS',
      })),
      payer: {
        name: customer.name.split(' ')[0],
        surname: customer.name.split(' ').slice(1).join(' ') || '',
        email: customer.email,
        phone: {
          area_code: '',
          number: customer.phone,
        },
        address: {
          street_name: customer.address,
          zip_code: customer.postalCode || '',
        },
      },
      external_reference: orderNumber,
      statement_descriptor: 'SENGGE SOUL',
    }

    // Only add back_urls and auto_return for non-localhost environments
    if (!isLocalhost) {
      preferenceBody.back_urls = {
        success: `${baseUrl}/checkout/success?order=${orderNumber}`,
        failure: `${baseUrl}/checkout/failure?order=${orderNumber}`,
        pending: `${baseUrl}/checkout/pending?order=${orderNumber}`,
      }
      preferenceBody.auto_return = 'approved'
      preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`
    }

    const preferenceData = await preference.create({ body: preferenceBody })

    // Update order with MercadoPago preference ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mercadoPagoPreferenceId: preferenceData.id,
        mercadoPagoExternalRef: orderNumber,
      },
    })

    return NextResponse.json({
      success: true,
      orderNumber,
      initPoint: preferenceData.init_point,
      sandboxInitPoint: preferenceData.sandbox_init_point,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    )
  }
}
