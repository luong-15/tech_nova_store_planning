import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import CategoriesGridClient from "./categories-grid-client";
import { Layers } from "lucide-react";
import type { Category } from "@/lib/types";
import { SectionTitle } from "@/components/animations/section-title";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-transparent">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-125 w-125 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-100 w-100 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-10 lg:py-16">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Danh mục</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── Header ── */}
        <div className="mb-16 text-center animate-in slide-in-from-bottom-4 fade-in duration-700 ease-out">
          <Badge
            variant="secondary"
            className="mb-5 gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Layers className="h-3.5 w-3.5" />
            Bộ Sưu Tập
          </Badge>

          <SectionTitle className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl gradient-text">
            Danh Mục Sản Phẩm
          </SectionTitle>

          <p className="max-w-xl mx-auto text-base text-muted-foreground/80 sm:text-lg leading-relaxed">
            Khám phá các dòng sản phẩm công nghệ hàng đầu được tuyển chọn kĩ
            lưỡng dành riêng cho bạn.
          </p>

        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <CategoriesGridClient categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
