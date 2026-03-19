"use client"

import Image from "next/image"
import Link from "next/link"
import { X, ShoppingCart, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/currency"
import { useComparisonStore } from "@/lib/store/comparison-store"
import { useCartStore } from "@/lib/store/cart-store"
import { useState } from "react"

export default function ComparePage() {
  const { products, removeProduct, clearComparison } = useComparisonStore()
  const { addToCart } = useCartStore()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    setAddingToCart(productId)
    addToCart(product)

    setTimeout(() => {
      setAddingToCart(null)
    }, 1000)
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">So sánh sản phẩm</h1>
          <p className="text-muted-foreground mb-6">
            Chưa có sản phẩm nào để so sánh. Hãy thêm sản phẩm vào danh sách so sánh.
          </p>
          <Link href="/products">
            <Button>Xem sản phẩm</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get all unique specification keys from all products
  const allSpecKeys = new Set<string>()
  products.forEach(product => {
    if (product.specifications) {
      Object.keys(product.specifications).forEach(key => allSpecKeys.add(key))
    }
  })

  const specKeys = Array.from(allSpecKeys)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">So sánh sản phẩm ({products.length})</h1>
        <Button variant="outline" onClick={clearComparison}>
          Xóa tất cả
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Product Headers */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="font-semibold text-muted-foreground">Sản phẩm</div>
            {products.map((product) => (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
                  onClick={() => removeProduct(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-3 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="text-lg font-bold text-primary mb-2">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.review_count})</span>
                  </div>
                  <Button
                    className="w-full text-xs"
                    size="sm"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingToCart === product.id}
                  >
                    {addingToCart === product.id ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Đã thêm
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Thêm vào giỏ
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Specifications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {specKeys.map((key) => (
                  <div key={key} className="grid gap-4 p-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                    <div className="font-medium text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    {products.map((product) => (
                      <div key={product.id} className="text-sm">
                        {product.specifications?.[key] ? (
                          Array.isArray(product.specifications[key])
                            ? product.specifications[key].join(', ')
                            : String(product.specifications[key])
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
