"use client"

import { Suspense, useEffect, useState, useMemo, useCallback, useTransition } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { SidebarFilter, type FilterState } from "@/components/sidebar-filter"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Grid3X3, List, SlidersHorizontal, X, Loader2, PackageSearch } from "lucide-react"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

type ApiPagination = { page: number; limit: number; total: number }

function ProductsPageContent() {
  const searchParamsLocal = useSearchParams()
  const searchQuery = searchParamsLocal.get("search")

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<ApiPagination>({ page: 1, limit: 20, total: 0 })
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 100000000 },
    brands: [],
    // ram: [],
    // storage: [],
    // cpu: [],
    // screenSize: [],
    categories: [],
  })
  const [filtering, setFiltering] = useState(false)

  const handleBackdropDismiss = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e) {
      const keyEvent = e as React.KeyboardEvent
      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
        keyEvent.preventDefault()
        setShowMobileFilter(false)
      }
      return
    }
    setShowMobileFilter(false)
  }

  const fetchProducts = useCallback(async (params = new URLSearchParams()) => {
    setLoading(true)
    const response = await fetch(`/api/products?${params}`)
    if (response.ok) {
      const { data, pagination } = await response.json()
      setProducts(data)
      setPagination(pagination)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    fetchProducts(params)
  }, [searchQuery, fetchProducts])

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFiltering(true)
    setFilters(newFilters)
    setTimeout(() => {
      setFiltering(false)
    }, 400) // Tăng nhẹ thời gian để animation mượt hơn
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      )
    }
    if (filters.priceRange.min > 0 || filters.priceRange.max < 100000000) {
      result = result.filter((p) => {
        const price = p.discount_price || p.price
        return price >= filters.priceRange.min && price <= filters.priceRange.max
      })
    }
    if (filters.brands.length > 0) result = result.filter((p) => filters.brands.includes(p.brand || ""))
    if (filters.categories.length > 0) {
      result = result.filter((p) => {
        const categoryId = p.category_id
        return categoryId != null && filters.categories.includes(String(categoryId))
      })
    }
    // if (filters.ram.length > 0) {
    //   result = result.filter((p) => {
    //     const specs = p.specifications as Record<string, string> | null
    //     return specs?.ram && filters.ram.includes(specs.ram)
    //   })
    // }
    // if (filters.storage.length > 0) {
    //   result = result.filter((p) => {
    //     const specs = p.specifications as Record<string, string> | null
    //     return specs?.storage && filters.storage.includes(specs.storage)
    //   })
    // }
    // if (filters.cpu.length > 0) {
    //   result = result.filter((p) => {
    //     const specs = p.specifications as Record<string, string> | null
    //     return specs?.cpu && filters.cpu.some((cpu) => specs.cpu.includes(cpu))
    //   })
    // }
    // if (filters.screenSize.length > 0) {
    //   result = result.filter((p) => {
    //     const specs = p.specifications as Record<string, string> | null
    //     return specs?.screen && filters.screenSize.some((size) => specs.screen.includes(size))
    //   })
    // }
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price)); break
      case "price-desc": result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price)); break
      case "popular": result.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0)); break
      default: result.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
    }
    return result
  }, [products, filters, sortBy, searchQuery])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceRange.min > 0 || filters.priceRange.max < 100000000) count++
    // count += filters.brands.length + filters.ram.length + filters.storage.length + filters.cpu.length + filters.screenSize.length + filters.categories.length
    count += filters.brands.length + filters.categories.length
    return count
  }, [filters])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-10">
          <div className="hidden w-72 shrink-0 lg:block">
            <Skeleton className="h-200 w-full rounded-2xl" />
          </div>
          <div className="flex-1 space-y-8">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...new Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-105 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden w-72 lg:w-80 2xl:w-96 shrink-0 lg:block">
          <div className="sticky top-28 overflow-hidden rounded-2xl border border-border/40 bg-card/30 p-1 backdrop-blur-sm">
             <SidebarFilter onFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Mobile Filter Drawer - Tinh chỉnh hiệu ứng trượt và backdrop */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300" 
              role="button"
              tabIndex={0}
              onClick={handleBackdropDismiss}
              onKeyDown={handleBackdropDismiss}
              aria-label="Đóng bộ lọc"
            />
            <div className="absolute inset-y-0 left-0 w-[320px] max-w-[85vw] bg-background shadow-2xl animate-in slide-in-from-left duration-500 ease-out border-r border-border/50">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-6 py-5">
                  <h2 className="text-lg font-bold">Bộ lọc sản phẩm</h2>
                  <Button variant="secondary" size="icon" className="rounded-full h-9 w-9" onClick={() => setShowMobileFilter(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                  <SidebarFilter onFilterChange={handleFilterChange} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Header Info (Search Result) */}
          {searchQuery && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                <h1 className="text-2xl font-bold tracking-tight">
                    Kết quả tìm kiếm cho: <span className="text-primary italic">"{searchQuery}"</span>
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">Tìm thấy {filteredProducts.length} sản phẩm phù hợp</p>
            </div>
          )}

          {/* Toolbar - Modernized appearance */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/40 bg-background/50 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                className="lg:hidden rounded-xl font-semibold transition-all active:scale-95" 
                onClick={() => setShowMobileFilter(true)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <div className="hidden items-center gap-1.5 rounded-xl border border-border/50 bg-background/50 p-1.5 sm:flex">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className={cn("h-9 w-9 rounded-lg transition-all", viewMode === "grid" && "shadow-sm")}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className={cn("h-9 w-9 rounded-lg transition-all", viewMode === "list" && "shadow-sm")}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-8 w-px bg-border/40 hidden sm:block" />

              <div className="text-sm font-medium text-muted-foreground">
                {filtering ? (
                  <span className="flex items-center gap-2 px-2 text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </span>
                ) : (
                  <p className="px-2">
                    <span className="text-foreground font-bold">{filteredProducts.length}</span> sản phẩm
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
               <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:block">Sắp xếp:</span>
               <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 rounded-xl bg-background border-border/50 focus:ring-primary/20">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  <SelectItem value="newest" className="rounded-lg">Sản phẩm mới nhất</SelectItem>
                  <SelectItem value="popular" className="rounded-lg">Bán chạy nhất</SelectItem>
                  <SelectItem value="price-asc" className="rounded-lg">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-desc" className="rounded-lg">Giá: Cao đến Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid - Added staggering animation and smoother filtering transition */}
          {filteredProducts.length > 0 ? (
            <div
              className={cn(
                "grid gap-6 transition-opacity duration-500",
                viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                filtering ? "opacity-30 pointer-events-none" : "opacity-100"
              )}
            >
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out-expo"
                  style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State - Modernized with better icon and layout */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/20 py-28 animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-background shadow-inner">
                <PackageSearch className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h3 className="mb-2 text-2xl font-bold tracking-tight">Không tìm thấy sản phẩm</h3>
              <p className="max-w-xs text-center text-muted-foreground/80 leading-relaxed">
                Rất tiếc, chúng tôi không tìm thấy kết quả nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi điều kiện lọc.
              </p>
              <Button 
                variant="link" 
                className="mt-4 text-primary font-bold hover:no-underline"
                onClick={() => window.location.reload()}
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
        <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-4">
             <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
             <p className="text-muted-foreground font-medium animate-pulse">Đang tải danh sách sản phẩm...</p>
        </div>
    }>
      <ProductsPageContent />
    </Suspense>
  )
}
