"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Package, Truck, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = subtotal > 2000000 ? 0 : 50000
  const total = subtotal + shipping

  const freeShippingThreshold = 2000000
  const progressPercentage = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const amountToFreeShipping = freeShippingThreshold - subtotal

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col border-l border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-lg p-[15px]">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Giỏ hàng
            <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary transition-all duration-300">
              {getTotalItems()} sản phẩm
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                <ShoppingBag className="h-14 w-14 text-primary/50" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl">🛒</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">Giỏ hàng trống</h3>
              <p className="mt-2 max-w-[250px] text-sm text-muted-foreground">
                Hãy khám phá các sản phẩm công nghệ tuyệt vời và thêm vào giỏ hàng!
              </p>
            </div>
            <Button asChild onClick={closeCart} size="lg" className="mt-2 gap-2">
              <Link href="/products">
                Khám phá sản phẩm
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border/50 pb-4">
              {subtotal < freeShippingThreshold ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      Mua thêm{" "}
                      <span className="font-semibold text-primary">{formatCurrency(amountToFreeShipping)}</span> để được
                      miễn phí ship
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-500">
                  <Truck className="h-4 w-4" />
                  <span>Bạn đã được miễn phí vận chuyển!</span>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item, index) => (
                  <div
                    key={item.product.id}
                    className="group relative flex gap-4 rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted/50">
                      <Image
                        src={item.product.image_url || "/placeholder.svg?height=80&width=80&query=tech product"}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {item.product.original_price && item.product.original_price > item.product.price && (
                        <div className="absolute left-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          -{Math.round((1 - item.product.price / item.product.original_price) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="line-clamp-2 text-sm font-medium leading-tight transition-colors group-hover:text-primary">
                          {item.product.name}
                        </h4>
                        {item.product.brand && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.product.brand}</p>
                        )}
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary">{formatCurrency(item.product.price)}</span>
                          {item.product.original_price && item.product.original_price > item.product.price && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(item.product.original_price)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:bg-background"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md hover:bg-background"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-destructive/10 opacity-0 shadow-sm transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border/50 pt-4">
              {/* Benefits */}
              <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Đóng gói cẩn thận</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Giao hàng nhanh</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/30 p-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Thanh toán an toàn</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính ({getTotalItems()} sản phẩm)</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className={shipping === 0 ? "font-medium text-green-500" : "font-medium"}>
                    {shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
                  </span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-lg text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button asChild className="w-full gap-2" size="lg" onClick={closeCart}>
                  <Link href="/checkout">
                    <CreditCard className="h-4 w-4" />
                    Thanh toán ngay
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent" onClick={closeCart}>
                  <Link href="/cart">Xem chi tiết giỏ hàng</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
