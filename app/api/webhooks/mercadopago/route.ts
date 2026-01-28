import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { prisma } from '@/lib/prisma'

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // MercadoPago sends different notification types
    const { type, data } = body

    // We only care about payment notifications
    if (type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = data?.id

    if (!paymentId) {
      console.error('No payment ID in webhook')
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 })
    }

    // Fetch payment details from MercadoPago
    const paymentClient = new Payment(client)
    const payment = await paymentClient.get({ id: paymentId })

    if (!payment) {
      console.error('Payment not found:', paymentId)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const externalReference = payment.external_reference
    const status = payment.status

    if (!externalReference) {
      console.error('No external reference in payment')
      return NextResponse.json({ error: 'No external reference' }, { status: 400 })
    }

    // Find the order by external reference (order number)
    const order = await prisma.order.findUnique({
      where: { orderNumber: externalReference },
    })

    if (!order) {
      console.error('Order not found:', externalReference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Map MercadoPago status to our status
    let paymentStatus: string
    let orderStatus: string

    switch (status) {
      case 'approved':
        paymentStatus = 'paid'
        orderStatus = 'confirmed'
        break
      case 'pending':
      case 'in_process':
        paymentStatus = 'pending'
        orderStatus = 'pending'
        break
      case 'rejected':
      case 'cancelled':
        paymentStatus = 'failed'
        orderStatus = 'cancelled'
        break
      case 'refunded':
        paymentStatus = 'refunded'
        orderStatus = 'refunded'
        break
      default:
        paymentStatus = 'pending'
        orderStatus = 'pending'
    }

    // Update order with payment info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mercadoPagoPaymentId: paymentId.toString(),
        paymentStatus,
        status: orderStatus,
        paidAt: status === 'approved' ? new Date() : null,
      },
    })

    // Create status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        fromStatus: order.status,
        toStatus: orderStatus,
        notes: `Pago ${status} - MercadoPago ID: ${paymentId}`,
      },
    })

    console.log(`Order ${externalReference} updated: payment=${paymentStatus}, order=${orderStatus}`)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    // Return 200 to prevent MercadoPago from retrying
    return NextResponse.json({ error: 'Internal error' }, { status: 200 })
  }
}

// MercadoPago may also send GET requests for verification
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok' })
}
