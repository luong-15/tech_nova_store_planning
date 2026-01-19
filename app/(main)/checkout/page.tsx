"use client"

import { useState } from "react"
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
import { ChevronRight, CreditCard, Truck, MapPin, User, Phone, Mail, Package, ArrowLeft } from "lucide-react"
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
  const { items, getSubtotal, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Create order in Supabase
      const supabase = await createClient()

      // Calculate totals
      const subtotal = getSubtotal()
      const shipping = subtotal >= 500000 ? 0 : 30000
      const total = subtotal + shipping

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: null, // Anonymous order for now
          status: "pending",
          payment_status: data.payment_method === "cod" ? "pending" : "pending",
          payment_method: data.payment_method,
          subtotal,
          shipping_fee: shipping,
          tax: 0,
          total,
          shipping_name: data.shipping_name,
          shipping_email: data.shipping_email,
          shipping_phone: data.shipping_phone,
          shipping_address: data.shipping_address,
          shipping_city: data.shipping_city,
          shipping_postal_code: data.shipping_postal_code,
          notes: data.notes,
        })
        .select()
        .single()

      if (orderError) {
        console.error("Order creation error:", orderError)
        toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.")
        return
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) {
        console.error("Order items creation error:", itemsError)
        toast.error("Có lỗi xảy ra khi tạo chi tiết đơn hàng. Vui lòng thử lại.")
        return
      }

      // Clear cart after successful order
      clearCart()

      toast.success("Đặt hàng thành công!")
      router.push("/order-success")
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
                            className="min-h-[80px]"
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
                                  <CreditCard className="h-4 w-4" />
                                  Thanh toán online
                                </label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Thanh toán qua thẻ tín dụng, ví điện tử
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
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
