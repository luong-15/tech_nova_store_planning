"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock, Send, Zap } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#020617] pb-20">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb Gọn gàng */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          <Link href="/" className="transition-colors hover:text-primary">Trang chủ</Link>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-primary/80">Liên hệ</span>
        </nav>

        {/* Header Section - Chỉnh lại Typography */}
        <div className="mb-16 text-center lg:text-left max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-500/20">
            <Zap className="h-3 w-3 fill-current" />
            Chúng tôi luôn lắng nghe
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tighter md:text-6xl italic">
            Liên hệ <span className="text-blue-600">TechNova</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bạn cần tư vấn về sản phẩm hay hỗ trợ kỹ thuật? Đừng ngần ngại gửi tin nhắn cho đội ngũ chuyên gia của chúng tôi.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Cột trái: Thông tin liên hệ (Gọn & Đẹp hơn) */}
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            <div className="group flex items-center gap-5 p-6 rounded-4xl bg-white dark:bg-slate-900 border border-border/50 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Hotline tư vấn</p>
                <p className="text-lg font-black tracking-tight text-blue-600">1900 XXXX</p>
              </div>
            </div>

            <div className="group flex items-center gap-5 p-6 rounded-4xl bg-white dark:bg-slate-900 border border-border/50 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-yellow-600 group-hover:text-white">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Email hỗ trợ</p>
                <p className="text-lg font-black tracking-tight">support@technova.vn</p>
              </div>
            </div>

            <div className="group flex items-center gap-5 p-6 rounded-4xl bg-white dark:bg-slate-900 border border-border/50 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Văn phòng</p>
                <p className="text-sm font-bold">123 Nguyễn Huệ, Quận 1, TP.HCM</p>
              </div>
            </div>

            {/* Giờ làm việc thiết kế lại kiểu List */}
            <div className="p-8 rounded-4xl bg-slate-900 text-white relative overflow-hidden">
               <Clock className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10" />
               <h3 className="text-lg font-black mb-6">Giờ làm việc</h3>
               <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-xs text-white/50 font-bold uppercase tracking-widest">Thứ 2 - Thứ 6</span>
                    <span className="text-sm font-black">08:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/50 font-bold uppercase tracking-widest">Cuối tuần</span>
                    <span className="text-sm font-black text-blue-400">09:00 - 18:00</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Cột phải: Form liên hệ (Khắc phục lỗi Input/Label) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <Card className="border-none shadow-2xl shadow-blue-500/5 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black tracking-tight">Gửi yêu cầu trực tuyến</CardTitle>
                <CardDescription>Điền thông tin bên dưới, chuyên viên sẽ gọi lại cho bạn.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <form className="grid gap-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Họ tên *</label>
                      <Input id="name" placeholder="Ví dụ: Nguyễn Văn A" className="h-12 rounded-xl border-border/60 bg-background/50 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Email *</label>
                      <Input id="email" type="email" placeholder="name@example.com" className="h-12 rounded-xl border-border/60 bg-background/50" />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Số điện thoại</label>
                      <Input id="phone" placeholder="090x xxx xxx" className="h-12 rounded-xl border-border/60 bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Chủ đề</label>
                      <Input id="subject" placeholder="Bạn cần hỗ trợ gì?" className="h-12 rounded-xl border-border/60 bg-background/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Nội dung chi tiết *</label>
                    <Textarea id="message" placeholder="Mô tả thắc mắc của bạn..." rows={4} className="rounded-2xl border-border/60 bg-background/50 resize-none p-4" />
                  </div>

                  <Button className="h-14 w-full rounded-2xl bg-blue-600 text-base font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.01] transition-all group">
                    Gửi tin nhắn ngay
                    <Send size={18} className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map - Bo góc cực lớn đồng bộ với toàn hệ thống */}
        <div className="mt-16 overflow-hidden rounded-[3rem] border border-border/50 bg-white shadow-xl">
           <div className="p-6 border-b border-border/50 flex items-center justify-between bg-slate-50/50">
              <p className="text-sm font-black uppercase tracking-tighter italic">Vị trí cửa hàng</p>
              <div className="flex gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                <span>Google Maps</span>
                <span className="text-primary tracking-normal font-medium underline cursor-pointer">Chỉ đường</span>
              </div>
           </div>
           <div className="aspect-21/9 w-full bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232427506!2d106.70175551533413!3d10.775658662148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f468903510d%3A0x113d119106297374!2zMTIzIE5ndXnhu4VuIEh14buHLCBC4bq_biBOZ2jDqSwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1647417533816!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.1) contrast(1.1)' }}
                allowFullScreen
                loading="lazy"
              />
           </div>
        </div>
      </div>
    </div>
  )
}