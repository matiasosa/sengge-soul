import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartStore } from '@/types/customization'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const newItem: CartItem = {
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          subtotal: item.unitPrice * item.quantity,
        }

        set((state) => ({
          items: [...state.items, newItem],
        }))
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
