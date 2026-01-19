"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/currency"
import type { Product } from "@/lib/types"
import { useCartStore } from "@/lib/store/cart-store"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const { addItem } = useCartStore()
  const [isAdded, setIsAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)

    // Add to cart
    addItem(product, 1)

    // Show success feedback
    setTimeout(() => {
      setIsAdding(false)
      setIsAdded(true)

      // Reset after 2 seconds
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    }, 300)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {discount > 0 && <Badge className="absolute left-2 top-2 bg-red-600 hover:bg-red-700">-{discount}%</Badge>}
          {product.is_deal && <Badge className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700">Hot Deal</Badge>}
        </div>
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.brand && <p className="mb-2 text-sm text-muted-foreground">{product.brand}</p>}

        <div className="mb-2 flex items-center gap-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.review_count})</span>
        </div>

        <div className="flex flex-col gap-1 mt-auto">
          <div className="text-xl font-bold text-primary">{formatPrice(product.price)}</div>
          {product.original_price && (
            <div className="text-sm text-muted-foreground line-through">{formatPrice(product.original_price)}</div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className={`w-full transition-all duration-300 ${
            isAdded ? "bg-green-600 hover:bg-green-700" : ""
          } ${isAdding ? "scale-95" : ""}`}
          size="sm"
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
        >
          {isAdded ? (
            <>
              <Check className="mr-2 h-4 w-4 animate-in zoom-in" />
              Đã thêm
            </>
          ) : isAdding ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Đang thêm...
            </>
          ) : product.stock === 0 ? (
            "Hết hàng"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Thêm vào giỏ
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
