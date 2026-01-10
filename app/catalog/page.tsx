import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/product/ProductGrid'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  })

  return products
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white"
        >
          <div className="aspect-square w-full animate-pulse bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="h-8 bg-slate-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function CatalogPage() {
  const products = await getProducts()

  return (
    <div className="bg-slate-50 min-h-screen">
      <MaxWidthWrapper className="py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Nuestros Productos
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Elegí tu vela y personalizala a tu gusto
          </p>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>

        {/* Info Section */}
        <div className="mt-12 rounded-lg bg-white p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#782048] text-white font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Elegí tu producto</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Seleccioná el diseño de vela que más te guste
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#782048] text-white font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Personalizá</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Elegí colores, apliques y agregá tu mensaje
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#782048] text-white font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Recibilo en casa</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Pagá y recibí tu vela personalizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export const metadata = {
  title: 'Catálogo - Sengge Soul',
  description: 'Explorá nuestro catálogo de velas personalizables',
}
