import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartStore } from '@/types/customization'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const state = get()

        // Check if an identical item already exists in cart
        const existingItemIndex = state.items.findIndex(
          (cartItem) =>
            cartItem.productId === item.productId &&
            cartItem.ribbonId === item.ribbonId &&
            cartItem.appliqueId === item.appliqueId &&
            cartItem.customTextName === item.customTextName &&
            cartItem.customTextDescription === item.customTextDescription
        )

        if (existingItemIndex !== -1) {
          // Item exists, merge quantities
          const existingItem = state.items[existingItemIndex]
          const newQuantity = Math.min(existingItem.quantity + item.quantity, 150)

          set((state) => ({
            items: state.items.map((cartItem, index) =>
              index === existingItemIndex
                ? {
                    ...cartItem,
                    quantity: newQuantity,
                    subtotal: cartItem.unitPrice * newQuantity,
                  }
                : cartItem
            ),
          }))
        } else {
          // Item doesn't exist, add as new
          const newItem: CartItem = {
            ...item,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            subtotal: item.unitPrice * item.quantity,
          }

          set((state) => ({
            items: [...state.items, newItem],
          }))
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId)
          return
        }

        if (quantity > 150) {
          console.warn('Quantity exceeds maximum of 150')
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity, subtotal: item.unitPrice * quantity }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.subtotal, 0)
      },

      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'sengge-cart-storage',
    }
  )
)
