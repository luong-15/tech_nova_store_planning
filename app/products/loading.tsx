import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex gap-10">
        {/* Sidebar Filter Skeleton */}
        <div className="hidden w-72 shrink-0 lg:block">
          <Skeleton className="h-150 w-full rounded-2xl" />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border border-border/50 p-4"
              >
                <Skeleton className="aspect-4/3 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center gap-2 pt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
