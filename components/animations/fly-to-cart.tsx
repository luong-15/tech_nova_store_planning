'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'

interface FlyItem {
  id: string
  image: string
  x: number
  y: number
}

export function FlyToCartOverlay() {
  const [flyItems, setFlyItems] = useState<FlyItem[]>([])
  const { addItem: _addItem } = useCartStore()

  useEffect(() => {
    const handleFlyToCart = (event: CustomEvent<FlyItem>) => {
      const newItem = {
        ...event.detail,
        id: `${event.detail.id}-${Date.now()}`,
      }
      setFlyItems((prev) => [...prev, newItem])

      // Remove the item after animation completes
      setTimeout(() => {
        setFlyItems((prev) =>
          prev.filter((item) => item.id !== newItem.id)
        )
      }, 1000)
    }

    window.addEventListener(
      'flyToCart',
      handleFlyToCart as EventListener
    )

    return () => {
      window.removeEventListener('flyToCart', handleFlyToCart as EventListener)
    }
  }, [])

  return (
    <AnimatePresence>
      {flyItems.map((item) => (
        <FlyItem key={item.id} item={item} />
      ))}
    </AnimatePresence>
  )
}

interface FlyItemProps {
  item: FlyItem
}

function FlyItem({ item }: FlyItemProps) {
  const cartButtonRect = document.querySelector('[data-cart-button]')?.getBoundingClientRect()

  const endX = cartButtonRect?.right ?? window.innerWidth - 20
  const endY = cartButtonRect?.top ?? 20

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      initial={{
        x: item.x,
        y: item.y,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: endX,
        y: endY,
        opacity: 0,
        scale: 0.3,
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: 'easeInOut',
      }}
    >
      <motion.img
        src={item.image}
        alt="Flying to cart"
        className="w-16 h-16 object-cover rounded-lg shadow-xl"
        initial={{ rotate: 0 }}
        animate={{ rotate: 720 }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  )
}

// Helper function to trigger fly-to-cart animation
export function triggerFlyToCart(
  imageUrl: string,
  productId: string,
  event: React.MouseEvent<HTMLButtonElement>
) {
  const rect = event.currentTarget.getBoundingClientRect()

  const customEvent = new CustomEvent('flyToCart', {
    detail: {
      id: productId,
      image: imageUrl,
      x: rect.left + rect.width / 2 - 32,
      y: rect.top + rect.height / 2 - 32,
    },
  })

  window.dispatchEvent(customEvent)
}
