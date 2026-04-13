"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Trash2, Star, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { useCartStore } from "@/lib/store/cart-store"
import { notifyCartAdded } from "@/lib/notifications"
import Image from "next/image"
import Link from "next/link"
import type { WishlistItem, Product } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<(WishlistItem & { product: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const cartStore = useCartStore()

  const fetchWishlist = async () => {
    const supabase = createBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: wishlist } = await supabase.from("wishlist").select("*").eq("user_id", user.id)
      if (wishlist?.length) {
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

  useEffect(() => { fetchWishlist() }, [])

  const removeFromWishlist = async (wishlistId: string) => {
    setRemovingId(wishlistId)
    const supabase = createBrowserClient()
    await supabase.from("wishlist").delete().eq("id", wishlistId)
    setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId))
    setRemovingId(null)
  }

  if (loading) return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sản phẩm yêu thích</h1>
        <p className="text-muted-foreground mt-1">Danh sách các sản phẩm bạn đã lưu.</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 bg-muted/10">
          <Heart className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">Danh sách của bạn đang trống.</p>
          <Button asChild className="mt-4 rounded-full px-6">
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {wishlistItems.map((item) => {
            const hasDiscount = item.product.original_price && item.product.original_price > item.product.price;
            
            return (
              <div
                key={item.id}
                className="group relative flex gap-4 rounded-2xl border bg-card p-3 transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
              >
                {/* Image Section */}
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-900/50">
                  <Image
                    src={item.product.image_url || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal transition-transform group-hover:scale-110"
                  />
                  {hasDiscount && (
                    <Badge className="absolute top-1.5 left-1.5 bg-red-500 hover:bg-red-500 border-none px-1 h-5 text-[10px] font-bold">
                      -{Math.round((1 - item.product.price / item.product.original_price!) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between min-w-0 pr-2">
                  <div className="relative">
                    <Link href={`/products/${item.product.slug}`} className="block pr-8">
                      <h3 className="line-clamp-1 font-semibold text-foreground hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    
                    {/* Trash button positioned Top-Right */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removingId === item.id}
                    >
                      {removingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] font-normal py-0 px-1.5 bg-muted/50 border-none">
                        {item.product.brand || "TechNova"}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 border-none" />
                        <span>{item.product.rating || "5.0"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      {hasDiscount && (
                        <span className="text-[11px] text-muted-foreground line-through decoration-muted-foreground/50">
                          {formatCurrency(item.product.original_price!)}
                        </span>
                      )}
                      <span className="text-base font-bold text-primary">
                        {formatCurrency(item.product.price)}
                      </span>
                    </div>

                    <Button 
                      size="sm" 
                      className="h-9 rounded-xl px-4 gap-2 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
                      onClick={() => {
                        cartStore.addToCart(item.product);
                        notifyCartAdded(item.product.name);
                      }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span className="text-xs font-medium">Thêm vào giỏ</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}