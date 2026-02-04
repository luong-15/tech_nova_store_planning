"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { useComparisonStore } from "@/lib/store/comparison-store"
import { useState } from "react"
import { toast } from "sonner"
import { formatPrice } from "@/lib/currency"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const addProduct = useComparisonStore((state) => state.addProduct);
  const isProductInComparison = useComparisonStore((state) => state.isProductInComparison);
  const canAddProduct = useComparisonStore((state) => state.canAddProduct);
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsInCart(true);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToComparison = () => {
    if (canAddProduct(product)) {
      addProduct(product);
      toast.success(`${product.name} added to comparison!`);
    } else {
      toast.error("Comparison list is full. Remove an item to add more.");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover mb-4 hover:opacity-90 transition-opacity" />
        <h3 className="text-lg font-semibold hover:text-primary transition-colors">{product.name}</h3>
      </Link>
      <p className="text-gray-600">{formatPrice(product.price)}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          disabled={isInCart}
        >
          {isInCart ? "Trong giỏ hàng" : "Thêm vào giỏ hàng"}
        </button>
        <button
          onClick={handleAddToComparison}
          className={`px-4 py-2 rounded text-white transition-colors ${
            isProductInComparison(product.id)
              ? "bg-green-500 cursor-not-allowed"
              : canAddProduct(product)
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!canAddProduct(product)}
        >
          {isProductInComparison(product.id) ? "In Comparison" : "Compare"}
        </button>
      </div>
    </div>
  );
}
