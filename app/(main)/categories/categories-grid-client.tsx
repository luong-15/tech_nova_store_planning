"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";

interface CategoriesGridClientProps {
  categories: Category[] | null;
}

export default function CategoriesGridClient({
  categories,
}: CategoriesGridClientProps) {
  return (
    <>
      {/* View controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm font-medium text-muted-foreground">
          Hiển thị {categories?.length || 0} danh mục
        </div>
      </div>

      {/* ── Grid ── */}
      {categories && categories.length > 0 ? (
        <motion.div
          className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
        >
          {categories.map((category: Category, index: number) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group relative block h-full hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/8 transition-all duration-300 card-hover-entrance"
              >
                <Card className="h-full overflow-hidden border-border/40 hover:border-primary/40 bg-linear-to-br from-card to-muted/20 glass">
                  <div className="relative aspect-video overflow-hidden bg-muted/20">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 img-zoom"
                      style={{
                        backgroundImage: `url(${category.image_url || "/placeholder.svg"})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card/80 via-card/30 to-transparent group-hover:from-card/90" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-2xl">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-4 p-6 pt-0">
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground/90 line-clamp-2">
                      {category.description ||
                        "Khám phá các sản phẩm công nghệ cao cấp trong danh mục này."}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-primary/90 tracking-wide uppercase">
                        Xem tất cả
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-muted/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:shadow-glow group-hover:shadow-primary/20 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-8 rounded-3xl border-2 border-dashed border-border/30 bg-linear-to-br from-muted/20 to-card/30 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
          <Skeleton className="h-24 w-24 mb-8 rounded-2xl bg-muted/50 ring-8 ring-muted/20" />
          <h3 className="mb-2 text-2xl font-bold tracking-tight animate-pulse">
            Đang tải danh mục...
          </h3>
          <p className="text-muted-foreground/80 text-center animate-pulse">
            Các danh mục sẽ xuất hiện ngay khi dữ liệu sẵn sàng.
          </p>
        </div>
      )}
    </>
  );
}
