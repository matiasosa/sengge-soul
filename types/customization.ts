// Customization and cart types

export interface CustomizationState {
  productSlug: string
  ribbonSlug?: string
  appliqueSlug?: string
  textName: string
  textDescription: string
  quantity: number
}

export interface CartItem {
  id: string // Unique ID for this cart item (generated)
  productId: number
  productSlug: string
  productName: string
  productPrice: number // Base price in cents

  // Customization options
  ribbonId?: number
  ribbonSlug?: string
  ribbonName?: string

  appliqueId?: number
  appliqueSlug?: string
  appliqueName?: string

  customTextName?: string
  customTextDescription?: string

  // Quantity and pricing
  quantity: number
  unitPrice: number // Price in cents
  subtotal: number // unitPrice * quantity in cents

  // Image reference
  imagePath?: string
}

export interface CartStore {
  items: CartItem[]

  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'subtotal'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void

  // Getters
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemCount: () => number
}

export interface ProductPreviewProps {
  productSlug: string
  ribbonSlug?: string
  appliqueSlug?: string
  textName?: string
  textDescription?: string
  className?: string
}

export interface CustomizationOptions {
  ribbons: Array<{
    id: number
    slug: string
    name: string
    displayName: string
    hexColor: string | null
    isActive: boolean
  }>
  appliques: Array<{
    id: number
    slug: string
    name: string
    displayName: string
    isActive: boolean
  }>
}
