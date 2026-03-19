import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import type { Product, Category } from "@/lib/types"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase.from("products").select("*").eq("is_featured", true).limit(6)

  // Fetch deal products
  const { data: dealProducts } = await supabase.from("products").select("*").eq("is_deal", true).limit(4)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/tech-pattern.jpg')] opacity-10" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
              <Zap className="mr-1 h-3 w-3" />
              Công nghệ mới nhất 2024
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
              Khám phá thế giới công nghệ
              <span className="text-blue-400"> TechNova</span>
            </h1>

            <p className="mb-8 text-pretty text-lg text-blue-100 md:text-xl">
              Laptop, Smartphone và Phụ kiện chính hãng với giá tốt nhất. Giao hàng miễn phí toàn quốc - Bảo hành chu
              đáo.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/products">
                  Mua sắm ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-400/10 bg-transparent"
                asChild
              >
                <Link href="/deals">Xem deal hot</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Danh mục sản phẩm</h2>
            <p className="text-muted-foreground">Khám phá các dòng sản phẩm công nghệ hàng đầu</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories?.map((category: Category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${category.image_url || "/placeholder.svg"})`,
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Products Section */}
      {dealProducts && dealProducts.length > 0 && (
        <section className="bg-gradient-to-br from-blue-950/50 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                  <h2 className="text-3xl font-bold md:text-4xl">Deal sốc hôm nay</h2>
                </div>
                <p className="text-muted-foreground">Giảm giá cực sâu - Số lượng có hạn</p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex bg-transparent">
                <Link href="/deals">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {dealProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/deals">
                  Xem tất cả deal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-3xl font-bold md:text-4xl">Sản phẩm nổi bật</h2>
                </div>
                <p className="text-muted-foreground">Được khách hàng tin tùng và đánh giá cao</p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex bg-transparent">
                <Link href="/products">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/products">
                  Xem tất cả sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="border-t border-border bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Chính hãng 100%</h3>
              <p className="text-sm text-muted-foreground">Cam kết sản phẩm chính hãng, có tem nhập khẩu đầy đủ</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Giao hàng nhanh</h3>
              <p className="text-sm text-muted-foreground">Giao hàng miễn phí toàn quốc trong 1-2 ngày</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Bảo hành tận tâm</h3>
              <p className="text-sm text-muted-foreground">Bảo hành chính hãng, hỗ trợ đổi trả trong 30 ngày</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
