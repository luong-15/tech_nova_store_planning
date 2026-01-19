import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem } from "@/lib/types"

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          })
        } else {
          set({ items: [...items, { product, quantity }] })
        }

        // Auto open cart when adding item
        set({ isOpen: true })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        })
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    {
      name: "technova-cart",
    },
  ),
)
