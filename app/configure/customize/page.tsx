'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { ProductPreview } from '@/components/product/ProductPreview'
import { RibbonSelector } from '@/components/customization/RibbonSelector'
import { AppliqueSelector } from '@/components/customization/AppliqueSelector'
import { TextCustomizer } from '@/components/customization/TextCustomizer'
import { QuantitySelector } from '@/components/customization/QuantitySelector'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

interface Product {
  id: number
  slug: string
  name: string
  description: string | null
  basePrice: number
  supportsRibbon: boolean
  supportsApplique: boolean
  textNameMaxChars: number
  textDescriptionMaxChars: number
}

interface Ribbon {
  id: number
  slug: string
  name: string
  displayName: string
  hexColor: string | null
}

interface Applique {
  id: number
  slug: string
  name: string
  displayName: string
}

function CustomizePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productSlug = searchParams.get('p') || 'corona-box'

  const [product, setProduct] = useState<Product | null>(null)
  const [ribbons, setRibbons] = useState<Ribbon[]>([])
  const [appliques, setAppliques] = useState<Applique[]>([])
  const [loading, setLoading] = useState(true)

  // Customization state
  const [selectedRibbon, setSelectedRibbon] = useState<string>('azul')
  const [selectedApplique, setSelectedApplique] = useState<string>('corona')
  const [textName, setTextName] = useState('')
  const [textDescription, setTextDescription] = useState('')
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch product
        const productRes = await fetch('/api/products')
        const productData = await productRes.json()
        const foundProduct = productData.products?.find(
          (p: Product) => p.slug === productSlug
        )

        if (!foundProduct) {
          router.push('/catalog')
          return
        }

        setProduct(foundProduct)

        // Fetch ribbons if product supports them
        if (foundProduct.supportsRibbon) {
          const ribbonsRes = await fetch('/api/ribbons')
          const ribbonsData = await ribbonsRes.json()
          setRibbons(ribbonsData.ribbons || [])
          if (ribbonsData.ribbons?.[0]) {
            setSelectedRibbon(ribbonsData.ribbons[0].slug)
          }
        }

        // Fetch appliques if product supports them
        if (foundProduct.supportsApplique) {
          const appliquesRes = await fetch('/api/appliques')
          const appliquesData = await appliquesRes.json()
          setAppliques(appliquesData.appliques || [])
          if (appliquesData.appliques?.[0]) {
            setSelectedApplique(appliquesData.appliques[0].slug)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [productSlug, router])

  const handleAddToCart = () => {
    if (!product) return

    const ribbonData = ribbons.find((r) => r.slug === selectedRibbon)
    const appliqueData = appliques.find((a) => a.slug === selectedApplique)

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productPrice: product.basePrice,
      ribbonId: ribbonData?.id,
      ribbonSlug: ribbonData?.slug,
      ribbonName: ribbonData?.displayName,
      appliqueId: appliqueData?.id,
      appliqueSlug: appliqueData?.slug,
      appliqueName: appliqueData?.displayName,
      customTextName: textName,
      customTextDescription: textDescription,
      quantity,
      unitPrice: product.basePrice,
      imagePath: product.supportsRibbon
        ? `/images/products/${product.slug}-${selectedRibbon}-${selectedApplique}.png`
        : `/images/products/${product.slug}.jpg`,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#782048] mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format((product.basePrice * quantity) / 100)

  return (
    <div className="min-h-screen bg-slate-50">
      <MaxWidthWrapper className="py-8">
        {/* Back button */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#782048] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        {/* Main content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left side - Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductPreview
              productSlug={product.slug}
              ribbonSlug={selectedRibbon}
              appliqueSlug={selectedApplique}
              textName={textName}
              textDescription={textDescription}
            />
          </div>

          {/* Right side - Customization options */}
          <div>
            <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-200">
              <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
              {product.description && (
                <p className="mt-2 text-slate-600">{product.description}</p>
              )}

              <div className="mt-6 space-y-6">
                {/* Ribbon selector */}
                {product.supportsRibbon && ribbons.length > 0 && (
                  <RibbonSelector
                    ribbons={ribbons}
                    selectedRibbonSlug={selectedRibbon}
                    onSelect={setSelectedRibbon}
                  />
                )}

                {/* Applique selector */}
                {product.supportsApplique && appliques.length > 0 && (
                  <AppliqueSelector
                    appliques={appliques}
                    selectedAppliqueSlug={selectedApplique}
                    onSelect={setSelectedApplique}
                  />
                )}

                {/* Text customization */}
                <TextCustomizer
                  textName={textName}
                  textDescription={textDescription}
                  onNameChange={setTextName}
                  onDescriptionChange={setTextDescription}
                  maxNameChars={product.textNameMaxChars}
                  maxDescriptionChars={product.textDescriptionMaxChars}
                />

                {/* Quantity */}
                <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
              </div>

              {/* Add to cart */}
              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">Total:</span>
                  <span className="text-3xl font-bold text-[#782048]">{formattedPrice}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white font-semibold transition-colors',
                    'bg-[#782048] hover:bg-[#782048]/90'
                  )}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#782048] mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <CustomizePageContent />
    </Suspense>
  )
}