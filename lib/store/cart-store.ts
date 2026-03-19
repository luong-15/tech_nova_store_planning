import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem } from "@/lib/types"

interface CartState {
  cartItems: CartItem[]
  isOpen: boolean

  // Actions
  addToCart: (product: Product) => void
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
      cartItems: [],
      isOpen: false,

      addToCart: (product) => {
        const items = get().cartItems
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          set({
            cartItems: items.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          })
        } else {
          set({ cartItems: [...items, { product, quantity: 1 }] })
        }

        // Auto open cart when adding item
        set({ isOpen: true })
      },

      removeItem: (productId) => {
        set({ cartItems: get().cartItems.filter((item) => item.product.id !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          cartItems: get().cartItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        })
      },

      clearCart: () => set({ cartItems: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () => get().cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    {
      name: "technova-cart",
    },
  ),
)
