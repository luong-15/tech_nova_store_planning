"use client"

import { useState } from "react"
import { useSupabaseSessionContext } from "@/hooks/use-session"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCartStore } from "@/lib/store/cart-store"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { formatCurrency } from "@/lib/currency"
import { ChevronRight, CreditCard, Truck, MapPin, User, Phone, Mail, Package, ArrowLeft, Smartphone } from "lucide-react"
import React, { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

const checkoutSchema = z.object({
  shipping_name: z.string().min(2, "Tên người nhận phải có ít nhất 2 ký tự"),
  shipping_email: z.string().email("Email không hợp lệ"),
  shipping_phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  shipping_address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  shipping_city: z.string().min(2, "Thành phố phải có ít nhất 2 ký tự"),
  shipping_postal_code: z.string().min(5, "Mã bưu điện phải có ít nhất 5 ký tự"),
  payment_method: z.enum(["cod", "online"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  notes: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems: items, getSubtotal, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [qrData, setQrData] = useState<any>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)

  // Polling function
  const startPolling = () => {
    if (!qrData?.order_id || isPolling) return

    setIsPolling(true)
    const interval = setInterval(async () => {
      try {
        const statusRes = await fetch(`/api/orders/${qrData.order_id}/status`)
        const statusData = await statusRes.json()

        if (statusData.isPaid) {
          clearInterval(interval)
          setIsPolling(false)
          toast.success("Thanh toán thành công!")
          router.push(`/order-success?order_id=${qrData.order_id}`)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 5000)

    setPollInterval(interval)
  }

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval)
      setPollInterval(null)
    }
    setIsPolling(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) stopPolling()
    }
  }, [])

  // Get user session
  const supabase = createClient()
  const sessionContext = useSupabaseSessionContext()
  const session = sessionContext.data.session
  
  useEffect(() => {
    if (session?.user) {
      // Pre-fill form with user info
      form.setValue('shipping_email', session.user.email || '')
      
      // Fetch profile
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile) {
            form.reset({
              shipping_name: profile.full_name || '',
              shipping_email: session.user.email || '',
              shipping_phone: profile.phone || '',
              shipping_city: profile.city || '',
              shipping_address: profile.address || '',
              payment_method: "cod",
              notes: "",
            }, { keepDefaultValues: true })
          }
        })
    } else {
      router.push('/auth/login')
      toast.error('Vui lòng đăng nhập để thanh toán')
    }
  }, [session])

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_name: session?.user_metadata?.full_name || "",
      shipping_email: session?.user?.email || "",
      shipping_phone: "",
      shipping_address: "",
      shipping_city: "",
      shipping_postal_code: "",
      payment_method: "cod",
      notes: "",
    },
  })


  const subtotal = getSubtotal()
  const shipping = subtotal >= 500000 ? 0 : 30000
  const total = subtotal + shipping

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error("Giỏ hàng trống")
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate totals
      const subtotal = getSubtotal()
      const shipping = subtotal >= 500000 ? 0 : 30000
      const total = subtotal + shipping

      // Send to /api/orders
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          subtotal,
          shipping_fee: shipping,
          total,
          shipping_name: data.shipping_name,
          shipping_email: data.shipping_email,
          shipping_phone: data.shipping_phone,
          shipping_address: data.shipping_address,
          shipping_city: data.shipping_city,
          shipping_postal_code: data.shipping_postal_code,
          payment_method: data.payment_method,
          notes: data.notes,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.")
        return
      }

      clearCart()

      if (data.payment_method === 'cod') {
        toast.success("Đặt hàng thành công!")
        router.push(`/order-success?order_id=${result.order_id}`)
        return
      }

      // VietQR for online payment
      const qrRes = await fetch('/api/vietqr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: result.order_id,
          total,
        }),
      })

      const qrResult = await qrRes.json()

      if (!qrRes.ok || !qrResult.success) {
        toast.error(qrResult.error || "Lỗi tạo QR")
        return
      }

      setQrData(qrResult)
      toast.info("Đã tạo đơn hàng! Quét QR để thanh toán.")



    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <Link href="/products">
              Khám phá sản phẩm
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
                            <Input type="email" placeholder="Nhập email" {...field} />
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
                            <Input placeholder="Nhập số điện thoại" {...field} />
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
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-48 w-48 rounded-xl border-2 border-dashed border-muted p-2">
                        <Image
                          src={qrData.qr_url}
                          alt="VietQR Code"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg"
                        />
                      </div>
                      <div className="text-sm space-y-1">
                        <p><strong>Số tiền:</strong> {formatCurrency(qrData.amount)}</p>
                        <p><strong>Số TK:</strong> {qrData.account_no}</p>
                        <p><strong>Chủ TK:</strong> {qrData.account_name}</p>
                        <p><strong>Nội dung:</strong> {qrData.order_number}</p>
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground text-center">
                        {qrData.instructions}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1" 
                        onClick={startPolling}
                        disabled={isPolling}
                      >
                        {isPolling ? "Đang kiểm tra..." : "Kiểm tra thanh toán"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={stopPolling}
                      >
                        Hủy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>

          </Form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
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
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/cart">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại giỏ hàng
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
