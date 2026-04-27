"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  ShoppingBag,
  CreditCard,
  Loader2,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  notifySuccess,
  notifyInfo,
  notifyError,
  notifyLoading,
} from "@/lib/notifications";
import Image from "next/image";
import Link from "next/link";
import type { Order, OrderItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    icon: Clock,
  },
  processing: {
    label: "Đang xử lý",
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "Đang giao",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-500/10 text-red-600 border-red-200",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );

  const refetchOrders = useCallback(async () => {
    setLoading(true);
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetchOrders();
  }, [refetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    // Logic giữ nguyên như cũ của bạn vì nó xử lý Optimistic Update rất tốt
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return;
    const originalOrder = { ...orders[orderIndex] };
    setCancellingOrderId(orderId);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: "cancelled", payment_status: "cancelled" }
          : o,
      ),
    );

    try {
      notifyLoading("Đang xử lý yêu cầu hủy...");
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Hủy thất bại");
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được hủy",
      });

      refetchOrders();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: (error as Error).message,
        variant: "destructive",
      });

      setOrders((prev) =>
        prev.map((o, i) => (i === orderIndex ? originalOrder : o)),
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);
    if (data) setOrderItems(data as OrderItem[]);
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng của tôi</h1>
        <p className="text-muted-foreground mt-1">
          Lịch sử mua sắm và trạng thái vận chuyển.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 bg-muted/20">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground/50">
            <Package size={40} />
          </div>
          <p className="text-lg font-medium">Bạn chưa có đơn hàng nào</p>
          <Button asChild className="mt-4 rounded-full px-8">
            <Link href="/products">Mua sắm ngay</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status =
              statusConfig[order.status as keyof typeof statusConfig] ||
              statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order.id}
                className="group overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Header Card */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wider uppercase">
                          #{order.order_number}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(order.order_number);
                            notifyInfo("Đã sao chép mã đơn");
                          }}
                          className="p-1 hover:bg-background rounded text-muted-foreground transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {new Date(order.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full font-medium border uppercase text-[10px]",
                            status.color,
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-9 px-4"
                      onClick={() => viewOrderDetails(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Chi tiết
                    </Button>
                    {order.status !== "cancelled" &&
                      order.status !== "delivered" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl h-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (confirm("Hủy đơn hàng này?"))
                              handleCancelOrder(order.id);
                          }}
                          disabled={cancellingOrderId === order.id}
                        >
                          {cancellingOrderId === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Hủy đơn"
                          )}
                        </Button>
                      )}
                  </div>
                </div>

                {/* Body Card */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tổng cộng
                        </p>
                        <p className="text-xl font-bold text-foreground">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Timeline View */}
                    <div className="flex-1 max-w-xs">
                      <div className="relative flex justify-between">
                        {/* Line background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
                        {/* Progress line */}
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000"
                          style={{
                            width:
                              order.status === "delivered"
                                ? "100%"
                                : order.status === "shipped"
                                  ? "66%"
                                  : order.status === "processing"
                                    ? "33%"
                                    : "0%",
                            opacity: order.status === "cancelled" ? 0 : 1,
                          }}
                        />

                        {["pending", "processing", "shipped", "delivered"].map(
                          (step) => (
                            <div
                              key={step}
                              className={cn(
                                "relative z-10 h-3 w-3 rounded-full border-2 bg-background transition-colors duration-500",
                                order.status === step ||
                                  order.status === "delivered"
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30",
                              )}
                            />
                          ),
                        )}
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                          Đặt hàng
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                          Đã giao
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
          <div className="bg-primary p-6 text-primary-foreground">
            <DialogTitle className="text-xl">
              Đơn hàng #{selectedOrder?.order_number}
            </DialogTitle>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Cảm ơn bạn đã tin dùng TechNova
            </p>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Products */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                <Package size={16} /> Sản phẩm
              </h4>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center bg-muted/30 p-3 rounded-2xl"
                  >
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-background border">
                      <Image
                        src={item.product_image || "/placeholder.svg"}
                        alt={item.product_name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                  <MapPin size={16} /> Giao hàng
                </h4>
                <div className="text-sm space-y-1 bg-muted/30 p-4 rounded-2xl">
                  <p className="font-bold">{selectedOrder?.shipping_name}</p>
                  <p className="text-muted-foreground">
                    {selectedOrder?.shipping_phone}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedOrder?.shipping_address},{" "}
                    {selectedOrder?.shipping_city}
                  </p>
                </div>
              </div>

              {/* Total Summary */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                  <CreditCard size={16} /> Thanh toán
                </h4>
                <div className="bg-muted/30 p-4 rounded-2xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(selectedOrder?.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí ship</span>
                    <span>
                      {formatCurrency(selectedOrder?.shipping_fee || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg text-primary">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(selectedOrder?.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
