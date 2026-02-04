"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/currency"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Shield, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { cartItems: items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = subtotal >= 500000 ? 0 : 30000
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mb-4 text-2xl font-bold">Giỏ hàng trống</h1>
          <p className="mb-8 text-muted-foreground">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm công nghệ tuyệt vời của chúng tôi!
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              Khám phá sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Giỏ hàng ({getTotalItems()})</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="border-b border-border/50 p-4">
              <h2 className="text-lg font-semibold">Giỏ hàng của bạn ({getTotalItems()} sản phẩm)</h2>
            </div>

            <div className="divide-y divide-border/50">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={item.product.image_url || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium hover:text-primary">
                          <Link href={`/products/${item.product.slug}`}>{item.product.name}</Link>
                        </h3>
                        {item.product.brand && <p className="text-sm text-muted-foreground">{item.product.brand}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-primary">{formatCurrency(item.product.price * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}/sp</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold">Tóm tắt đơn hàng</h2>

              {/* Coupon */}
              <div className="mb-4 flex gap-2">
                <Input placeholder="Mã giảm giá" className="bg-transparent" />
                <Button variant="outline" className="shrink-0 bg-transparent">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className={shipping === 0 ? "text-green-500" : ""}>
                    {shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="rounded-lg bg-primary/10 p-3 text-sm">
                    <p className="text-primary">
                      Mua thêm {formatCurrency(500000 - subtotal)} để được miễn phí vận chuyển!
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min((subtotal / 500000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button className="mt-6 w-full" size="lg" asChild>
                <Link href="/checkout">
                  Tiến hành thanh toán
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Benefits */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Miễn phí vận chuyển đơn từ 500K</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Bảo hành chính hãng 24 tháng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
