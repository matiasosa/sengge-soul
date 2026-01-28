import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const appliques = await prisma.applique.findMany({
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
        displayOrder: true,
      },
    })

    return NextResponse.json({
      success: true,
      appliques,
    })
  } catch (error) {
    console.error('Error fetching appliques:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch appliques',
      },
      { status: 500 }
    )
  }
}
