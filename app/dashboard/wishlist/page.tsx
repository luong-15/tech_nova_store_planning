"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { useCartStore } from "@/lib/store/cart-store"
import Image from "next/image"
import Link from "next/link"
import type { WishlistItem, Product } from "@/lib/types"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<(WishlistItem & { product: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  const fetchWishlist = async () => {
    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: wishlist } = await supabase.from("wishlist").select("*").eq("user_id", user.id)

      if (wishlist && wishlist.length > 0) {
        const productIds = wishlist.map((w) => w.product_id)
        const { data: products } = await supabase.from("products").select("*").in("id", productIds)

        if (products) {
          const combined = wishlist.map((w) => ({
            ...w,
            product: products.find((p) => p.id === w.product_id)!,
          }))
          setWishlistItems(combined.filter((item) => item.product))
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const removeFromWishlist = async (wishlistId: string) => {
    const supabase = createBrowserClient()
    await supabase.from("wishlist").delete().eq("id", wishlistId)
    setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId))
  }

  const addToCart = (product: Product) => {
    addItem(product)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
        <p className="text-muted-foreground">Danh sách sản phẩm bạn đã lưu</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card/50 py-16 backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
            <Heart className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Chưa có sản phẩm yêu thích</h3>
          <p className="mt-1 text-sm text-muted-foreground">Lưu các sản phẩm bạn quan tâm để xem lại sau</p>
          <Button asChild className="mt-4">
            <Link href="/products">Khám phá sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {wishlistItems.map((item, index) => (
            <div
              key={item.id}
              className="group flex gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-primary/30"
              style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
            >
              {/* Product Image */}
              <Link
                href={`/products/${item.product.slug}`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-muted/50"
              >
                <Image
                  src={item.product.image_url || "/placeholder.svg?height=112&width=112&query=tech product"}
                  alt={item.product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {item.product.original_price && item.product.original_price > item.product.price && (
                  <div className="absolute left-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    -{Math.round((1 - item.product.price / item.product.original_price) * 100)}%
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.product.slug}`} className="line-clamp-2 font-medium hover:text-primary">
                    {item.product.name}
                  </Link>
                  {item.product.brand && <p className="mt-0.5 text-xs text-muted-foreground">{item.product.brand}</p>}
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">
                      {item.product.rating} ({item.product.review_count})
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-bold text-primary">{formatCurrency(item.product.price)}</p>
                    {item.product.original_price && item.product.original_price > item.product.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(item.product.original_price)}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 bg-transparent p-0"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                    <Button size="sm" className="h-8" onClick={() => addToCart(item.product)}>
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
