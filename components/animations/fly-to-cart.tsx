"use client";

import { useState, useCallback, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlyingItem {
  id: string;
  src: string;
  startRect: DOMRect;
  endRect: DOMRect;
}

export function useFlyToCart() {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  const flyToCart = useCallback(
    (
      imageSrc: string,
      startElement: HTMLElement,
      cartButtonSelector = "[data-cart-icon]",
    ) => {
      const cartBtn = document.querySelector(
        cartButtonSelector,
      ) as HTMLElement | null;
      if (!cartBtn) {
        console.warn("Cart button not found");
        return;
      }

      const startRect = startElement.getBoundingClientRect();
      const endRect = cartBtn.getBoundingClientRect();

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      setFlyingItems((prev) => [
        ...prev,
        { id, src: imageSrc, startRect, endRect },
      ]);

      // Cleanup after animation
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== id));
      }, 900);
    },
    [],
  );

  const FlyingItemsLayer = useCallback(() => {
    return (
      <AnimatePresence>
        {flyingItems.map((item) => {
          const startX = item.startRect.left + item.startRect.width / 2;
          const startY = item.startRect.top + item.startRect.height / 2;
          const endX = item.endRect.left + item.endRect.width / 2;
          const endY = item.endRect.top + item.endRect.height / 2;

          return (
            <motion.img
              key={item.id}
              src={item.src}
              alt=""
              className="pointer-events-none fixed z-9999 w-16 h-16 object-cover rounded-lg shadow-2xl"
              initial={{
                x: startX - 32,
                y: startY - 32,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: endX - 32,
                y: endY - 32,
                scale: 0.2,
                opacity: 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.2, 0.8, 0.2, 1] as const,
              }}
              style={{ willChange: "transform, opacity" }}
            />
          );
        })}
      </AnimatePresence>
    );
  }, [flyingItems]);

  return { flyToCart, FlyingItemsLayer };
}

/* ------------------------------------------------------------------ */
/*  Wrapper component — use this when you don't want to manage state  */
/* ------------------------------------------------------------------ */

interface FlyToCartProps {
  children: ReactNode;
  imageUrl: string;
  imageRef: RefObject<HTMLImageElement | null>;
  onComplete?: () => void;
  cartButtonSelector?: string;
}

export function FlyToCart({
  children,
  imageUrl,
  imageRef,
  onComplete,
  cartButtonSelector = "[data-cart-icon]",
}: FlyToCartProps) {
  const { flyToCart, FlyingItemsLayer } = useFlyToCart();

  const handleClick = () => {
    const img = imageRef.current;
    if (img) {
      flyToCart(imageUrl, img, cartButtonSelector);
    }
    // Delay the actual cart action slightly so the animation starts first
    setTimeout(() => {
      onComplete?.();
    }, 150);
  };

  return (
    <>
      <div onClick={handleClick} className="contents">
        {children}
      </div>
      <FlyingItemsLayer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Global overlay component — place once at app root                 */
/* ------------------------------------------------------------------ */

export function FlyToCartOverlay() {
  const { FlyingItemsLayer } = useFlyToCart();
  return <FlyingItemsLayer />;
}
