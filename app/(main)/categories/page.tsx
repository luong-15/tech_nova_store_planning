import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Grid3X3, List } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/lib/types"
import { SectionTitle } from "@/components/animations/section-title"

export default async function CategoriesPage() {
  const supabase = await createClient()

  // Fetch all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")
  // console.log("Categories page server - Fetched categories count:", categories?.length || 0, categories)

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center text-center animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out">
        <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium">
          Bộ Sưu Tập
        </Badge>
        <SectionTitle className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Danh Mục Sản Phẩm
        </SectionTitle>
        <p className="max-w-2xl text-lg text-muted-foreground/80 sm:text-xl leading-relaxed">
          Khám phá các dòng sản phẩm công nghệ hàng đầu được tuyển chọn kĩ lưỡng dành riêng cho bạn.
        </p>
      </div>

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: Category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3-full overflow-hidden bg-muted/30">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${category.image_url || "/placeholder.svg"})`,
                  }}
                />
                {/* Subtle gradient overlay on hover for better transition */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-background/80" />
              </div>
              
              {/* Content Container */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2">
                  {category.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full rounded-xl transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-active:scale-[0.98]"
                >
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  Xem sản phẩm
                </Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mx-auto flex max-w-105 flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/10 p-12 text-center animate-in fade-in-50 duration-500">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 ring-8 ring-muted/20">
            <List className="h-10 w-10 text-muted-foreground/70" />
          </div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
            Không có danh mục nào
          </h3>
          <p className="text-sm text-muted-foreground/80">
            Các danh mục sản phẩm đang được chúng tôi cập nhật. Hãy quay lại sau nhé!
          </p>
        </div>
      )}
    </div>
  )
}
