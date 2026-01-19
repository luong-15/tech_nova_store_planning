import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Grid3X3, List } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/lib/types"

export default async function CategoriesPage() {
  const supabase = await createClient()

  // Fetch all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Danh Mục Sản Phẩm</h1>
        <p className="text-lg text-muted-foreground">Khám phá các dòng sản phẩm công nghệ hàng đầu</p>
      </div>

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: Category) => (
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
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  Xem sản phẩm
                </Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không có danh mục nào</h3>
          <p className="text-muted-foreground">Hãy quay lại sau!</p>
        </div>
      )}
    </div>
  )
}
