import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { SidebarFilter } from "@/components/sidebar-filter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Filter, Grid3X3, List } from "lucide-react"
import type { Product, Category } from "@/lib/types"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    price_min?: string
    price_max?: string
    brand?: string
    in_stock?: string
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const supabase = await createClient()

  // Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (!category) {
    notFound()
  }

  // Build query for products
  let query = supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .eq("is_active", true)

  // Apply filters
  if (searchParams.price_min) {
    query = query.gte("price", parseInt(searchParams.price_min))
  }
  if (searchParams.price_max) {
    query = query.lte("price", parseInt(searchParams.price_max))
  }
  if (searchParams.brand) {
    query = query.eq("brand", searchParams.brand)
  }
  if (searchParams.in_stock === "true") {
    query = query.gt("stock_quantity", 0)
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "name_asc":
      query = query.order("name", { ascending: true })
      break
    case "name_desc":
      query = query.order("name", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query

  // Fetch subcategories if this is a parent category
  const { data: subcategories } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", category.id)
    .order("name")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Trang chủ
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="/categories" className="hover:text-primary">
          Danh mục
        </a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {products?.length || 0} sản phẩm
          </Badge>
        </div>
      </div>

      {/* Subcategories */}
      {subcategories && subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Danh mục con</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcategory: Category) => (
              <Button
                key={subcategory.id}
                variant="outline"
                size="sm"
                asChild
                className="h-auto py-2 px-4"
              >
                <a href={`/categories/${subcategory.slug}`}>
                  {subcategory.name}
                </a>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SidebarFilter categoryId={category.id} />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort and View Options */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Hiển thị {products?.length || 0} sản phẩm
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          {products && products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Filter className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Không tìm thấy sản phẩm</h3>
              <p className="text-muted-foreground">
                Không có sản phẩm nào phù hợp với bộ lọc của bạn.
              </p>
              <Button className="mt-4" variant="outline">
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Load More */}
          {products && products.length >= 12 && (
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Tải thêm sản phẩm
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single()

  if (!category) {
    return {
      title: "Danh mục không tồn tại",
    }
  }

  return {
    title: `${category.name} | TechNova Store`,
    description: category.description || `Khám phá các sản phẩm ${category.name} chất lượng tại TechNova Store`,
  }
}
