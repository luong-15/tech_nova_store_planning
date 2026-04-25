"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Search,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="relative min-h-screen bg-slate-50/50 dark:bg-[#020617] pb-20 overflow-hidden">
      {/* Hiệu ứng nền Blur */}
      <div className="absolute top-0 right-0 w-full max-w-3xl h-1/3 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          <Link href="/" className="transition-colors hover:text-primary">
            Trang chủ
          </Link>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-primary/80">Vận chuyển</span>
        </nav>

        {/* Header Section */}
        <div className="mb-16 max-w-3xl text-center md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-500/20">
            <Zap className="h-4 w-4" />
            Giao nhận siêu tốc
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl text-slate-900 dark:text-white">
            Hành trình an toàn đến <br className="hidden md:block" />
            <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic">
              tận tay bạn
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed md:max-w-2xl">
            TechNova cam kết mang đến trải nghiệm nhận hàng nhanh chóng, minh
            bạch với mạng lưới đối tác vận chuyển hàng đầu Việt Nam.
          </p>
        </div>

        {/* 3 Trụ cột vận chuyển - Grid */}
        <div className="mb-20 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Tốc độ tối đa",
              desc: "Nhận hàng chỉ từ 1-3 ngày trên toàn quốc. Hỗ trợ giao hỏa tốc 2H nội thành.",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              icon: Shield,
              title: "Bảo hiểm 100%",
              desc: "Mọi đơn hàng đều được đóng gói tiêu chuẩn và bảo hiểm giá trị 100%.",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              icon: MapPin,
              title: "Theo dõi 24/7",
              desc: "Cập nhật trạng thái đơn hàng theo thời gian thực mọi lúc, mọi nơi.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="group overflow-hidden rounded-4xl border-border/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
            >
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div
                  className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${item.bg} ${item.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <item.icon size={36} strokeWidth={1.5} />
                </div>
                <h4 className="mb-3 text-xl font-black tracking-tight">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tracking Section - UI Tương tác */}
        <div className="mb-20">
          <Card className="overflow-hidden rounded-[2.5rem] border-none bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-500/20 blur-[100px] pointer-events-none" />
            <div className="grid lg:grid-cols-2 relative z-10">
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <Badge
                  variant="outline"
                  className="w-fit border-white/20 text-white/80 bg-white/5 backdrop-blur-md mb-6"
                >
                  Mạng lưới thông minh
                </Badge>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
                  Tra cứu trạng thái đơn
                </h2>
                <p className="text-slate-300 mb-8 max-w-md">
                  Nhập mã vận đơn bạn nhận được qua Email hoặc SMS để kiểm tra
                  vị trí kiện hàng theo thời gian thực.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="VD: TN-84920183"
                    className="h-14 rounded-2xl border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                  />
                  <Button className="h-14 px-8 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20">
                    <Search size={18} className="mr-2" /> Tra cứu
                  </Button>
                </div>
              </div>
              <div className="p-10 md:p-12 border-t lg:border-t-0 lg:border-l border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="font-bold mb-6 text-slate-200">
                  Trạng thái phổ biến:
                </h3>
                <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-2.5 before:w-0.5 before:bg-white/10">
                  {[
                    {
                      status: "Đang xử lý",
                      desc: "Đơn hàng đã được xác nhận và đang đóng gói.",
                    },
                    {
                      status: "Đang giao hàng",
                      desc: "Kiện hàng đã xuất kho và giao cho bưu tá.",
                    },
                    {
                      status: "Giao thành công",
                      desc: "Người nhận đã ký nhận kiện hàng.",
                    },
                  ].map((step, i) => (
                    <div key={i} className="relative pl-8">
                      <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-4 border-slate-800 bg-blue-400" />
                      <h4 className="font-bold text-sm text-white">
                        {step.status}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Phương thức & Chi phí - Bố cục Split */}
        <div className="mb-20">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black tracking-tighter mb-4">
              Phương thức & Chi phí
            </h2>
            <p className="text-muted-foreground">
              Lựa chọn giải pháp phù hợp với nhu cầu thời gian của bạn.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Các gói giao hàng - Chiếm 5 cột */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="rounded-4xl border-primary/20 bg-primary/5 shadow-none ring-1 ring-primary/10 transition-all hover:bg-primary/10 cursor-pointer">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight mb-1">
                      Giao tiêu chuẩn
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Tối ưu chi phí cho các đơn hàng không cần gấp.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-primary" /> 2-4 Ngày
                      </span>
                      <span className="flex items-center gap-1">
                        <Info size={14} className="text-primary" /> Từ 30K
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden rounded-4xl border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-500/20 transition-all hover:bg-amber-100 dark:hover:bg-amber-900/30 cursor-pointer shadow-lg shadow-amber-500/5">
                <div className="absolute top-0 right-0 rounded-bl-2xl bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                  Khuyên dùng
                </div>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight mb-1 text-amber-900 dark:text-amber-100">
                      Giao hỏa tốc 2H
                    </h3>
                    <p className="text-sm text-amber-700/70 dark:text-amber-300/70 mb-3">
                      Chỉ áp dụng nội thành TP.HCM & Hà Nội.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-bold text-amber-900 dark:text-amber-200">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-amber-500" /> Trong 2
                        Giờ
                      </span>
                      <span className="flex items-center gap-1">
                        <Info size={14} className="text-amber-500" /> Từ 50K
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bảng phí (Redesigned) - Chiếm 7 cột */}
            <Card className="lg:col-span-7 rounded-4xl overflow-hidden border-border/50 bg-white dark:bg-slate-900 shadow-xl">
              <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-lg">Bảng cước phí ước tính</h3>
                  <p className="text-xs text-muted-foreground">
                    Áp dụng cho đơn hàng dưới 2kg
                  </p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 font-bold">
                  Miễn phí giao hàng đơn từ 500K
                </Badge>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[
                    {
                      region: "Nội thành TP.HCM / Hà Nội",
                      time: "1-2 ngày",
                      standard: "20.000đ",
                      express: "50.000đ (2H)",
                    },
                    {
                      region: "Ngoại thành TP.HCM / Hà Nội",
                      time: "1-2 ngày",
                      standard: "30.000đ",
                      express: "Không hỗ trợ",
                    },
                    {
                      region: "Các tỉnh Miền Nam / Bắc",
                      time: "2-3 ngày",
                      standard: "35.000đ",
                      express: "60.000đ (1 ngày)",
                    },
                    {
                      region: "Các tỉnh Miền Trung & Vùng xa",
                      time: "3-5 ngày",
                      standard: "40.000đ",
                      express: "Không hỗ trợ",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-6 md:px-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {row.region}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock size={12} /> {row.time}
                        </p>
                      </div>
                      <div className="flex gap-8 text-right">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                            Tiêu chuẩn
                          </p>
                          <p className="font-semibold text-sm">
                            {row.standard}
                          </p>
                        </div>
                        <div className="w-24">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                            Hỏa tốc
                          </p>
                          <p
                            className={`font-semibold text-sm ${row.express === "Không hỗ trợ" ? "text-muted-foreground/50" : "text-amber-600 dark:text-amber-500"}`}
                          >
                            {row.express}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <Card className="rounded-4xl border-rose-200 bg-rose-50/50 dark:bg-rose-950/10 dark:border-rose-900/50">
          <CardContent className="p-8 md:flex gap-8 items-start">
            <div className="mb-6 md:mb-0 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-500">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-800 dark:text-rose-400 mb-4">
                Lưu ý quan trọng
              </h3>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-rose-700/80 dark:text-rose-300/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  Thời gian giao hàng có thể dao động nhẹ trong các dịp Lễ, Tết
                  hoặc điều kiện thời tiết xấu.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  Đồng kiểm (Kiểm tra hàng trước khi nhận) được hỗ trợ cho mọi
                  đơn hàng.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  Phí vận chuyển thực tế sẽ được tính chính xác tại trang thanh
                  toán dựa trên khối lượng.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  Thanh toán COD (Nhận hàng trả tiền) tối đa áp dụng cho đơn
                  hàng dưới 5.000.000đ.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
