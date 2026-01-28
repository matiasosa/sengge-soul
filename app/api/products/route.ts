import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        basePrice: true,
        supportsRibbon: true,
        supportsApplique: true,
        textNameMaxChars: true,
        textDescriptionMaxChars: true,
        displayOrder: true,
      },
    })

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}
