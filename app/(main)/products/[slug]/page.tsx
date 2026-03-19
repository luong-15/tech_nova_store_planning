"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { useCartStore } from "@/lib/store/cart-store"
import { ProductGallery } from "@/components/product-gallery"
import { ProductSpecs } from "@/components/product-specs"
import { ProductReviews } from "@/components/product-reviews"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/currency"
import { ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Star, Clock } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import type { Product, Review, UserProfile } from "@/lib/types"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const addToCart = useCartStore((state) => state.addToCart)

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<(Review & { user?: UserProfile | null })[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    const fetchProductData = async () => {
      const supabase = createBrowserClient()

      // Fetch product
      const { data: productData, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single()

      if (error || !productData) {
        notFound()
        return
      }

      setProduct(productData)

      // Fetch reviews - separate queries to avoid relationship issues
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productData.id)
        .order("created_at", { ascending: false })

      // Fetch user profiles for reviews if reviews exist
      let reviewsWithUsers: (Review & { user?: UserProfile | null })[] = []
      if (reviewsData && reviewsData.length > 0) {
        const userIds = [...new Set(reviewsData.map((r: any) => r.user_id))]
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("*")
          .in("id", userIds)

        reviewsWithUsers = reviewsData.map((review: any) => ({
          ...review,
          user: profiles?.find((p: any) => p.id === review.user_id) || null,
        }))
      }

      setReviews(reviewsWithUsers)

      // Fetch related products
      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", productData.category_id)
        .neq("id", productData.id)
        .limit(4)

      if (related) {
        setRelatedProducts(related)
      }

      // Check if product is in wishlist (if user is logged in)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: wishlistItem } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", productData.id)
          .single()

        setIsInWishlist(!!wishlistItem)
      }

      setLoading(false)
    }

    fetchProductData()
  }, [slug])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      toast.success(`${product.name} đã được thêm vào giỏ hàng!`)
    }
  }

  const handleAddToWishlist = async () => {
    if (!product) return

    const supabase = createBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích")
      return
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id)

        if (error) throw error

        setIsInWishlist(false)
        toast.success("Đã xóa khỏi danh sách yêu thích")
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("wishlist")
          .insert({
            user_id: user.id,
            product_id: product.id,
          })

        if (error) throw error

        setIsInWishlist(true)
        toast.success("Đã thêm vào danh sách yêu thích")
      }
    } catch (error) {
      console.error("Wishlist error:", error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleShare = async () => {
    if (!product) return

    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: url,
        })
      } catch (error) {
        // User cancelled share or error occurred
        console.log("Share cancelled or failed")
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Đã sao chép liên kết sản phẩm")
      } catch (error) {
        toast.error("Không thể sao chép liên kết")
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  const images = (product.images as string[]) || [product.image_url]

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={images} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Rating */}
            <div className="flex items-center gap-4">
              {product.brand && (
                <Badge variant="outline" className="text-xs">
                  {product.brand}
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium">{product.rating?.toFixed(1) || "0.0"}</span>
                <span className="text-muted-foreground">({product.review_count || 0} đánh giá)</span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(product.discount_price || product.price)}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                    <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>
                  </>
                )}
              </div>

              {product.is_deal && (
                <div className="flex items-center gap-2 text-sm text-orange-500">
                  <Clock className="h-4 w-4" />
                  <span>Deal kết thúc sau: 02:45:30</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${product.stock && product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className={product.stock && product.stock > 0 ? "text-green-500" : "text-red-500"}>
                {product.stock && product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={!product.stock || product.stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`bg-transparent ${isInWishlist ? 'text-red-500 border-red-500' : ''}`}
                onClick={handleAddToWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid gap-4 rounded-xl border border-border/50 bg-card/50 p-4 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Miễn phí vận chuyển</p>
                  <p className="text-muted-foreground">Đơn từ 500K</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Bảo hành chính hãng</p>
                  <p className="text-muted-foreground">24 tháng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Đổi trả dễ dàng</p>
                  <p className="text-muted-foreground">Trong 30 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="specs">Thông số</TabsTrigger>
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <ProductSpecs specifications={product.specs as Record<string, string>} />
            </TabsContent>

            <TabsContent value="description" className="mt-6">
              <div className="prose prose-invert max-w-none rounded-xl border border-border/50 bg-card/50 p-6">
                <p>{product.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                reviews={reviews}
                productId={product.id}
                averageRating={product.rating || 0}
                totalReviews={product.review_count || 0}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">Sản phẩm liên quan</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct: Product) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
