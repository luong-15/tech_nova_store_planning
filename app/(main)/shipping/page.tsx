import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Clock, MapPin, Package, CheckCircle, AlertTriangle } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Trang chủ
        </a>
        <span>/</span>
        <span className="text-foreground">Vận chuyển</span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Chính sách vận chuyển</h1>
        <p className="text-muted-foreground">
          TechNova cam kết giao hàng nhanh chóng và an toàn đến tay khách hàng.
        </p>
      </div>

      {/* Shipping Overview */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Dịch vụ vận chuyển TechNova
            </CardTitle>
            <CardDescription>
              Giao hàng tận nơi với nhiều phương thức linh hoạt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="mb-2 font-semibold">Giao hàng nhanh</h4>
                <p className="text-sm text-muted-foreground">
                  1-3 ngày trên toàn quốc
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="mb-2 font-semibold">Bảo hiểm hàng hóa</h4>
                <p className="text-sm text-muted-foreground">
                  100% bảo hiểm vận chuyển
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <MapPin className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="mb-2 font-semibold">Theo dõi đơn hàng</h4>
                <p className="text-sm text-muted-foreground">
                  Tra cứu 24/7
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Methods */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Phương thức vận chuyển</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                Giao hàng tiêu chuẩn
              </CardTitle>
              <CardDescription>Phù hợp cho hầu hết đơn hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Thời gian:</span>
                  <span className="text-sm font-medium">2-3 ngày làm việc</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Phí vận chuyển:</span>
                  <span className="text-sm font-medium">30,000 VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Miễn phí:</span>
                  <span className="text-sm font-medium text-green-600">Đơn ≥ 500K</span>
                </div>
                <div className="mt-4 rounded-lg bg-blue-50 p-3">
                  <p className="text-sm text-blue-800">
                    Mua thêm <strong>200,000 VND</strong> để được miễn phí vận chuyển!
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-200">
                    <div className="h-full w-3/4 bg-blue-500 transition-all"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Giao hàng nhanh
              </CardTitle>
              <CardDescription>Cho đơn hàng gấp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Thời gian:</span>
                  <span className="text-sm font-medium">1 ngày làm việc</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Phí vận chuyển:</span>
                  <span className="text-sm font-medium">50,000 VND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Khả dụng:</span>
                  <span className="text-sm font-medium">TP.HCM & Hà Nội</span>
                </div>
                <div className="mt-4 rounded-lg bg-orange-50 p-3">
                  <p className="text-sm text-orange-800">
                    Giao hàng trong ngày tại nội thành!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery Times */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Thời gian giao hàng</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle className="text-center">TP.HCM</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-primary">1-2 ngày</p>
              <p className="text-sm text-muted-foreground">Giao hàng tận nơi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle className="text-center">Các tỉnh khác</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-primary">2-3 ngày</p>
              <p className="text-sm text-muted-foreground">Giao qua bưu điện</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle className="text-center">Vùng xa</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-primary">3-5 ngày</p>
              <p className="text-sm text-muted-foreground">Các tỉnh miền núi</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shipping Coverage */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Khu vực phục vụ</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Giao hàng toàn quốc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">63 tỉnh thành trên toàn quốc</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Giao đến tận nhà/bưu cục</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Hỗ trợ giao hàng thu tiền (COD)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Bảo hiểm hàng hóa 100%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Dịch vụ đặc biệt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Giao hàng tận nơi tại TP.HCM</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Lắp đặt miễn phí cho sản phẩm lớn</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Kiểm tra hàng trước khi nhận</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Hỗ trợ đổi trả tại nhà</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shipping Costs */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Bảng phí vận chuyển</h2>
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Khu vực</th>
                    <th className="text-center py-2 font-medium">Thời gian</th>
                    <th className="text-center py-2 font-medium">Phí tiêu chuẩn</th>
                    <th className="text-center py-2 font-medium">Phí nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3">TP.HCM (nội thành)</td>
                    <td className="text-center py-3">1-2 giờ</td>
                    <td className="text-center py-3">Miễn phí</td>
                    <td className="text-center py-3">30,000 VND</td>
                  </tr>
                  <tr>
                    <td className="py-3">TP.HCM (ngoại thành)</td>
                    <td className="text-center py-3">2-4 giờ</td>
                    <td className="text-center py-3">20,000 VND</td>
                    <td className="text-center py-3">40,000 VND</td>
                  </tr>
                  <tr>
                    <td className="py-3">Hà Nội</td>
                    <td className="text-center py-3">1-2 ngày</td>
                    <td className="text-center py-3">30,000 VND</td>
                    <td className="text-center py-3">50,000 VND</td>
                  </tr>
                  <tr>
                    <td className="py-3">Các tỉnh miền Bắc</td>
                    <td className="text-center py-3">2-3 ngày</td>
                    <td className="text-center py-3">35,000 VND</td>
                    <td className="text-center py-3">60,000 VND</td>
                  </tr>
                  <tr>
                    <td className="py-3">Các tỉnh miền Trung</td>
                    <td className="text-center py-3">2-3 ngày</td>
                    <td className="text-center py-3">40,000 VND</td>
                    <td className="text-center py-3">70,000 VND</td>
                  </tr>
                  <tr>
                    <td className="py-3">Các tỉnh miền Nam</td>
                    <td className="text-center py-3">1-2 ngày</td>
                    <td className="text-center py-3">30,000 VND</td>
                    <td className="text-center py-3">50,000 VND</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-800">
                <strong>Miễn phí vận chuyển</strong> cho đơn hàng từ 500,000 VND trở lên!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracking & Support */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Theo dõi đơn hàng</CardTitle>
            <CardDescription>
              Tra cứu và theo dõi đơn hàng của bạn mọi lúc mọi nơi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-medium">Cách tra cứu đơn hàng:</h4>
                <div className="space-y-2 text-sm">
                  <p>• Qua email xác nhận đơn hàng</p>
                  <p>• Qua tin nhắn SMS</p>
                  <p>• Qua website với mã đơn hàng</p>
                  <p>• Gọi hotline 1900 XXXX</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Trạng thái đơn hàng:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Đang xử lý</Badge>
                    <span className="text-sm">Đơn hàng đang được chuẩn bị</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Đang giao</Badge>
                    <span className="text-sm">Đơn hàng đang trên đường giao</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Đã giao</Badge>
                    <span className="text-sm">Đơn hàng đã giao thành công</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild>
                <a href="/contact">
                  <Truck className="mr-2 h-4 w-4" />
                  Tra cứu đơn hàng
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <div className="mb-12">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Lưu ý quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• Thời gian giao hàng có thể thay đổi do điều kiện thời tiết hoặc lễ tết</li>
              <li>• Khách hàng cần kiểm tra hàng hóa ngay khi nhận và thông báo nếu có vấn đề</li>
              <li>• TechNova không chịu trách nhiệm về giao hàng trễ do địa chỉ không chính xác</li>
              <li>• Phí vận chuyển có thể thay đổi cho đơn hàng đặc biệt (quá khổ, quá nặng)</li>
              <li>• Giao hàng thu tiền (COD) chỉ áp dụng cho đơn hàng dưới 5 triệu VND</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
