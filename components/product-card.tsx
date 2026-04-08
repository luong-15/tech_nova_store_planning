"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { useComparisonStore } from "@/lib/store/comparison-store"
import { notifyCartAdded, notifyComparisonAdded, notifyError } from "@/lib/notifications"
import { useCallback, useState } from "react"
import { formatPrice } from "@/lib/currency"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { ShoppingCart, GitCompare, Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const handleAddToCart = useCallback(() => {
    const wasEmpty = cartItems.length === 0;
    addToCart(product);
    setIsInCart(true);
    
    notifyCartAdded(product.name, async () => {
      const freshCartStore = useCartStore.getState()
      freshCartStore.removeFromCart(product.id)
      setIsInCart(false)
      if (wasEmpty) {
        notifyError("Giỏ hàng đã được hoàn tác")
      }
    });
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
    <div className="group relative bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Nút so sánh nhanh - Chuyển thành Badge nhỏ góc phải để tiết kiệm diện tích */}
      <button
        onClick={handleAddToComparison}
        disabled={!canAddProduct(product) && !inComparison}
        className={cn(
          "absolute top-2 right-2 z-20 h-8 w-8 rounded-full flex items-center justify-center border backdrop-blur-md transition-all active:scale-90",
          inComparison
            ? "bg-blue-500 text-white border-transparent"
            : "bg-white/80 dark:bg-slate-900/80 border-border/50 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100"
        )}
      >
        <GitCompare size={14} />
      </button>

      {/* Image Container - Giảm tỉ lệ padding */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-muted/30">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
      </Link>

      <div className="p-3">
        {/* Tên sản phẩm - Font nhỏ hơn, khống chế 2 dòng */}
        <Link href={`/products/${product.slug}`} className="block mb-1">
          <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-10">
            {product.name}
          </h3>
        </Link>
        
        {/* Giá tiền - Gọn gàng hơn */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-base font-bold text-primary tracking-tight">
            {formatPrice(product.price)}
          </p>
          {/* Tag nhỏ xinh */}
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/5 text-primary/60 border border-primary/10 uppercase">
            New
          </span>
        </div>

        {/* Nút hành động - Tối ưu chiều cao */}
        <button
          onClick={handleAddToCart}
          disabled={isInCart}
          className={cn(
            "w-full h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition-all duration-300 active:scale-95",
            isInCart 
              ? "bg-emerald-500 text-white shadow-none" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          )}
        >
          {isInCart ? (
            <>
              <Check size={14} />
              <span>Đã thêm</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              <span>Thêm giỏ hàng</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}