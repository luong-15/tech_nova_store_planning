import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Clock, Percent } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/types"

export default async function DealsPage() {
  const supabase = await createClient()

  // Fetch deal products
  const { data: dealProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_deal", true)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <TrendingUp className="h-8 w-8 text-blue-500" />
          <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
            <Percent className="mr-1 h-3 w-3" />
            Deal sốc
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">Deal Sốc Hôm Nay</h1>
        <p className="text-lg text-muted-foreground">Giảm giá cực sâu - Số lượng có hạn - Nhanh tay đặt hàng!</p>
      </div>

      {/* Deal Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Clock className="mx-auto h-8 w-8 text-blue-500 mb-2" />
          <h3 className="font-semibold">Thời gian giới hạn</h3>
          <p className="text-sm text-muted-foreground">Deal chỉ kéo dài trong ngày hôm nay</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Percent className="mx-auto h-8 w-8 text-green-500 mb-2" />
          <h3 className="font-semibold">Giảm đến 50%</h3>
          <p className="text-sm text-muted-foreground">Tiết kiệm hàng triệu đồng</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-orange-500 mb-2" />
          <h3 className="font-semibold">Sản phẩm chất lượng</h3>
          <p className="text-sm text-muted-foreground">Chính hãng, bảo hành đầy đủ</p>
        </div>
      </div>

      {/* Products Grid */}
      {dealProducts && dealProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dealProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không có deal nào hiện tại</h3>
          <p className="text-muted-foreground mb-4">Hãy quay lại sau để không bỏ lỡ các deal hấp dẫn!</p>
          <Button asChild>
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
