"use client"

import { useState, useCallback, useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, X, RotateCcw } from "lucide-react"
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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        onFilterChange?.(newFilters)
      }, 150)
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
    }, 200)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priceRange.min !== PRICE_MIN || filters.priceRange.max !== PRICE_MAX) {
      count++
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "priceRange" && Array.isArray(value) && value.length > 0) {
        count += value.length
      }
    })
    return count
  }

  const activeCount = getActiveFilterCount()

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div
        className={cn(
          "sticky top-20 bg-card border border-border rounded-xl p-6 space-y-6 transition-all duration-300",
          isClearing && "scale-[0.98] opacity-80",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Bộ lọc</h2>
            <div
              className={cn(
                "transition-all duration-300",
                activeCount > 0 ? "scale-100 opacity-100" : "scale-0 opacity-0",
              )}
            >
              <Badge variant="secondary" className="bg-primary/20 text-primary tabular-nums">
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
              "h-8 text-xs gap-1.5 transition-all duration-300",
              activeCount > 0 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none",
            )}
          >
            <RotateCcw className={cn("h-3 w-3 transition-transform", isClearing && "animate-spin")} />
            Xóa tất cả
          </Button>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-4 pb-6 border-b border-border">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Khoảng giá</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearFilter("priceRange")}
              className={cn(
                "h-6 w-6 p-0 transition-all duration-200",
                filters.priceRange.min !== PRICE_MIN || filters.priceRange.max !== PRICE_MAX
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0 pointer-events-none",
              )}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Slider
            value={[filters.priceRange.min, filters.priceRange.max]}
            onValueChange={handlePriceChange}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={1000000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span
              className={cn(
                "text-muted-foreground transition-all duration-200 tabular-nums",
                filters.priceRange.min !== PRICE_MIN && "text-primary font-medium",
              )}
            >
              {formatCurrency(filters.priceRange.min)}
            </span>
            <span
              className={cn(
                "text-muted-foreground transition-all duration-200 tabular-nums",
                filters.priceRange.max !== PRICE_MAX && "text-primary font-medium",
              )}
            >
              {formatCurrency(filters.priceRange.max)}
            </span>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-1 custom-scrollbar">
          {FILTER_SECTIONS.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            const sectionKey = section.id as keyof FilterState
            const selectedValues = (filters[sectionKey] as string[]) || []
            const selectedCount = selectedValues.length

            return (
              <div key={section.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full group py-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium cursor-pointer">{section.label}</Label>
                    <div
                      className={cn(
                        "transition-all duration-300",
                        selectedCount > 0 ? "scale-100 opacity-100" : "scale-0 opacity-0",
                      )}
                    >
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-primary/20 text-primary tabular-nums">
                        {selectedCount}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearFilter(sectionKey)
                      }}
                      className={cn(
                        "h-6 w-6 p-0 transition-all duration-200",
                        selectedCount > 0
                          ? "opacity-0 group-hover:opacity-100 scale-100"
                          : "opacity-0 scale-0 pointer-events-none",
                      )}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-300",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {section.options.map((option, index) => {
                        const itemKey = `${section.id}-${option.value}`
                        const isSelected = selectedValues.includes(option.value)
                        const isAnimating = animatingItems.has(itemKey)

                        return (
                          <div
                            key={option.value}
                            className={cn(
                              "flex items-center justify-between group/item rounded-lg px-2 py-2 transition-all duration-200 cursor-pointer",
                              isSelected
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-accent/50 border border-transparent",
                              isAnimating && "scale-[0.98]",
                            )}
                            style={{ animationDelay: `${index * 30}ms` }}
                            onClick={() => handleCheckboxChange(sectionKey, option.value, !isSelected)}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <Checkbox
                                id={itemKey}
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(sectionKey, option.value, checked as boolean)
                                }
                                onClick={(e) => e.stopPropagation()}
                                className={cn(
                                  "border-border transition-all duration-200",
                                  "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                                  isAnimating && "scale-110",
                                )}
                              />
                              <Label
                                htmlFor={itemKey}
                                className={cn(
                                  "text-sm cursor-pointer flex-1 transition-colors duration-200",
                                  isSelected ? "text-foreground font-medium" : "text-muted-foreground",
                                )}
                              >
                                {option.label}
                              </Label>
                            </div>
                            {option.count !== undefined && (
                              <span
                                className={cn(
                                  "text-xs transition-colors duration-200",
                                  isSelected ? "text-primary" : "text-muted-foreground/60",
                                )}
                              >
                                ({option.count})
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

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </aside>
  )
}
