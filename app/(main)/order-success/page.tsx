"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/currency'
import { Truck, Package, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

interface OrderItem {
  product_name: string
  product_image: string
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  shipping_fee: number
  total: number
  shipping_name: string
  shipping_email: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  items: OrderItem[]
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-pulse">
              <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <div className="h-10 w-10 bg-muted-foreground/20 rounded-full animate-pulse" />
              </div>
              <div className="h-8 bg-muted mx-auto w-48 mb-4 animate-pulse rounded" />
              <div className="h-6 bg-muted mx-auto w-64 animate-pulse rounded" />
            </div>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-muted w-3/4 rounded" />
                <div className="h-6 bg-muted w-1/2 rounded" />
                <div className="h-6 bg-muted w-2/3 rounded" />
              </div>
              <div className="space-y-2 animate-pulse">
                <div className="h-5 bg-muted w-4/5 rounded" />
                <div className="h-4 bg-muted w-3/4 rounded" />
              </div>
            </div>
          </div>
        </div>
      }>
        <ClientOrderSuccessContent />
      </Suspense>
    </div>
  )
}

function ClientOrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!orderId) {
      router.push('/products')
      return
    }

    fetchOrder()
  }, [orderId, router])

  const fetchOrder = async () => {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_name,
            product_image,
            quantity,
            price
          )
        `)
        .eq('id', orderId)
        .single()

      if (error || !data) {
        toast.error('Không tìm thấy đơn hàng')
        router.push('/products')
        return
      }

      setOrder(data)
    } catch (error) {
      toast.error('Lỗi tải thông tin đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Đang tải...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Không tìm thấy đơn hàng</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
          <p className="text-xl text-muted-foreground mb-2">Mã đơn hàng: <strong>{order.order_number}</strong></p>
          <p className="text-lg text-green-600">Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Chi tiết đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <span>Trạng thái:</span>
                <span className={`font-medium ${order.status === 'processing' ? 'text-green-600' : ''}`}>
                  {order.status === 'pending' ? 'Chờ thanh toán' : order.status === 'processing' ? 'Đã xác nhận' : order.status}
                </span>
                <span>Phương thức thanh toán:</span>
                <span>{order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ tín dụng / Ví điện tử'}</span>
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.subtotal)}</span>
                <span>Phí ship:</span>
                <span>{formatCurrency(order.shipping_fee)}</span>
                <span className="font-semibold text-lg pt-1 col-span-2 border-t">Tổng cộng:</span>
                <span className="font-semibold text-xl text-primary col-span-2">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Giao hàng tới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-semibold">{order.shipping_name}</p>
              <p>{order.shipping_phone}</p>
              <div>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city} - {order.shipping_postal_code}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 relative overflow-hidden rounded-md bg-muted shrink-0">
                      <Image
                        src={item.product_image || '/placeholder.svg'}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tiếp tục mua sắm
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/orders">
              Xem đơn hàng của tôi
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
