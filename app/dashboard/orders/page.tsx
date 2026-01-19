"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Eye, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import Image from "next/image"
import Link from "next/link"
import type { Order, OrderItem } from "@/lib/types"

const statusConfig = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
  processing: { label: "Đang xử lý", color: "bg-blue-500/10 text-blue-500", icon: Package },
  shipped: { label: "Đang giao", color: "bg-purple-500/10 text-purple-500", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-500/10 text-green-500", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-500/10 text-red-500", icon: XCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (data) {
          setOrders(data as Order[])
        }
      }
      setLoading(false)
    }

    fetchOrders()
  }, [])

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order)
    const supabase = createBrowserClient()
    const { data } = await supabase.from("order_items").select("*").eq("order_id", order.id)

    if (data) {
      setOrderItems(data as OrderItem[])
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
        <p className="text-muted-foreground">Theo dõi và quản lý đơn hàng</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card/50 py-16 backdrop-blur-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
            <Package className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Chưa có đơn hàng</h3>
          <p className="mt-1 text-sm text-muted-foreground">Bắt đầu mua sắm để có đơn hàng đầu tiên!</p>
          <Button asChild className="mt-4">
            <Link href="/products">Khám phá sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <div
                key={order.id}
                className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30"
                style={{ animation: `fadeIn 0.3s ease-out ${index * 0.05}s both` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">#{order.order_number}</h3>
                      <Badge className={status.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Đặt ngày {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => viewOrderDetails(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Chi tiết
                    </Button>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="mt-4 flex items-center gap-2 overflow-x-auto pt-4 border-t border-border/50">
                  {(["pending", "processing", "shipped", "delivered"] as const).map((step, i) => {
                    const stepStatus = statusConfig[step]
                    const StepIcon = stepStatus.icon
                    const isActive =
                      order.status === step ||
                      ["pending", "processing", "shipped", "delivered"].indexOf(order.status) >=
                        ["pending", "processing", "shipped", "delivered"].indexOf(step)
                    const isCancelled = order.status === "cancelled"

                    return (
                      <div key={step} className="flex items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isCancelled
                              ? "bg-muted text-muted-foreground"
                              : isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <StepIcon className="h-4 w-4" />
                        </div>
                        {i < 3 && (
                          <div className={`h-0.5 w-8 ${isActive && !isCancelled ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-medium">Sản phẩm</h4>
                <div className="divide-y divide-border/50 rounded-lg border border-border/50">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted/50">
                        <Image
                          src={item.product_image || "/placeholder.svg?height=64&width=64&query=tech product"}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3">
                <h4 className="font-medium">Địa chỉ giao hàng</h4>
                <div className="rounded-lg border border-border/50 p-4 text-sm">
                  <p className="font-medium">{selectedOrder.shipping_name}</p>
                  <p className="text-muted-foreground">{selectedOrder.shipping_phone}</p>
                  <p className="text-muted-foreground">
                    {selectedOrder.shipping_address}, {selectedOrder.shipping_city}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 rounded-lg border border-border/50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{formatCurrency(selectedOrder.shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thuế</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-2 font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
