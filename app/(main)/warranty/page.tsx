import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Shield, CheckCircle, AlertTriangle, Clock } from "lucide-react"

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Trang chủ
        </a>
        <span>/</span>
        <span className="text-foreground">Chính sách bảo hành</span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Chính sách bảo hành</h1>
        <p className="text-muted-foreground">
          TechNova cam kết bảo hành chính hãng với dịch vụ chuyên nghiệp và tận tâm.
        </p>
      </div>

      {/* Warranty Overview */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Chính sách bảo hành TechNova
            </CardTitle>
            <CardDescription>
              Áp dụng cho tất cả sản phẩm mua tại TechNova Store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Bảo hành chính hãng</h4>
                  <p className="text-sm text-muted-foreground">
                    Bảo hành theo tiêu chuẩn của nhà sản xuất với thời hạn 12-24 tháng
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Hỗ trợ kỹ thuật 24/7</h4>
                  <p className="text-sm text-muted-foreground">
                    Đội ngũ kỹ thuật chuyên nghiệp sẵn sàng hỗ trợ mọi lúc
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Bảo hành tận nơi</h4>
                  <p className="text-sm text-muted-foreground">
                    Miễn phí bảo hành tận nơi cho sản phẩm lớn tại TP.HCM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Đổi mới 100%</h4>
                  <p className="text-sm text-muted-foreground">
                    Đổi sản phẩm mới nếu lỗi do nhà sản xuất trong 7 ngày đầu
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warranty Conditions */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Điều kiện bảo hành</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Được bảo hành</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Lỗi kỹ thuật do nhà sản xuất</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Sản phẩm còn trong thời hạn bảo hành</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Có tem bảo hành và hóa đơn mua hàng</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span className="text-sm">Sản phẩm chưa bị can thiệp sửa chữa</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Không được bảo hành</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Hư hỏng do sử dụng sai cách</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Quá thời hạn bảo hành</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Thiếu tem bảo hành hoặc hóa đơn</span>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-sm">Đã tự ý sửa chữa hoặc can thiệp</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warranty Process */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Quy trình bảo hành</h2>
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
              <CardTitle className="text-center">Kiểm tra</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Đưa sản phẩm đến cửa hàng hoặc kỹ thuật viên đến tận nơi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-bold">3</span>
              </div>
              <CardTitle className="text-center">Sửa chữa</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Tiến hành sửa chữa hoặc thay thế linh kiện
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
                Trả sản phẩm và hướng dẫn sử dụng
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warranty Support */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Hỗ trợ bảo hành</CardTitle>
            <CardDescription>
              Liên hệ với chúng tôi để được hỗ trợ nhanh nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Hotline bảo hành</h4>
                  <p className="text-2xl font-bold text-primary">1900 XXXX</p>
                  <p className="text-sm text-muted-foreground">24/7 - Miễn phí cuộc gọi</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Email hỗ trợ</h4>
                  <p className="font-medium">warranty@technova.vn</p>
                  <p className="text-sm text-muted-foreground">Phản hồi trong 24 giờ</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild>
                <a href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Liên hệ ngay
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warranty Centers */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Trung tâm bảo hành</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>TechNova TP.HCM</CardTitle>
              <CardDescription>Trung tâm chính</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">📍 123 Nguyễn Huệ, Quận 1, TP.HCM</p>
                <p className="text-sm">🕒 8:00 - 18:00 (Thứ 2 - Thứ 6)</p>
                <p className="text-sm">📞 1900 XXXX</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TechNova Hà Nội</CardTitle>
              <CardDescription>Chi nhánh miền Bắc</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">📍 456 Trần Duy Hưng, Cầu Giấy, Hà Nội</p>
                <p className="text-sm">🕒 8:00 - 17:00 (Thứ 2 - Thứ 6)</p>
                <p className="text-sm">📞 1900 XXXX</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
