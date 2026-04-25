"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart-store";

interface FlyItem {
  id: string;
  image: string;
  x: number;
  y: number;
}

export function FlyToCartOverlay() {
  const [flyItems, setFlyItems] = useState<FlyItem[]>([]);
  const { addItem: _addItem } = useCartStore();

  useEffect(() => {
    const handleFlyToCart = (event: CustomEvent<FlyItem>) => {
      const newItem = {
        ...event.detail,
        id: `${event.detail.id}-${Date.now()}`,
      };
      setFlyItems((prev) => [...prev, newItem]);

      // Remove the item after animation completes
      setTimeout(() => {
        setFlyItems((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 1000);
    };

    window.addEventListener("flyToCart", handleFlyToCart as EventListener);

    return () => {
      window.removeEventListener("flyToCart", handleFlyToCart as EventListener);
    };
  }, []);

  return (
    <AnimatePresence>
      {flyItems.map((item) => (
        <FlyItem key={item.id} item={item} />
      ))}
    </AnimatePresence>
  );
}

interface FlyItemProps {
  item: FlyItem;
}

function FlyItem({ item }: FlyItemProps) {
  const [endPos, setEndPos] = useState({ x: window.innerWidth - 60, y: 80 });

  useEffect(() => {
    // Try multiple selectors to find cart icon
    const cartIcon =
      document.querySelector('a[href*="/cart"]') ||
      document.querySelector("[data-cart-link]") ||
      document.querySelector('[aria-label*="cart" i]');

    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      setEndPos({
        x: rect.left + rect.width / 2 - 24,
        y: rect.top + rect.height / 2 - 24,
      });
    }
  }, []);

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
        x: endPos.x,
        y: endPos.y,
        opacity: 0,
        scale: 0.2,
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      <motion.img
        src={item.image}
        alt="Flying to cart"
        className="w-12 h-12 object-cover rounded-lg shadow-2xl ring-1 ring-primary/50"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, ease: "linear" }}
      />
    </motion.div>
  );
}

// Helper function to trigger fly-to-cart animation
export function triggerFlyToCart(
  imageUrl: string,
  productId: string,
  event: React.MouseEvent<HTMLButtonElement>,
) {
  const rect = event.currentTarget.getBoundingClientRect();

  const customEvent = new CustomEvent("flyToCart", {
    detail: {
      id: productId,
      image: imageUrl,
      x: rect.left + rect.width / 2 - 32,
      y: rect.top + rect.height / 2 - 32,
    },
  });

  window.dispatchEvent(customEvent);
}
