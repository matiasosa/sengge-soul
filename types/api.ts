// API Request/Response types

// Order creation
export interface CreateOrderRequest {
  customerEmail: string
  customerName: string
  customerPhone?: string
  shippingAddress: string
  shippingCity?: string
  shippingProvince?: string
  shippingPostalCode?: string
  shippingNotes?: string
  items: OrderItemInput[]
}

export interface OrderItemInput {
  productId: number
  ribbonId?: number
  appliqueId?: number
  customTextName?: string
  customTextDescription?: string
  quantity: number
}

export interface CreateOrderResponse {
  success: boolean
  orderId: number
  orderNumber: string
  mercadoPagoUrl?: string
  error?: string
}

// MercadoPago integration
export interface MercadoPagoPreferenceRequest {
  orderId: number
  total: number
  items: {
    title: string
    quantity: number
    unit_price: number
  }[]
  backUrls: {
    success: string
    failure: string
    pending: string
  }
  externalReference: string
}

export interface MercadoPagoPreferenceResponse {
  success: boolean
  preferenceId?: string
  initPoint?: string
  error?: string
}

export interface MercadoPagoWebhookPayload {
  action: string
  api_version: string
  data: {
    id: string
  }
  date_created: string
  id: number
  live_mode: boolean
  type: string
  user_id: string
}

// Admin authentication
export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  success: boolean
  sessionToken?: string
  user?: {
    id: number
    email: string
    name: string
    role: string
  }
  error?: string
}

export interface AdminSessionResponse {
  success: boolean
  user?: {
    id: number
    email: string
    name: string
    role: string
  }
  error?: string
}

// Order management
export interface UpdateOrderStatusRequest {
  status: string
  notes?: string
}

export interface UpdateOrderStatusResponse {
  success: boolean
  error?: string
}

// Product queries
export interface GetProductsResponse {
  success: boolean
  products?: Array<{
    id: number
    slug: string
    name: string
    description: string | null
    basePrice: number
    supportsRibbon: boolean
    supportsApplique: boolean
    textNameMaxChars: number
    textDescriptionMaxChars: number
    isActive: boolean
    displayOrder: number
  }>
  error?: string
}

export interface GetProductBySlugResponse {
  success: boolean
  product?: {
    id: number
    slug: string
    name: string
    description: string | null
    basePrice: number
    supportsRibbon: boolean
    supportsApplique: boolean
    textNameMaxChars: number
    textDescriptionMaxChars: number
    isActive: boolean
  }
  error?: string
}

// Customization options
export interface GetRibbonsResponse {
  success: boolean
  ribbons?: Array<{
    id: number
    slug: string
    name: string
    displayName: string
    hexColor: string | null
    displayOrder: number
  }>
  error?: string
}

export interface GetAppliquesResponse {
  success: boolean
  appliques?: Array<{
    id: number
    slug: string
    name: string
    displayName: string
    displayOrder: number
  }>
  error?: string
}

// Product images
export interface GetProductImageRequest {
  productSlug: string
  ribbonSlug?: string
  appliqueSlug?: string
}

export interface GetProductImageResponse {
  success: boolean
  imagePath?: string
  error?: string
}
