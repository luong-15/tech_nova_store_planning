"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { useComparisonStore } from "@/lib/store/comparison-store"
import { notifyCartAdded, notifyComparisonAdded, notifyError } from "@/lib/notifications"
import { useCallback, useState } from "react"
import { formatPrice } from "@/lib/currency"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
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
  }, [product, addToCart, removeFromCart, cartItems.length]);

  const handleAddToComparison = () => {
    if (canAddProduct(product)) {
      addProduct(product);
      notifyComparisonAdded(product.name);
    } else {
      notifyError("Danh sách so sánh đã đầy. Vui lòng xóa một sản phẩm để thêm mới.");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-200 group">
      <Link href={`/products/${product.slug}`} className="block">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-48 object-cover mb-4 rounded-lg hover:opacity-90 transition-opacity group-hover:scale-[1.02] duration-300" 
        />
        <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
      </Link>
      <p className="text-gray-600 font-medium">{formatPrice(product.price)}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isInCart}
        >
          {isInCart ? "✓ Trong giỏ" : "Thêm vào giỏ"}
        </button>
        <button
          onClick={handleAddToComparison}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isProductInComparison(product.id)
              ? "bg-emerald-500 text-white shadow-md cursor-not-allowed opacity-75"
              : canAddProduct(product)
              ? "bg-linear-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!canAddProduct(product)}
        >
          {isProductInComparison(product.id) ? "✓ So sánh" : "So sánh"}
        </button>
      </div>
    </div>
  );
}
