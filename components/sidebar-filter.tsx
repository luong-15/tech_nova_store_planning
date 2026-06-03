"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, RotateCw, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface FilterSection {
  id: string;
  label: string;
  options: { value: string; label: string; count?: number }[];
}

interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  priceRange: PriceRange;
  brands: string[];
  categories: string[];
  [key: string]: any; // Dành cho các bộ lọc mở rộng sau này
}

interface ApiFilters {
  brands: { value: string; label: string; count: number }[];
  categories: { value: string; label: string; count: number }[];
}

interface SidebarFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  syncUrl?: boolean;
}

const PRICE_MIN = 0;
const PRICE_MAX = 100000000;

export function SidebarFilter({
  onFilterChange,
  initialFilters,
  syncUrl,
}: SidebarFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();

  // 1. Khởi tạo state từ URL hoặc Props
  const urlInitialFilters = useMemo(() => {
    if (!syncUrl) return null;
    const priceMin = Number(urlSearchParams.get("price_min") || PRICE_MIN);
    const priceMax = Number(urlSearchParams.get("price_max") || PRICE_MAX);
    const brands =
      urlSearchParams.get("brand")?.split(",").filter(Boolean) || [];
    return {
      priceRange: { min: priceMin, max: priceMax },
      brands,
      categories: [],
    };
  }, [syncUrl, urlSearchParams]);

  const [dynamicSections, setDynamicSections] = useState<FilterSection[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["brands"]),
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: initialFilters?.priceRange ||
      urlInitialFilters?.priceRange || { min: PRICE_MIN, max: PRICE_MAX },
    brands: initialFilters?.brands || urlInitialFilters?.brands || [],
    categories:
      initialFilters?.categories || urlInitialFilters?.categories || [],
  });

  // 2. Fetch data bộ lọc
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const search = urlSearchParams.get("search") || "";
        const url = `/api/products/filters${search ? `?search=${encodeURIComponent(search)}` : ""}`;
        const response = await fetch(url);
        if (response.ok) {
          const apiData: ApiFilters = await response.json();
          setDynamicSections([
            { id: "brands", label: "Hãng sản xuất", options: apiData.brands },
            {
              id: "categories",
              label: "Danh mục",
              options: apiData.categories,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };
    fetchFilters();
  }, [urlSearchParams]);

  // 3. Xử lý logic thay đổi bộ lọc
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const triggerFilterChange = useCallback(
    (newFilters: FilterState) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFilterChange?.(newFilters);

        if (syncUrl) {
          const params = new URLSearchParams(urlSearchParams.toString());

          // Helper tối ưu URL params
          const updateParam = (
            key: string,
            value: string,
            condition: boolean,
          ) => {
            condition ? params.set(key, value) : params.delete(key);
          };

          updateParam(
            "price_min",
            String(newFilters.priceRange.min),
            newFilters.priceRange.min > PRICE_MIN,
          );
          updateParam(
            "price_max",
            String(newFilters.priceRange.max),
            newFilters.priceRange.max < PRICE_MAX,
          );
          updateParam(
            "brand",
            newFilters.brands.join(","),
            newFilters.brands.length > 0,
          );

          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
      }, 300);
    },
    [onFilterChange, syncUrl, router, pathname, urlSearchParams],
  );

  const handleCheckboxChange = (
    section: keyof FilterState,
    value: string,
    checked: boolean,
  ) => {
    setFilters((prev) => {
      const currentValues = (prev[section] as string[]) || [];
      const newFilters = {
        ...prev,
        [section]: checked
          ? [...currentValues, value]
          : currentValues.filter((v) => v !== value),
      };
      triggerFilterChange(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (values: number[]) => {
    const newFilters = {
      ...filters,
      priceRange: { min: values[0], max: values[1] },
    };
    setFilters(newFilters);
    triggerFilterChange(newFilters);
  };

  const clearFilter = (section: keyof FilterState, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newFilters = { ...filters };
    if (section === "priceRange") {
      newFilters.priceRange = { min: PRICE_MIN, max: PRICE_MAX };
    } else {
      newFilters[section] = [];
    }
    setFilters(newFilters);
    triggerFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setIsClearing(true);
    const resetFilters: FilterState = {
      priceRange: { min: PRICE_MIN, max: PRICE_MAX },
      brands: [],
      categories: [],
    };
    setFilters(resetFilters);
    triggerFilterChange(resetFilters);
    setTimeout(() => setIsClearing(false), 400); // Khớp với thời gian spin
  };

  // 4. Tính toán UI state
  const activeCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === "priceRange") {
      return (
        count + (value.min !== PRICE_MIN || value.max !== PRICE_MAX ? 1 : 0)
      );
    }
    return count + (Array.isArray(value) ? value.length : 0);
  }, 0);

  return (
    <aside className="w-full md:sticky md:top-20 self-start">
      <div
        className={cn(
          "bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-5 md:space-y-7 shadow-xl shadow-black/5 transition-all duration-300",
          "max-h-[85dvh] overflow-y-auto overscroll-contain", 
          isClearing && "opacity-60 pointer-events-none blur-[1px]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 sticky top-0 bg-background/80 md:bg-transparent z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3 md:py-0 md:static">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg md:rounded-xl text-primary">
              <Filter className="w-4 h-4" />
            </div>
            <h2 className="text-base md:text-lg font-bold tracking-tight text-foreground">
              Bộ lọc
            </h2>
            {activeCount > 0 && (
              <Badge className="h-5 w-5 md:h-6 md:w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold p-0 animate-in zoom-in">
                {activeCount}
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className={cn(
              "h-8 px-2 md:px-3 text-xs font-semibold gap-1.5 rounded-lg transition-all hover:bg-destructive/10 hover:text-destructive",
              activeCount === 0 && "opacity-0 pointer-events-none",
            )}
          >
            <RotateCw
              className={cn("h-3.5 w-3.5", isClearing && "animate-spin")}
            />
            <span className="hidden sm:inline">Xóa lọc</span>
          </Button>
        </div>

        {/* Price Slider */}
        <div className="space-y-5 pb-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-foreground">Mức giá</Label>
            {(filters.priceRange.min !== PRICE_MIN ||
              filters.priceRange.max !== PRICE_MAX) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => clearFilter("priceRange", e)}
                className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive animate-in fade-in"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
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
          <div className="flex items-center justify-between gap-3">
            <div
              className={cn(
                "flex-1 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-center transition-colors",
                filters.priceRange.min !== PRICE_MIN &&
                  "border-primary/30 bg-primary/5 text-primary",
              )}
            >
              <span className="text-xs font-bold tabular-nums">
                {formatCurrency(filters.priceRange.min)}
              </span>
            </div>
            <div className="h-px w-3 bg-border/60 shrink-0" />
            <div
              className={cn(
                "flex-1 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-center transition-colors",
                filters.priceRange.max !== PRICE_MAX &&
                  "border-primary/30 bg-primary/5 text-primary",
              )}
            >
              <span className="text-xs font-bold tabular-nums">
                {formatCurrency(filters.priceRange.max)}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Filter Sections */}
        <div
          className={cn("space-y-1")}
        >
          {dynamicSections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const sectionKey = section.id as keyof FilterState;
            const selectedValues = (filters[sectionKey] as string[]) || [];
            const selectedCount = selectedValues.length;

            return (
              <div
                key={section.id}
                className="pl-4 pb-3 border-b border-border/40 last:border-0 last:pb-0"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full group py-3 rounded-xl hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary -mx-2 px-2"
                >
                  <div className="flex items-center gap-2.5 pointer-events-none">
                    <Label className="text-sm font-bold">{section.label}</Label>
                    {selectedCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary font-bold tabular-nums"
                      >
                        {selectedCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedCount > 0 && (
                      <div
                        role="button"
                        onClick={(e) => clearFilter(sectionKey, e)}
                        className="h-6 w-6 rounded-full flex items-center justify-center transition-all hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground/70 transition-transform duration-300",
                        isExpanded && "rotate-180 text-foreground",
                      )}
                    />
                  </div>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300",
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden space-y-1 min-h-0">
                    {section.options.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-2.5 py-2.5 transition-all duration-200 cursor-pointer border active:scale-[0.98]",
                            isSelected
                              ? "bg-primary/5 border-primary/20"
                              : "hover:bg-muted/50 border-transparent",
                          )}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  sectionKey,
                                  option.value,
                                  checked as boolean,
                                )
                              }
                              className="rounded-md transition-all duration-300 data-[state=checked]:bg-primary"
                            />
                            <span
                              className={cn(
                                "text-sm flex-1 transition-colors",
                                isSelected
                                  ? "text-foreground font-semibold"
                                  : "text-muted-foreground",
                              )}
                            >
                              {option.label}
                            </span>
                          </div>
                          {option.count !== undefined && (
                            <span
                              className={cn(
                                "text-xs font-medium tabular-nums px-2 py-0.5 rounded-md",
                                isSelected
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground/50 bg-muted/30",
                              )}
                            >
                              {option.count}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
