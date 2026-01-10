import { Prisma } from '@/lib/generated/prisma'

// Product types
export type Product = Prisma.ProductGetPayload<{}>

export type ProductWithImages = Prisma.ProductGetPayload<{
  include: { productImages: true }
}>

// Ribbon and Applique types
export type Ribbon = Prisma.RibbonGetPayload<{}>
export type Applique = Prisma.AppliqueGetPayload<{}>

// Product Image types
export type ProductImage = Prisma.ProductImageGetPayload<{}>

export type ProductImageWithRelations = Prisma.ProductImageGetPayload<{
  include: {
    product: true
    ribbon: true
    applique: true
  }
}>

// Order types
export type Order = Prisma.OrderGetPayload<{}>

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: true
        ribbon: true
        applique: true
      }
    }
  }
}>

export type OrderItem = Prisma.OrderItemGetPayload<{}>

export type OrderItemWithRelations = Prisma.OrderItemGetPayload<{
  include: {
    product: true
    ribbon: true
    applique: true
  }
}>

// Admin types
export type AdminUser = Prisma.AdminUserGetPayload<{}>
export type AdminSession = Prisma.AdminSessionGetPayload<{}>

export type AdminUserWithSessions = Prisma.AdminUserGetPayload<{
  include: { sessions: true }
}>

// Order status history
export type OrderStatusHistory = Prisma.OrderStatusHistoryGetPayload<{}>

export type OrderStatusHistoryWithRelations = Prisma.OrderStatusHistoryGetPayload<{
  include: {
    order: true
    changedBy: true
  }
}>

// Enums for order statuses
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded'
export type AdminRole = 'admin' | 'super_admin'
