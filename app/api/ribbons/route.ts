import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ribbons = await prisma.ribbon.findMany({
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
        displayName: true,
        hexColor: true,
        displayOrder: true,
      },
    })

    return NextResponse.json({
      success: true,
      ribbons,
    })
  } catch (error) {
    console.error('Error fetching ribbons:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ribbons',
      },
      { status: 500 }
    )
  }
}
