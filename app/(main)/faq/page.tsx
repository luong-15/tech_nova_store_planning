import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Phone, Mail, MessageCircle } from "lucide-react"

const faqs = [
  {
    question: "TechNova có phải là cửa hàng chính hãng không?",
    answer: "Có, TechNova là đại lý ủy quyền chính thức của các thương hiệu công nghệ hàng đầu như Apple, Samsung, Dell, HP, Lenovo, ASUS. Tất cả sản phẩm đều có nguồn gốc rõ ràng, tem nhập khẩu đầy đủ và được bảo hành chính hãng."
  },
  {
    question: "Thời gian bảo hành sản phẩm là bao lâu?",
    answer: "Thời gian bảo hành tùy thuộc vào từng sản phẩm và nhà sản xuất: Laptop thường 12-24 tháng, Smartphone 12-18 tháng, Phụ kiện 6-12 tháng. Chi tiết thời gian bảo hành sẽ được ghi rõ trong phiếu bảo hành đi kèm sản phẩm."
  },
  {
    question: "TechNova có giao hàng tận nơi không?",
    answer: "Có, TechNova giao hàng tận nơi trên toàn quốc. Thời gian giao hàng: TP.HCM 1-2 ngày, các tỉnh khác 2-3 ngày. Phí vận chuyển từ 30,000 VND, miễn phí cho đơn hàng từ 500,000 VND trở lên."
  },
  {
    question: "Tôi có thể thanh toán như thế nào?",
    answer: "TechNova hỗ trợ nhiều phương thức thanh toán: Tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay, ViettelPay), thẻ tín dụng/ghi nợ, trả góp qua công ty tài chính."
  },
  {
    question: "Chính sách đổi trả sản phẩm như thế nào?",
    answer: "TechNova hỗ trợ đổi trả trong vòng 30 ngày với sản phẩm còn nguyên vẹn, đầy đủ phụ kiện và có hóa đơn. Đổi trả miễn phí cho lỗi kỹ thuật, phí đổi trả 50,000 VND cho đổi size/màu sắc phụ kiện."
  },
  {
    question: "Làm sao để theo dõi đơn hàng?",
    answer: "Bạn có thể theo dõi đơn hàng qua: Email xác nhận, tin nhắn SMS, gọi hotline 1900 XXXX, hoặc tra cứu trực tuyến trên website với mã đơn hàng."
  },
  {
    question: "TechNova có hỗ trợ lắp đặt sản phẩm không?",
    answer: "Có, TechNova hỗ trợ lắp đặt miễn phí cho các sản phẩm lớn như máy tính để bàn, màn hình tại TP.HCM. Đối với các sản phẩm khác, chúng tôi sẽ hướng dẫn sử dụng chi tiết."
  },
  {
    question: "Tôi có thể mua trả góp không?",
    answer: "Có, TechNova hợp tác với các công ty tài chính uy tín như Home Credit, FE Credit, TPBank để hỗ trợ mua trả góp với lãi suất 0% cho một số sản phẩm. Thủ tục đơn giản, chỉ cần CMND/CCCD."
  },
  {
    question: "TechNova có chương trình khuyến mãi gì?",
    answer: "TechNova thường xuyên có các chương trình khuyến mãi: Giảm giá theo mùa, giảm giá cho sinh viên, giảm giá khi mua số lượng lớn, tặng phụ kiện, bảo hành mở rộng. Theo dõi website và fanpage để cập nhật chương trình mới nhất."
  },
  {
    question: "Làm sao để liên hệ khi cần hỗ trợ?",
    answer: "Bạn có thể liên hệ TechNova qua: Hotline 1900 XXXX (8:00-22:00 hàng ngày), Email support@technova.vn, Fanpage Facebook, hoặc đến trực tiếp cửa hàng tại 123 Nguyễn Huệ, Quận 1, TP.HCM."
  }
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Trang chủ
        </a>
        <span>/</span>
        <span className="text-foreground">Câu hỏi thường gặp</span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Câu hỏi thường gặp</h1>
        <p className="text-muted-foreground">
          Tìm câu trả lời cho những câu hỏi phổ biến về sản phẩm và dịch vụ của TechNova.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              Các câu hỏi phổ biến
            </CardTitle>
            <CardDescription>
              Nhấp vào câu hỏi để xem câu trả lời chi tiết
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Quick Help */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Cần hỗ trợ thêm?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Hotline</CardTitle>
              <CardDescription>Gọi ngay để được tư vấn</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-2">1900 XXXX</p>
              <p className="text-sm text-muted-foreground mb-4">
                8:00 - 22:00 hàng ngày
              </p>
              <Button className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Gọi ngay
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg">Email</CardTitle>
              <CardDescription>Gửi email cho chúng tôi</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-2">support@technova.vn</p>
              <p className="text-sm text-muted-foreground mb-4">
                Phản hồi trong 24 giờ
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Gửi email
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Live Chat</CardTitle>
              <CardDescription>Chat trực tuyến</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Hỗ trợ trực tuyến 24/7
              </p>
              <Button variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Bắt đầu chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Các chủ đề khác</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mua hàng online</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Hướng dẫn đặt hàng, thanh toán, giao hàng
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bảo hành & Sửa chữa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Chính sách bảo hành, cách gửi bảo hành
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Đổi trả & Hoàn tiền</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Điều kiện đổi trả, quy trình hoàn tiền
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tài khoản & Thành viên</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Đăng ký, đăng nhập, quản lý tài khoản
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8">
            <h3 className="mb-4 text-2xl font-bold">Vẫn chưa tìm thấy câu trả lời?</h3>
            <p className="mb-6 text-muted-foreground">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn. Liên hệ ngay để được giải đáp chi tiết.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Liên hệ hỗ trợ
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:support@technova.vn">
                  <Mail className="mr-2 h-5 w-5" />
                  Gửi email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
