"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, RotateCw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */
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
  [key: string]: any;
}

interface ApiFilters {
  brands: { value: string; label: string; count: number }[];
  categories: { value: string; label: string; count: number }[];
}

interface SidebarFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  syncUrl?: boolean;
}

const PRICE_MIN = 0;
const PRICE_MAX = 100000000;
const SHOW_LIMIT = 6;

/* ================= OPTION ITEM ================= */
interface OptionItemProps {
  option: { value: string; label: string; count?: number };
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const OptionItem = React.memo(
  ({ option, checked, onChange }: OptionItemProps) => (
    <label
      className={cn(
        "flex items-center justify-between rounded-xl px-2.5 py-2.5 border cursor-pointer transition",
        checked
          ? "bg-primary/5 border-primary/20"
          : "hover:bg-muted/50 border-transparent",
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <span
          className={cn(
            "text-sm",
            checked ? "font-semibold text-foreground" : "text-muted-foreground",
          )}
        >
          {option.label}
        </span>
      </div>

      {option.count !== undefined && (
        <span className="text-xs tabular-nums px-2 py-0.5 rounded bg-muted/30">
          {option.count}
        </span>
      )}
    </label>
  ),
);

/* ================= FILTER SECTION ================= */
interface FilterSectionUIProps {
  section: FilterSection;
  selectedValues: string[];
  expanded: boolean;
  toggle: (id: string) => void;
  onChange: (value: string, checked: boolean) => void;
  onClear: () => void;
}

function FilterSectionUI({
  section,
  selectedValues,
  expanded,
  toggle,
  onChange,
  onClear,
}: FilterSectionUIProps) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  /* ✅ O(1) lookup */
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const filteredOptions = useMemo(() => {
    const list = section.options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );

    return list.sort(
      (a, b) =>
        Number(selectedSet.has(b.value)) - Number(selectedSet.has(a.value)),
    );
  }, [section.options, search, selectedSet]);

  const visibleOptions = useMemo(
    () => (showAll ? filteredOptions : filteredOptions.slice(0, SHOW_LIMIT)),
    [showAll, filteredOptions],
  );

  /* ✅ dynamic height */
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded, filteredOptions.length, showAll]);

  const handleOptionChange = useCallback(
    (value: string) => (checked: boolean) => onChange(value, checked),
    [onChange],
  );

  return (
    <div className="pb-3 border-b border-border/40 last:border-0">
      {/* header */}
      <button
        onClick={() => toggle(section.id)}
        className="flex items-center justify-between w-full py-3"
      >
        <div className="flex items-center gap-2">
          <Label className="font-bold text-sm">{section.label}</Label>

          {selectedValues.length > 0 && (
            <Badge variant="secondary">{selectedValues.length}</Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {selectedValues.length > 0 && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onClear();
                }
              }}
              className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-destructive/10 cursor-pointer transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </div>
          )}

          <ChevronDown
            className={cn("transition-transform", expanded && "rotate-180")}
          />
        </div>
      </button>

      {/* content */}
      <div
        style={{ maxHeight: height }}
        className={cn(
          "overflow-hidden transition-all duration-300",
          expanded ? "opacity-100" : "opacity-0",
        )}
      >
        <div 
          ref={contentRef}
          className="space-y-2 overflow-y-auto overscroll-contain max-h-[300px] sm:max-h-[400px] pr-2"
        >
          {visibleOptions.map((o) => (
            <OptionItem
              key={o.value}
              option={o}
              checked={selectedSet.has(o.value)}
              onChange={handleOptionChange(o.value)}
            />
          ))}

          {filteredOptions.length > SHOW_LIMIT && (
            <button
              className="text-xs text-primary mt-1"
              onClick={() => setShowAll((p) => !p)}
            >
              {showAll ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
function FilterContent({
  sections,
  filters,
  expanded,
  toggle,
  onCheckbox,
  onReset,
  onSectionClear,
}: {
  sections: FilterSection[];
  filters: FilterState;
  expanded: Set<string>;
  toggle: (id: string) => void;
  onCheckbox: (key: string, value: string, checked: boolean) => void;
  onReset: () => void;
  onSectionClear: (sectionId: string) => void;
}) {
  return (
    <>
      <div className="flex justify-between items-center border-b px-5 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <b>Bộ lọc</b>
        </div>
        <Button
          className="opacity-70 hover:opacity-100 hover:bg-blue-600"
          variant="ghost"
          onClick={onReset}
          title="Xóa tất cả bộ lọc"
        >
          <span className="text-white">Reset</span>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain space-y-4 p-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border/70">
        {sections.map((s) => (
          <FilterSectionUI
            key={s.id}
            section={s}
            expanded={expanded.has(s.id)}
            toggle={toggle}
            selectedValues={filters[s.id] || []}
            onChange={(value: string, checked: boolean) =>
              onCheckbox(s.id, value, checked)
            }
            onClear={() => onSectionClear(s.id)}
          />
        ))}
      </div>
    </>
  );
}

export function SidebarFilter({ onFilterChange }: SidebarFilterProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const trigger = useCallback(
    (newFilters: FilterState) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        onFilterChange?.(newFilters);
      }, 300);
    },
    [onFilterChange],
  );

  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: PRICE_MIN, max: PRICE_MAX },
    brands: [],
    categories: [],
  });

  const [sections, setSections] = useState<FilterSection[]>([]);
  const [expanded, setExpanded] = useState(new Set(["brands"]));

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await fetch("/api/products/filters");
      if (!res.ok) return;

      const data: ApiFilters = await res.json();

      setSections([
        { id: "brands", label: "Hãng sản xuất", options: data.brands },
        { id: "categories", label: "Danh mục", options: data.categories },
      ]);
    };

    fetchFilters();
  }, []);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCheckbox = useCallback(
    (key: string, value: string, checked: boolean) => {
      setFilters((prev) => {
        const list = prev[key] as string[];

        const nextList = checked
          ? [...list, value]
          : list.filter((v) => v !== value);

        const next = { ...prev, [key]: nextList };

        trigger(next);
        return next;
      });
    },
    [trigger],
  );

  const handleReset = useCallback(() => {
    const resetFilters: FilterState = {
      priceRange: { min: PRICE_MIN, max: PRICE_MAX },
      brands: [],
      categories: [],
    };
    setFilters(resetFilters);
    trigger(resetFilters);
  }, [trigger]);

  const handleSectionClear = useCallback(
    (sectionId: string) => {
      setFilters((prev) => {
        const next = { ...prev, [sectionId]: [] };
        trigger(next);
        return next;
      });
    },
    [trigger],
  );

  return (
    <div className="bg-background border rounded-2xl shadow-sm flex flex-col h-full w-full max-h-[calc(100vh-140px)] sm:max-h-none">
      <FilterContent
        sections={sections}
        filters={filters}
        expanded={expanded}
        toggle={toggle}
        onCheckbox={handleCheckbox}
        onReset={handleReset}
        onSectionClear={handleSectionClear}
      />
    </div>
  );
}
