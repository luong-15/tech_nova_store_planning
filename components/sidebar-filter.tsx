"use client"

import { useState, useCallback, useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, X, RotateCw, Filter } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface FilterSection {
  id: string
  label: string
  options: { value: string; label: string; count?: number }[]
}

interface PriceRange {
  min: number
  max: number
}

export interface FilterState {
  priceRange: PriceRange
  brands: string[]
  ram: string[]
  storage: string[]
  cpu: string[]
  screenSize: string[]
  categories: string[]
}

interface SidebarFilterProps {
  onFilterChange?: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
}

const FILTER_SECTIONS: FilterSection[] = [
  {
    id: "brands",
    label: "Hãng sản xuất",
    options: [
      { value: "apple", label: "Apple", count: 24 },
      { value: "samsung", label: "Samsung", count: 18 },
      { value: "dell", label: "Dell", count: 15 },
      { value: "hp", label: "HP", count: 12 },
      { value: "lenovo", label: "Lenovo", count: 10 },
      { value: "asus", label: "Asus", count: 8 },
      { value: "acer", label: "Acer", count: 6 },
    ],
  },
  {
    id: "ram",
    label: "RAM",
    options: [
      { value: "8gb", label: "8GB", count: 32 },
      { value: "16gb", label: "16GB", count: 28 },
      { value: "32gb", label: "32GB", count: 15 },
      { value: "64gb", label: "64GB", count: 8 },
    ],
  },
  {
    id: "storage",
    label: "Bộ nhớ trong",
    options: [
      { value: "256gb", label: "256GB", count: 25 },
      { value: "512gb", label: "512GB", count: 30 },
      { value: "1tb", label: "1TB", count: 20 },
      { value: "2tb", label: "2TB", count: 10 },
    ],
  },
  {
    id: "cpu",
    label: "CPU",
    options: [
      { value: "intel-i5", label: "Intel Core i5", count: 18 },
      { value: "intel-i7", label: "Intel Core i7", count: 22 },
      { value: "intel-i9", label: "Intel Core i9", count: 12 },
      { value: "amd-ryzen5", label: "AMD Ryzen 5", count: 10 },
      { value: "amd-ryzen7", label: "AMD Ryzen 7", count: 14 },
      { value: "m1", label: "Apple M1", count: 8 },
      { value: "m2", label: "Apple M2", count: 10 },
      { value: "m3", label: "Apple M3", count: 6 },
    ],
  },
  {
    id: "screenSize",
    label: "Kích thước màn hình",
    options: [
      { value: "13-14", label: '13" - 14"', count: 20 },
      { value: "15-16", label: '15" - 16"', count: 25 },
      { value: "17-18", label: '17" - 18"', count: 10 },
    ],
  },
  {
    id: "categories",
    label: "Danh mục",
    options: [
      { value: "laptop", label: "Laptop", count: 45 },
      { value: "smartphone", label: "Smartphone", count: 38 },
      { value: "accessories", label: "Phụ kiện", count: 62 },
    ],
  },
]

const PRICE_MIN = 0
const PRICE_MAX = 100000000

export function SidebarFilter({ onFilterChange, initialFilters }: SidebarFilterProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["brands", "ram", "storage"]))
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange || { min: PRICE_MIN, max: PRICE_MAX },
    brands: initialFilters?.brands || [],
    ram: initialFilters?.ram || [],
    storage: initialFilters?.storage || [],
    cpu: initialFilters?.cpu || [],
    screenSize: initialFilters?.screenSize || [],
    categories: initialFilters?.categories || [],
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const triggerFilterChange = useCallback(
    (newFilters: FilterState) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onFilterChange?.(newFilters)
      }, 250) // Tăng slight delay để filter mượt hơn
    },
    [onFilterChange],
  )

  const handleCheckboxChange = (section: keyof FilterState, value: string, checked: boolean) => {
    const itemKey = `${section}-${value}`
    setAnimatingItems((prev) => new Set(prev).add(itemKey))
    setTimeout(() => {
      setAnimatingItems((prev) => {
        const next = new Set(prev)
        next.delete(itemKey)
        return next
      })
    }, 300)

    const newFilters = { ...filters }
    const currentValues = newFilters[section] as string[]

    if (checked) {
      newFilters[section] = [...currentValues, value] as any
    } else {
      newFilters[section] = currentValues.filter((v) => v !== value) as any
    }

    setFilters(newFilters)
    triggerFilterChange(newFilters)
  }

  const handlePriceChange = (values: number[]) => {
    const newFilters = {
      ...filters,
      priceRange: { min: values[0], max: values[1] },
    }
    setFilters(newFilters)
    triggerFilterChange(newFilters)
  }

  const clearFilter = (section: keyof FilterState) => {
    const newFilters = { ...filters }
    if (section === "priceRange") {
      newFilters.priceRange = { min: PRICE_MIN, max: PRICE_MAX }
    } else {
      newFilters[section] = [] as any
    }
    setFilters(newFilters)
    triggerFilterChange(newFilters)
  }

  const [isClearing, setIsClearing] = useState(false)
  const clearAllFilters = () => {
    setIsClearing(true)
    setTimeout(() => {
      const resetFilters: FilterState = {
        priceRange: { min: PRICE_MIN, max: PRICE_MAX },
        brands: [],
        ram: [],
        storage: [],
        cpu: [],
        screenSize: [],
        categories: [],
      }
      setFilters(resetFilters)
      triggerFilterChange(resetFilters)
      setIsClearing(false)
    }, 300)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priceRange.min !== PRICE_MIN || filters.priceRange.max !== PRICE_MAX) count++
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "priceRange" && Array.isArray(value) && value.length > 0) {
        count += value.length
      }
    })
    return count
  }

  const activeCount = getActiveFilterCount()

  // CSS classes cho custom scrollbar dùng Tailwind arbitrary variants
  const scrollbarClasses = "scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/50 transition-colors"

  return (
    <aside className="w-full">
      <div
        className={cn(
          "bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 space-y-7 shadow-2xl shadow-black/5 transition-all duration-500 ease-out",
          isClearing && "scale-[0.98] opacity-50 blur-[2px]",
        )}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Filter className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Bộ lọc</h2>
            <div
              className={cn(
                "transition-all duration-500 ease-out-expo",
                activeCount > 0 ? "scale-100 opacity-100 translate-x-0" : "scale-50 opacity-0 -translate-x-4",
              )}
            >
              <Badge variant="default" className="h-6 w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-sm p-0">
                {activeCount}
              </Badge>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            disabled={activeCount === 0}
            className={cn(
              "h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-lg transition-all duration-300 hover:bg-destructive/10 hover:text-destructive",
              activeCount > 0 ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <RotateCw className={cn("h-3.5 w-3.5 transition-transform duration-500", isClearing && "animate-spin")} />
            Xóa lọc
          </Button>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-5 pb-7 border-b border-border/40">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-foreground">Mức giá</Label>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => clearFilter("priceRange")}
              className={cn(
                "h-6 w-6 rounded-full transition-all duration-300 hover:bg-destructive/10 hover:text-destructive",
                filters.priceRange.min !== PRICE_MIN || filters.priceRange.max !== PRICE_MAX
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-50 pointer-events-none",
              )}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <div className="px-1 pt-2">
            <Slider
              value={[filters.priceRange.min, filters.priceRange.max]}
              onValueChange={handlePriceChange}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={1000000}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className={cn("flex-1 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-center transition-colors", filters.priceRange.min !== PRICE_MIN && "border-primary/30 bg-primary/5 text-primary")}>
              <span className="text-xs font-bold tabular-nums">
                {formatCurrency(filters.priceRange.min)}
              </span>
            </div>
            <div className="h-px w-4 bg-border/60 shrink-0" />
            <div className={cn("flex-1 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-center transition-colors", filters.priceRange.max !== PRICE_MAX && "border-primary/30 bg-primary/5 text-primary")}>
              <span className="text-xs font-bold tabular-nums">
                {formatCurrency(filters.priceRange.max)}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Sections */}
        <div className={cn("space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-2", scrollbarClasses)}>
          {FILTER_SECTIONS.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            const sectionKey = section.id as keyof FilterState
            const selectedValues = (filters[sectionKey] as string[]) || []
            const selectedCount = selectedValues.length

            return (
              <div key={section.id} className="pb-3 border-b border-border/40 last:border-0 last:pb-0">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSection(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleSection(section.id)
                    }
                  }}
                  className="flex items-center justify-between w-full group py-3 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary -mx-2 px-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Label className="text-sm font-bold cursor-pointer">{section.label}</Label>
                    {selectedCount > 0 && (
                       <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary font-bold tabular-nums animate-in zoom-in duration-300">
                         {selectedCount}
                       </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearFilter(sectionKey)
                      }}
                      className={cn(
                        "h-6 w-6 rounded-full transition-all duration-300 hover:bg-destructive/10 hover:text-destructive",
                        selectedCount > 0 ? "opacity-0 group-hover:opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none",
                      )}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground/70 transition-transform duration-500 ease-out-expo",
                        isExpanded && "rotate-180 text-foreground",
                      )}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-out-expo",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-1 pt-1 pb-3">
                      {section.options.map((option, index) => {
                        const itemKey = `${section.id}-${option.value}`
                        const isSelected = selectedValues.includes(option.value)
                        const isAnimating = animatingItems.has(itemKey)

                        return (
                          <div
                            role="button"
                            tabIndex={0}
                            key={option.value}
                            className={cn(
                              "flex items-center justify-between group/item rounded-xl px-2.5 py-2.5 transition-all duration-300 cursor-pointer border",
                              isSelected
                                ? "bg-primary/5 border-primary/20 shadow-sm"
                                : "hover:bg-muted/50 border-transparent",
                              isAnimating && "scale-[0.97] opacity-80",
                            )}
                            style={{ animationDelay: `${index * 20}ms` }}
                            onClick={() => handleCheckboxChange(sectionKey, option.value, !isSelected)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleCheckboxChange(sectionKey, option.value, !isSelected)
                              }
                            }}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <Checkbox
                                id={itemKey}
                                checked={isSelected}
                                onCheckedChange={(checked) => handleCheckboxChange(sectionKey, option.value, checked as boolean)}
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                  "border-muted-foreground/30 transition-all duration-300 shadow-sm rounded-lg",
                                  "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                                  isAnimating && "scale-110",
                                )}
                              />
                              <Label
                                htmlFor={itemKey}
                                className={cn(
                                  "text-sm cursor-pointer flex-1 transition-colors duration-300",
                                  isSelected ? "text-foreground font-semibold" : "text-muted-foreground group-hover/item:text-foreground",
                                )}
                              >
                                {option.label}
                              </Label>
                            </div>
                            
                            {option.count !== undefined && (
                              <span
                                className={cn(
                                  "text-xs font-medium transition-colors duration-300 tabular-nums px-2 py-0.5 rounded-md",
                                  isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground/50 bg-muted/30 group-hover/item:bg-muted/60",
                                )}
                              >
                                {option.count}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}