import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, RefreshCw, Shield, Package } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Trang chủ
        </a>
        <span>/</span>
        <span className="text-foreground">Đổi trả hàng</span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Chính sách đổi trả</h1>
        <p className="text-muted-foreground">
          TechNova hỗ trợ đổi trả sản phẩm dễ dàng với chính sách linh hoạt và minh bạch.
        </p>
      </div>

      {/* Return Overview */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 text-primary" />
              Chính sách đổi trả TechNova
            </CardTitle>
            <CardDescription>
              Cam kết đổi trả trong vòng 30 ngày với nhiều phương thức linh hoạt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="mb-2 font-semibold">30 ngày đổi trả</h4>
                <p className="text-sm text-muted-foreground">
                  Thời hạn đổi trả thoải mái
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="mb-2 font-semibold">Miễn phí đổi trả</h4>
                <p className="text-sm text-muted-foreground">
                  Lỗi do nhà sản xuất
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="mb-2 font-semibold">Hỗ trợ tận tình</h4>
                <p className="text-sm text-muted-foreground">
                  Tư vấn 24/7
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Return Conditions */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Điều kiện đổi trả</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Được đổi trả</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Sản phẩm còn trong thời hạn 30 ngày</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Sản phẩm còn nguyên vẹn, đầy đủ phụ kiện</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Có hóa đơn mua hàng và phiếu bảo hành</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Sản phẩm chưa qua sử dụng hoặc can thiệp sửa chữa</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Không được đổi trả</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Quá thời hạn 30 ngày</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Sản phẩm đã qua sử dụng hoặc hư hỏng</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Thiếu hóa đơn hoặc phiếu bảo hành</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Sản phẩm thuộc danh mục không đổi trả</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Process */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Quy trình đổi trả</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-bold">1</span>
              </div>
              <CardTitle className="text-center">Liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Gọi hotline hoặc gửi email để được hướng dẫn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-bold">2</span>
              </div>
              <CardTitle className="text-center">Đóng gói</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Đóng gói sản phẩm cẩn thận theo hướng dẫn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-bold">3</span>
              </div>
              <CardTitle className="text-center">Gửi hàng</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Gửi sản phẩm về kho hoặc mang đến cửa hàng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-bold">4</span>
              </div>
              <CardTitle className="text-center">Hoàn thành</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Nhận sản phẩm mới hoặc hoàn tiền
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Types */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Các loại đổi trả</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-blue-500" />
                Đổi sản phẩm mới
              </CardTitle>
              <CardDescription>Lỗi kỹ thuật do nhà sản xuất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Áp dụng cho sản phẩm lỗi kỹ thuật trong vòng 7 ngày đầu tiên
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Miễn phí vận chuyển đổi trả</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Bảo hành thêm 6 tháng cho sản phẩm mới</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Hoàn tiền 100% nếu không có sản phẩm thay thế</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Đổi size/màu sắc
              </CardTitle>
              <CardDescription>Cho phụ kiện và thời trang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Áp dụng cho phụ kiện trong vòng 7 ngày, cùng model
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Phí đổi trả: 50,000 VND/lần</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Sản phẩm chưa qua sử dụng</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Không áp dụng cho sản phẩm giảm giá</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Support */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Hỗ trợ đổi trả</CardTitle>
            <CardDescription>
              Liên hệ với chúng tôi để được hỗ trợ nhanh nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Hotline đổi trả</h4>
                  <p className="text-2xl font-bold text-primary">1900 XXXX</p>
                  <p className="text-sm text-muted-foreground">8:00 - 22:00 hàng ngày</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Email hỗ trợ</h4>
                  <p className="font-medium">returns@technova.vn</p>
                  <p className="text-sm text-muted-foreground">Phản hồi trong 24 giờ</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild>
                <a href="/contact">
                  <Package className="mr-2 h-4 w-4" />
                  Liên hệ ngay
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
              <li>• Sản phẩm đổi trả phải còn nguyên tem mác, hộp đựng và phụ kiện đi kèm</li>
              <li>• Khách hàng chịu phí vận chuyển đổi trả cho các trường hợp không phải lỗi kỹ thuật</li>
              <li>• Thời gian xử lý đổi trả: 3-5 ngày làm việc sau khi nhận được hàng</li>
              <li>• Sản phẩm giảm giá, sale off có thể không được đổi trả hoặc áp dụng chính sách riêng</li>
              <li>• TechNova có quyền từ chối đổi trả nếu phát hiện sản phẩm đã qua sử dụng hoặc can thiệp</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
