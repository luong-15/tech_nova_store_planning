import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/product-gallery"
import { ProductSpecs } from "@/components/product-specs"
import { ProductReviews } from "@/components/product-reviews"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/currency"
import { ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Star, Clock } from "lucide-react"
import Link from "next/link"
import type { Product, Review, UserProfile } from "@/lib/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product
  const { data: product, error } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (error || !product) {
    notFound()
  }

  // Fetch reviews - separate queries to avoid relationship issues
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false })

  // Fetch user profiles for reviews if reviews exist
  let reviews: (Review & { user?: UserProfile | null })[] = []
  if (reviewsData && reviewsData.length > 0) {
    const userIds = [...new Set(reviewsData.map((r) => r.user_id))]
    const { data: profiles } = await supabase.from("user_profiles").select("*").in("id", userIds)

    reviews = reviewsData.map((review) => ({
      ...review,
      user: profiles?.find((p) => p.id === review.user_id) || null,
    }))
  }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)

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
              <Button size="lg" className="flex-1 gap-2" disabled={!product.stock || product.stock <= 0}>
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent">
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
              <ProductSpecs specifications={product.specifications as Record<string, string>} />
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
