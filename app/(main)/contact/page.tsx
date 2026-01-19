import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Trang chủ
        </a>
        <span>/</span>
        <span className="text-foreground">Liên hệ</span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Liên hệ với chúng tôi</h1>
        <p className="text-muted-foreground">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ để được tư vấn và giải đáp thắc mắc.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Gửi tin nhắn</CardTitle>
            <CardDescription>
              Điền thông tin và chúng tôi sẽ phản hồi trong vòng 24 giờ.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Họ tên *</label>
                <Input placeholder="Nhập họ tên" />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input type="email" placeholder="Nhập email" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input placeholder="Nhập số điện thoại" />
            </div>
            <div>
              <label className="text-sm font-medium">Chủ đề</label>
              <Input placeholder="Nhập chủ đề" />
            </div>
            <div>
              <label className="text-sm font-medium">Nội dung *</label>
              <Textarea placeholder="Nhập nội dung tin nhắn" rows={5} />
            </div>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Gửi tin nhắn
            </Button>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Hotline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">1900 XXXX</p>
              <p className="text-sm text-muted-foreground">
                Miễn phí cuộc gọi trong giờ hành chính (8:00 - 22:00 hàng ngày)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">support@technova.vn</p>
              <p className="text-sm text-muted-foreground">
                Phản hồi trong vòng 24 giờ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">123 Nguyễn Huệ, Quận 1</p>
              <p className="font-medium">TP. Hồ Chí Minh</p>
              <p className="text-sm text-muted-foreground mt-2">
                Mở cửa: 9:00 - 21:00 hàng ngày
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Giờ làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Thứ 2 - Thứ 6:</span>
                <span className="text-sm font-medium">8:00 - 18:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Thứ 7 - Chủ nhật:</span>
                <span className="text-sm font-medium">9:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Ngày lễ:</span>
                <span className="text-sm font-medium">Đóng cửa</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Tìm đường đến cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[16/9] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Bản đồ sẽ được hiển thị tại đây</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
