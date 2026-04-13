"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Shield, CheckCircle, AlertTriangle, Clock, MapPin, Zap, ArrowRight, ShieldCheck, Wrench, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function WarrantyPage() {
  return (
    <div className="relative min-h-screen bg-slate-50/50 dark:bg-[#020617] pb-20 overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1/3 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 py-12">
        {/* Breadcrumb - Clean & Minimal */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          <Link href="/" className="transition-colors hover:text-primary">Trang chủ</Link>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-primary/80">Chính sách bảo hành</span>
        </nav>

        {/* Header Section */}
        <div className="mb-16 max-w-3xl text-center md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-500/20">
            <ShieldCheck className="h-4 w-4" />
            Bảo vệ toàn diện
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl text-slate-900 dark:text-white">
            Yên tâm trải nghiệm cùng <br className="hidden md:block" />
            <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent italic">TechNova Store</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed md:max-w-2xl">
            Chúng tôi cam kết mang đến dịch vụ bảo hành chính hãng, minh bạch và tận tâm nhất để đảm bảo quyền lợi tuyệt đối cho khách hàng.
          </p>
        </div>

        {/* 4 Cam kết cốt lõi - Dạng Grid */}
        <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Bảo hành chính hãng", desc: "Thời hạn 12-24 tháng theo đúng tiêu chuẩn NSX.", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Clock, title: "Hỗ trợ 24/7", desc: "Đội ngũ chuyên gia luôn sẵn sàng giải đáp mọi lúc.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { icon: MapPin, title: "Bảo hành tận nơi", desc: "Miễn phí cho các sản phẩm lớn tại khu vực TP.HCM.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: RefreshCw, title: "Đổi mới 100%", desc: "Lỗi 1 đổi 1 trong 7 ngày đầu nếu do nhà sản xuất.", color: "text-rose-500", bg: "bg-rose-500/10" },
          ].map((item, idx) => (
            <Card key={idx} className="group overflow-hidden rounded-4xl border-border/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20">
              <CardContent className="p-6">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <item.icon size={24} />
                </div>
                <h4 className="mb-2 font-black tracking-tight">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Điều kiện bảo hành - Phân cực rõ ràng bằng màu sắc */}
        <div className="mb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tighter">Điều kiện áp dụng</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Cột Xanh - Được bảo hành */}
            <Card className="rounded-[2.5rem] border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-lg shadow-emerald-500/5 transition-all hover:border-emerald-500/40">
              <CardHeader className="p-8 pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                  <CheckCircle size={24} />
                </div>
                <CardTitle className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Được bảo hành</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                {[
                  "Lỗi phần cứng hoặc kỹ thuật phát sinh do nhà sản xuất.",
                  "Sản phẩm còn trong thời hạn bảo hành ghi trên hệ thống.",
                  "Còn nguyên tem bảo hành của TechNova hoặc NSX (không rách, chắp vá).",
                  "Sản phẩm giữ nguyên trạng, chưa bị can thiệp tháo lắp, sửa chữa ngoài."
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cột Đỏ - Từ chối bảo hành */}
            <Card className="rounded-[2.5rem] border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/10 shadow-lg shadow-rose-500/5 transition-all hover:border-rose-500/40">
              <CardHeader className="p-8 pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                  <AlertTriangle size={24} />
                </div>
                <CardTitle className="text-2xl font-black text-rose-600 dark:text-rose-400">Từ chối bảo hành</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                {[
                  "Hư hỏng do sử dụng sai hướng dẫn, sai điện áp, hoặc do thiên tai, rơi vỡ, vào nước.",
                  "Sản phẩm đã hết thời hạn bảo hành quy định.",
                  "Tem bảo hành bị rách, mờ, có dấu hiệu tẩy xóa hoặc không khớp với hệ thống.",
                  "Sản phẩm có dấu hiệu đã bị tự ý tháo lắp, can thiệp phần cứng bởi bên thứ ba."
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-600">
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quy trình bảo hành - Timeline ngang */}
        <div className="mb-20">
          <h2 className="mb-10 text-center text-3xl font-black tracking-tighter">4 Bước quy trình tinh gọn</h2>
          <div className="grid gap-6 md:grid-cols-4 relative">
            {/* Đường nối giữa các bước (chỉ hiện trên màn hình lớn) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border/60 z-0" />
            
            {[
              { title: "Liên hệ", desc: "Gọi hotline hoặc gửi yêu cầu online.", icon: Phone },
              { title: "Tiếp nhận", desc: "Kỹ thuật viên kiểm tra tình trạng máy.", icon: Wrench },
              { title: "Xử lý", desc: "Tiến hành sửa chữa & thay thế chuẩn NSX.", icon: Zap },
              { title: "Bàn giao", desc: "Hoàn trả thiết bị & cập nhật thời gian.", icon: CheckCircle },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 text-center group">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-4xl bg-white dark:bg-slate-900 border border-border/50 shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:border-primary/50 group-hover:shadow-primary/20">
                  <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-white shadow-sm border-[3px] border-slate-50 dark:border-[#020617]">
                    0{idx + 1}
                  </span>
                  <step.icon size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h4 className="text-lg font-black tracking-tight mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support & Centers - Layout bất đối xứng */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Hotline Card - Chiếm 5 cột */}
          <Card className="lg:col-span-5 rounded-[2.5rem] border-transparent bg-primary p-1 text-primary-foreground overflow-hidden relative shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <Phone size={160} />
            </div>
            <div className="h-full w-full rounded-[2.25rem] bg-primary p-8 relative z-10 flex flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  Hỗ trợ khẩn cấp
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-2">1900 XXXX</h3>
                <p className="text-primary-foreground/80 font-medium mb-8">
                  Tổng đài hoạt động 24/7. Miễn phí cước gọi cho mọi thuê bao.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-t border-white/20 pt-4">
                  <Mail className="h-5 w-5 opacity-80" />
                  <span className="font-medium">warranty@technova.vn</span>
                </div>
                <Button className="w-full h-12 rounded-xl bg-white text-primary hover:bg-slate-100 font-bold tracking-tight mt-2 group">
                  <Link href="/contact" className="flex items-center justify-center w-full">
                    Gửi yêu cầu hỗ trợ ngay
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Centers List - Chiếm 7 cột */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-black tracking-tighter mb-6 flex items-center gap-2">
              <MapPin className="text-primary" /> Điểm tiếp nhận trực tiếp
            </h3>
            {[
              { name: "TechNova Center TP.HCM", badge: "Trụ sở chính", address: "123 Nguyễn Huệ, Quận 1, TP.HCM", time: "8:00 - 18:00 (T2 - T6)" },
              { name: "TechNova Center Hà Nội", badge: "Chi nhánh", address: "456 Trần Duy Hưng, Cầu Giấy, Hà Nội", time: "8:00 - 17:00 (T2 - T6)" },
            ].map((center, idx) => (
              <Card key={idx} className="group rounded-4xl border-border/50 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all hover:border-primary/30 hover:shadow-md">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-black text-lg">{center.name}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{center.badge}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><MapPin size={14} /> {center.address}</p>
                      <p className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Clock size={14} /> {center.time}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-xl border-border/60 hover:bg-primary/5 hover:text-primary transition-colors">
                    Chỉ đường
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}