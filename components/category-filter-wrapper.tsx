"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SidebarFilter, type FilterState } from "@/components/sidebar-filter";
import { useCallback, useMemo } from "react";

const PRICE_MIN = 0;
const PRICE_MAX = 100000000;

export function CategoryFilterWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialFilters = useMemo(() => {
    const priceMin = Number(searchParams.get("price_min") || PRICE_MIN);
    const priceMax = Number(searchParams.get("price_max") || PRICE_MAX);
    const brands = searchParams.get("brand")?.split(",").filter(Boolean) || [];
    return {
      priceRange: { min: priceMin, max: priceMax },
      brands,
      categories: [],
    };
  }, [searchParams]);

  const handleFilterChange = useCallback(
    (filters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString());

      // Price
      if (filters.priceRange.min > PRICE_MIN) {
        params.set("price_min", String(filters.priceRange.min));
      } else {
        params.delete("price_min");
      }
      if (filters.priceRange.max < PRICE_MAX) {
        params.set("price_max", String(filters.priceRange.max));
      } else {
        params.delete("price_max");
      }

      // Brands
      if (filters.brands.length > 0) {
        params.set("brand", filters.brands.join(","));
      } else {
        params.delete("brand");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <SidebarFilter
      onFilterChange={handleFilterChange}
      initialFilters={initialFilters}
    />
  );
}
