"use client"

import { Suspense, useEffect, useState, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { ProductCard } from "@/components/product-card"
import { SidebarFilter, type FilterState } from "@/components/sidebar-filter"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Grid3X3, List, SlidersHorizontal, X, Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 100000000 },
    brands: [],
    ram: [],
    storage: [],
    cpu: [],
    screenSize: [],
    categories: [],
  })

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from("products")
        .select("*")
        .gt("stock", 0)
        .order("created_at", { ascending: false })

      if (data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Debounced filter change handler
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFiltering(true)
    setFilters(newFilters)

    // Simulate filter processing delay for smooth animation
    setTimeout(() => {
      setFiltering(false)
    }, 300)
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      )
    }

    // Apply filters
    if (filters.priceRange.min > 0 || filters.priceRange.max < 100000000) {
      result = result.filter((p) => {
        const price = p.discount_price || p.price
        return price >= filters.priceRange.min && price <= filters.priceRange.max
      })
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand || ""))
    }

    if (filters.ram.length > 0) {
      result = result.filter((p) => {
        const specs = p.specifications as Record<string, string> | null
        return specs?.ram && filters.ram.includes(specs.ram)
      })
    }

    if (filters.storage.length > 0) {
      result = result.filter((p) => {
        const specs = p.specifications as Record<string, string> | null
        return specs?.storage && filters.storage.includes(specs.storage)
      })
    }

    if (filters.cpu.length > 0) {
      result = result.filter((p) => {
        const specs = p.specifications as Record<string, string> | null
        return specs?.cpu && filters.cpu.some((cpu) => specs.cpu.includes(cpu))
      })
    }

    if (filters.screenSize.length > 0) {
      result = result.filter((p) => {
        const specs = p.specifications as Record<string, string> | null
        return specs?.screen && filters.screenSize.some((size) => specs.screen.includes(size))
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price))
        break
      case "price-desc":
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price))
        break
      case "popular":
        result.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0))
        break
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    }

    return result
  }, [products, filters, sortBy, searchQuery])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceRange.min > 0 || filters.priceRange.max < 100000000) count++
    count += filters.brands.length
    count += filters.ram.length
    count += filters.storage.length
    count += filters.cpu.length
    count += filters.screenSize.length
    count += filters.categories.length
    return count
  }, [filters])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="hidden w-64 shrink-0 lg:block">
            <Skeleton className="h-[600px] w-full rounded-xl" />
          </div>
          <div className="flex-1">
            <Skeleton className="mb-6 h-12 w-full rounded-lg" />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden w-64 mr-5 shrink-0 lg:block">
          <SidebarFilter onFilterChange={handleFilterChange} />
        </aside>

        {/* Mobile Filter Drawer */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] animate-in slide-in-from-left">
              <div className="flex h-full flex-col bg-background">
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="font-semibold">Bộ lọc</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileFilter(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <SidebarFilter onFilterChange={handleFilterChange} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="lg:hidden bg-transparent" onClick={() => setShowMobileFilter(true)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {filtering ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang lọc...
                  </span>
                ) : (
                  <>
                    Hiển thị <span className="font-medium text-foreground">{filteredProducts.length}</span> sản phẩm
                  </>
                )}
              </p>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-transparent">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popular">Bán chạy</SelectItem>
                <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                <SelectItem value="price-desc">Giá giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div
              className={`grid gap-6 transition-all duration-300 ${
                viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              } ${filtering ? "opacity-50" : "opacity-100"}`}
            >
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-20">
              <div className="mb-4 rounded-full bg-muted p-4">
                <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Không tìm thấy sản phẩm</h3>
              <p className="text-center text-muted-foreground">Thử điều chỉnh bộ lọc để xem thêm sản phẩm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
