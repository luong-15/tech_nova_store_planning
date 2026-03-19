"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground text-lg">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                <p className="font-medium">#TN-{Date.now().toString().slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p className="font-medium text-green-600">Đã xác nhận</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian đặt</p>
                <p className="font-medium">{new Date().toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phương thức thanh toán</p>
                <p className="font-medium">Thanh toán khi nhận hàng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tiếp theo sẽ xảy ra gì?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium">Xác nhận đơn hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi sẽ xác nhận đơn hàng và kiểm tra kho hàng trong vòng 24 giờ.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium">Chuẩn bị hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Đội ngũ của chúng tôi sẽ chuẩn bị và đóng gói sản phẩm cẩn thận.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium">Giao hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Sản phẩm sẽ được giao đến địa chỉ của bạn trong 2-3 ngày làm việc.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Về trang chủ
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
