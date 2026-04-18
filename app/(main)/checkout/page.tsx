"use client";

import { useState } from "react";
import { useSupabaseSessionContext } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/lib/store/cart-store";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatCurrency } from "@/lib/currency";
import {
  ChevronRight,
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  ArrowLeft,
  Smartphone,
} from "lucide-react";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { notifySuccess, notifyError, notifyInfo } from "@/lib/notifications";

const checkoutSchema = z.object({
  shipping_name: z.string().min(2, "Tên người nhận phải có ít nhất 2 ký tự"),
  shipping_email: z.string().email("Email không hợp lệ"),
  shipping_phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  shipping_address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  shipping_city: z.string().min(2, "Thành phố phải có ít nhất 2 ký tự"),
  shipping_postal_code: z
    .string()
    .min(5, "Mã bưu điện phải có ít nhất 5 ký tự"),
  payment_method: z.enum(["cod", "online"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems: items, getSubtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  // Polling function
  const startPolling = () => {
    if (!qrData?.order_id || isPolling) return;

    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        if (!qrData?.order_id) {
          console.warn('No order_id for polling, stopping');
          clearInterval(interval);
          return;
        }
        console.log('Polling order:', qrData.order_id);
        const statusRes = await fetch(`/api/orders/${qrData.order_id}/status`);
        const statusData = await statusRes.json();

        if (statusData.isPaid) {
          clearCart(); // NOW safe to clear cart after payment confirmed
          clearInterval(interval);
          setIsPolling(false);
          notifySuccess("Thanh toán thành công!");
          router.push(`/order-success?order_id=${qrData.order_id}`); 
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);

    setPollInterval(interval);
  };

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setIsPolling(false);
  };

  // Cleanup on unmount
  // Auto start polling when QR is ready
      useEffect(() => {
        if (qrData && !isPolling) {
          startPolling();
        }
      }, [qrData]);

      // Auto-scroll to QR section
      useEffect(() => {
        if (qrData) {
          setTimeout(() => {
            const qrElement = document.getElementById('qr-section');
            if (qrElement) {
              qrElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      }, [qrData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) stopPolling();
    };
  }, []);

  // Get user session
  const supabase = createClient();
  const sessionContext = useSupabaseSessionContext();
  const { session, isLoading } = sessionContext.data;

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_name: "",
      shipping_email: "",
      shipping_phone: "",
      shipping_address: "",
      shipping_city: "",
      shipping_postal_code: "",
      payment_method: "cod",
      notes: "",
    },
  });

  // Show loading while checking auth + redirect if not logged in
  useEffect(() => {
    if (isLoading) return;

    if (!session?.user) {
      router.push("/auth/login");
      notifyError("Vui lòng đăng nhập để thanh toán");
      return;
    }

    // Pre-fill form with user info
    form.setValue("shipping_email", session.user.email || "");

    // Fetch profile
    supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data: profile }) => {
        if (profile) {
          form.reset(
            {
              shipping_name: profile.full_name || "",
              shipping_email: session.user.email || "",
              shipping_phone: profile.phone || "",
              shipping_city: profile.city || "",
              shipping_address: profile.address || "",
              payment_method: "cod",
              notes: "",
            },
            { keepDefaultValues: true },
          );
        }
      });
  }, [session, isLoading, supabase, form, router]);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutForm) => {
      if (items.length === 0) {
      notifyError("Giỏ hàng trống");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate totals
      const subtotal = getSubtotal();
      const shipping = subtotal >= 500000 ? 0 : 30000;
      const total = subtotal + shipping;

      // Send to /api/orders
      console.log("Creating order for user:", session?.user?.id);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal,
          shipping_fee: shipping,
          total,
          user_id: session?.user?.id,
          shipping_name: data.shipping_name,
          shipping_email: data.shipping_email,
          shipping_phone: data.shipping_phone,
          shipping_address: data.shipping_address,
          shipping_city: data.shipping_city,
          shipping_postal_code: data.shipping_postal_code,
          payment_method: data.payment_method,
          notes: data.notes,
        }),
      });


      const result = await response.json();
      console.log("Order response:", result, "Status:", response.status);

      if (!response.ok || !result.success) {
        console.error("Order API error:", result);
        notifyError(result.error || "Lỗi tạo đơn hàng: " + response.status);
        return;
      }

      // Clear cart ONLY for COD. For online payments, clear after confirmation
      if (data.payment_method === "cod") {
        clearCart();
        notifySuccess("Đặt hàng thành công!");
        router.push(`/order-success?order_id=${result.order_id}`);
        return;
      }

      // VietQR for online payment
      console.log("Creating QR for order:", result.order_id);
      const qrRes = await fetch("/api/vietqr/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: result.order_id,
          total,
        }),
      });

      const qrResult = await qrRes.json();
      console.log("QR response:", qrResult);

      if (!qrRes.ok || !qrResult.success) {
        notifyError(qrResult.error || "Lỗi tạo QR code");
        return;
      }

      setQrData(qrResult);
      notifySuccess("QR code sẵn sàng! Quét để thanh toán.");
      startPolling();
    } catch (error) {
      console.error("Checkout error:", error);
      notifyError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mb-4 text-2xl font-bold">Giỏ hàng trống</h1>
          <p className="mb-8 text-muted-foreground">
            Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Khám phá sản phẩm</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/cart" className="hover:text-primary">
          Giỏ hàng
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Thanh toán</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="shipping_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ và tên" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipping_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Nhập email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="shipping_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập số điện thoại"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipping_postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã bưu điện</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập mã bưu điện" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="shipping_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập địa chỉ chi tiết"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipping_city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thành phố</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập thành phố" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid gap-4"
                          >
                            <div className="flex items-center space-x-3 rounded-lg border p-4">
                              <RadioGroupItem value="cod" id="cod" />
                              <div className="flex-1">
                                <label
                                  htmlFor="cod"
                                  className="flex items-center gap-2 font-medium cursor-pointer"
                                >
                                  <Truck className="h-4 w-4" />
                                  Thanh toán khi nhận hàng (COD)
                                </label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Thanh toán bằng tiền mặt khi nhận hàng
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 rounded-lg border p-4">
                              <RadioGroupItem value="online" id="online" />
                              <div className="flex-1">
                                <label
                                  htmlFor="online"
                                  className="flex items-center gap-2 font-medium cursor-pointer"
                                >
                                  <Smartphone className="h-4 w-4" />
                                  Thanh toán VietQR
                                </label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Quét QR bằng app ngân hàng Vietcombank
                                </p>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Ghi chú đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Ghi chú về đơn hàng (tùy chọn)"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* VietQR Payment */}
              {qrData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Thanh toán VietQR
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div id="qr-section" className="text-center">
                      <div className="mx-auto mb-4 w-fit rounded-xl border-2 border-dashed border-muted p-2">
                        <img
                          src={qrData.qr_url}
                          alt="Mã QR VietQR - Quét để thanh toán"
                          style={{ width: '100%', height: 'auto', maxWidth: '280px' }}
                          className="mx-auto rounded-xl border-4 border-primary shadow-xl"
                          loading="lazy"
                          onLoad={() => console.log('QR loaded successfully')}
                          onError={(e) => {
                            console.error('QR image load failed:', qrData.qr_url);
                            (e.target as any).style.display = 'none';
                            notifyError('Không tải được QR. Kiểm tra mạng!');
                          }}
                        />
                      </div>
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Số tiền:</strong>{" "}
                          {formatCurrency(qrData.amount)}
                        </p>
                        <p>
                          <strong>Số TK:</strong> {qrData.account_no}
                        </p>
                        <p>
                          <strong>Chủ TK:</strong> {qrData.account_name}
                        </p>
                        <p>
                          <strong>Nội dung:</strong> {qrData.order_number}
                        </p>
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground text-center">
                        {qrData.instructions}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={async () => {
                          console.log('QR data:', qrData); // Debug
                          const amountText = formatCurrency(qrData.amount || 0).replace(/[^\d]/g, '');
                          const content = qrData.order_number || 'Thanh toan TechNova';
                          const text = `${amountText} - ${content}`;
                          console.log('Copying text:', text);
                          try {
                            await navigator.clipboard.writeText(text);
                            notifySuccess("✅ Đã copy số tiền & nội dung!");
                          } catch (err) {
                            console.error('Clipboard failed:', err);
                            const fallback = window.prompt('Copy manually:', text);
                            if (fallback !== null) {
                              notifySuccess("✅ Đã copy thành công!");
                            } else {
                              notifyInfo("Đã hủy copy");
                            }
                          }
                        }}
                      >
                        📋 Copy "Số tiền - Nội dung chuyển khoản"
                      </Button>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={async () => {
                          if (!qrData?.order_id) {
                            notifyError('Không có ID đơn hàng để kiểm tra');
                            return;
                          }
                          if (isPolling) return;
                          setIsPolling(true);
                          try {
                            console.log('Manual checking order:', qrData.order_id);
                            const statusRes = await fetch(`/api/orders/${qrData.order_id}/status`);
                            const statusData = await statusRes.json();
                            console.log('Manual check:', statusData);
                            if (statusData.isPaid) {
                              clearCart();
                              notifySuccess("Thanh toán thành công!");
                              router.push(`/order-success?order_id=${qrData.order_id}`);
                            } else {
                              notifyInfo(`Chưa thanh toán (status: ${statusData.status})`);
                            }
                          } catch (error) {
                            console.error('Manual check error:', error);
                            notifyError('Lỗi kiểm tra');
                          } finally {
                            setIsPolling(false);
                          }
                        }}
                        disabled={isPolling}
                      >
                        {isPolling ? "Đang kiểm tra..." : "Kiểm tra thanh toán"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          stopPolling();
                          setQrData(null);
                          notifySuccess('Đã hủy thanh toán QR');
                        }}
                      >
                        Hủy thanh toán
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>

        {/* Enhanced Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Top Summary Card */}
            <Card className="shadow-xl border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Tóm tắt đơn hàng ({items.length} sản phẩm)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                {/* Free Shipping Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vận chuyển miễn phí khi mua từ 500.000₫</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
className="h-full bg-linear-to-r from-primary to-blue-500 rounded-full transition-all duration-500"
                      style={{width: `${Math.min((subtotal / 500000) * 100, 100)}%`}}
                    />
                  </div>
                  {subtotal < 500000 && (
                    <p className="text-xs text-primary font-medium">
                      Thêm {formatCurrency(500000 - subtotal)} để được miễn phí ship
                    </p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phí ship</span>
                    <Badge variant={shipping === 0 ? "default" : "secondary"} className="px-2">
                      {shipping === 0 ? "Miễn phí" : formatCurrency(shipping)}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Tổng thanh toán</span>
                    <span className="text-2xl text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto -mx-4 px-4 pb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="group flex gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-md transition-all bg-card/50">
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted/50">
                      <Image
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {item.product.original_price && (
                        <div className="absolute top-1 left-1 bg-destructive/90 text-destructive-foreground text-xs px-1.5 py-0.5 rounded font-bold">
                          {Math.round(((item.product.original_price - item.product.price) / item.product.original_price) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h4 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {item.product.name}
                        </h4>
                        {item.product.brand && (
                          <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                        )}
                        {item.product.specs && Object.keys(item.product.specs || {}).length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {Object.entries(item.product.specs || {}).slice(0, 2).map(([k, v]) => (
                              <div key={k} className="truncate">{k}: {String(v)}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md">
                          <span className="text-xs font-medium">SL: {item.quantity}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">{formatCurrency(item.product.price * item.quantity)}</div>
                          {item.product.original_price && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatCurrency(item.product.original_price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Shipping Preview */}
            <Card className="border-primary/20">
              <CardContent className="p-4 pt-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mt-0.5 shrink-0">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Giao hàng tới</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
{form.watch("shipping_name") || "Nhập thông tin giao hàng"} 
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {form.watch("shipping_address") || "Địa chỉ giao hàng"} • {form.watch("shipping_city") || "Thành phố"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold shadow-lg"
                size="lg"
                disabled={isSubmitting || !!qrData}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  `🛒 ĐẶT HÀNG (${formatCurrency(total)})`
                )}
              </Button>
              <Button variant="outline" className="w-full h-12" asChild>
                <Link href="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại giỏ hàng
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
