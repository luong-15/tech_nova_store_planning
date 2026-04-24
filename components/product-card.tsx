"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { useComparisonStore } from "@/lib/store/comparison-store"
import { notifyCartAdded, notifyComparisonAdded, notifyError } from "@/lib/notifications"
import { useCallback, useState, useRef, memo } from "react"
import { formatPrice } from "@/lib/currency"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { ShoppingCart, GitCompare, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { triggerFlyToCart } from "@/components/animations/fly-to-cart"

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const addProduct = useComparisonStore((state) => state.addProduct);
  const isProductInComparison = useComparisonStore((state) => state.isProductInComparison);
  const canAddProduct = useComparisonStore((state) => state.canAddProduct);
  const [isInCart, setIsInCart] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const [isAnimating, setIsAnimating] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const wasEmpty = cartItems.length === 0;
    
    // Trigger fly-to-cart animation
    triggerFlyToCart(product.image_url, product.id, e);
    setIsAnimating(true);
    
    // Add to cart after a brief delay
    setTimeout(() => {
      addToCart(product);
      setIsInCart(true);
      setIsAnimating(false);
      
      notifyCartAdded(product.name, async () => {
        const freshCartStore = useCartStore.getState()
        freshCartStore.removeFromCart(product.id)
        setIsInCart(false)
        if (wasEmpty) {
          notifyError("Giỏ hàng đã được hoàn tác")
        }
      });
    }, 200);
  }, [product, addToCart, cartItems.length]);

  const handleAddToComparison = () => {
    if (canAddProduct(product)) {
      addProduct(product);
      notifyComparisonAdded(product.name);
    } else {
      notifyError("Danh sách so sánh đã đầy.");
    }
  };

  const inComparison = isProductInComparison(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative bg-background border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 hover:border-primary/30"
    >
      {/* Border glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(600px at 50% 50%, rgba(147, 51, 234, 0.1), transparent 80%)',
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Nút so sánh - Thêm hiệu ứng trượt từ phải sang (slide-in) */}
      <button
        onClick={handleAddToComparison}
        disabled={!canAddProduct(product) && !inComparison}
        className={cn(
          "absolute top-3 right-3 z-20 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500 active:scale-90",
          inComparison
            ? "bg-blue-500 text-white border-transparent shadow-md"
            : "bg-background/80 border border-border/50 text-muted-foreground hover:text-primary opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 shadow-sm"
        )}
        title="So sánh"
      >
        <GitCompare size={14} className={cn(inComparison && "animate-pulse")} />
      </button>

      {/* Image Container - Tỉ lệ 4:3 chuẩn, thêm gradient overlay khi hover */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-muted/20">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-95" 
        />
        {/* Lớp phủ mờ dần từ dưới lên giúp ảnh có chiều sâu hơn khi hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="p-3.5 flex flex-col justify-between">
        {/* Tên sản phẩm - Font chữ mượt hơn */}
        <Link href={`/products/${product.slug}`} className="block mb-1.5">
          <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug transition-colors duration-300 group-hover:text-primary min-h-10">
            {product.name}
          </h3>
        </Link>
        
        {/* Khu vực Giá & Tag */}
        <div className="flex items-center justify-between gap-2 mb-3.5 mt-auto">
          <p className="text-base font-black text-primary tracking-tight">
            {formatPrice(product.price)}
          </p>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest shadow-[0_0_10px_rgba(var(--primary),0.1)]">
            New
          </span>
        </div>

        {/* Nút hành động - Nâng cấp hiệu ứng hover bên trong (Group-hover cho Icon) */}
        <motion.button
          ref={cartButtonRef}
          onClick={handleAddToCart}
          disabled={isInCart || isAnimating}
          data-cart-button
          className={cn(
            "group/btn w-full h-9 flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 overflow-hidden relative",
            isInCart 
              ? "bg-emerald-500 text-white" 
              : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md",
            isAnimating && "opacity-75"
          )}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: isInCart ? 1 : 1.02 }}
        >
          {isInCart ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Check size={14} />
              </motion.div>
              <span>Đã thêm</span>
            </>
          ) : (
            <>
              {/* Hiệu ứng xe đẩy nhích lên phía trước khi hover nút */}
              <motion.div
                animate={isAnimating ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
              >
                <ShoppingCart size={14} className="transition-transform duration-300 group-hover/btn:-rotate-12 group-hover/btn:-translate-x-0.5" />
              </motion.div>
              <span>Thêm giỏ hàng</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export const MemoizedProductCard = memo(ProductCard, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id
})
