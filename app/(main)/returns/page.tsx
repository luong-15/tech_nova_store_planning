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
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
  Package,
  ChevronRight,
  PhoneCall,
  Mail,
  XCircle,
  Undo2,
  Box,
} from "lucide-react";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="relative min-h-screen bg-slate-50/50 dark:bg-[#020617] pb-20 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/4 w-full max-w-4xl h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          <Link href="/" className="transition-colors hover:text-primary">
            Trang chủ
          </Link>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-primary/80">Chính sách đổi trả</span>
        </nav>

        {/* Header Section */}
        <div className="mb-16 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-500/20">
            <Undo2 className="h-4 w-4" />
            Mua sắm không rủi ro
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tighter md:text-5xl lg:text-6xl text-slate-900 dark:text-white">
            Đổi trả dễ dàng, <br className="hidden md:block" />
            <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent italic">
              hoàn toàn an tâm.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed md:max-w-2xl">
            TechNova cam kết mang lại trải nghiệm mua sắm công bằng nhất. Nếu
            sản phẩm không làm bạn hài lòng, chúng tôi luôn sẵn sàng hỗ trợ đổi
            trả trong vòng 30 ngày.
          </p>
        </div>

        {/* Highlight Stats */}
        <div className="mb-20 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "30 Ngày đổi trả",
              desc: "Thời gian áp dụng dài nhất thị trường cho đồ công nghệ.",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              icon: Shield,
              title: "Lỗi là đổi mới",
              desc: "1 đổi 1 ngay lập tức nếu phát hiện lỗi từ nhà sản xuất.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Package,
              title: "Thu tận nơi",
              desc: "Hỗ trợ nhân viên đến tận nhà thu hồi hàng đổi trả.",
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-5 p-6 rounded-4xl border border-border/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm transition-all hover:shadow-xl hover:border-primary/20"
            >
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}
              >
                <item.icon size={28} />
              </div>
              <div>
                <h4 className="font-black tracking-tight text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-Column Conditions */}
        <div className="mb-20 grid gap-8 lg:grid-cols-2">
          <Card className="rounded-[2.5rem] border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5 shadow-none overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                  <CheckCircle size={20} />
                </div>
                <CardTitle className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  Được đổi trả khi
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {[
                "Sản phẩm còn trong thời hạn 30 ngày kể từ lúc nhận.",
                "Sản phẩm còn nguyên tem mác, seal, không trầy xước.",
                "Đầy đủ vỏ hộp, phụ kiện, quà tặng kèm theo (nếu có).",
                "Có hóa đơn điện tử hoặc phiếu mua hàng đi kèm.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex gap-3 text-sm font-medium text-emerald-800/80 dark:text-emerald-300/80 italic"
                >
                  <ChevronRight
                    size={18}
                    className="shrink-0 text-emerald-500"
                  />
                  {text}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-rose-500/20 bg-rose-50/30 dark:bg-rose-500/5 shadow-none overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500 rounded-lg text-white">
                  <XCircle size={20} />
                </div>
                <CardTitle className="text-2xl font-black text-rose-700 dark:text-rose-400">
                  Từ chối đổi trả khi
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {[
                "Quá thời hạn 30 ngày quy định.",
                "Sản phẩm bị biến dạng, rơi vỡ, ngấm nước do người dùng.",
                "Mất vỏ hộp hoặc phụ kiện đi kèm sản phẩm.",
                "Sản phẩm trong danh mục 'Vệ sinh cá nhân' (tai nghe in-ear...)",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex gap-3 text-sm font-medium text-rose-800/80 dark:text-rose-300/80 italic"
                >
                  <ChevronRight size={18} className="shrink-0 text-rose-500" />
                  {text}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Process Section - Stepper Style */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tighter mb-2">
              Quy trình xử lý nhanh
            </h2>
            <p className="text-muted-foreground">
              Chỉ với 4 bước đơn giản để giải quyết vấn đề của bạn.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-4 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
            {[
              {
                step: "01",
                title: "Liên hệ",
                desc: "Gọi hotline hoặc gửi yêu cầu qua cổng trực tuyến.",
              },
              {
                step: "02",
                title: "Kiểm tra",
                desc: "TechNova xác nhận thông tin và tình trạng sản phẩm.",
              },
              {
                step: "03",
                title: "Gửi hàng",
                desc: "Bưu tá đến thu hàng hoặc khách gửi qua bưu cục.",
              },
              {
                step: "04",
                title: "Hoàn tất",
                desc: "Hoàn tiền hoặc đổi sản phẩm mới trong 24H.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-6 text-center bg-white dark:bg-slate-900 rounded-4xl border border-border/50 shadow-sm transition-transform hover:-translate-y-2"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-lg ring-8 ring-slate-50 dark:ring-[#020617]">
                  {item.step}
                </div>
                <h4 className="font-black text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Options */}
        <div className="mb-20 grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 rounded-[2.5rem] overflow-hidden border-none bg-linear-to-br from-slate-900 to-slate-800 text-white p-8 md:p-12 relative shadow-2xl">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-3xl font-black tracking-tight mb-4">
                  Bạn cần hỗ trợ ngay?
                </h3>
                <p className="text-slate-300 max-w-md mb-8">
                  Đội ngũ chuyên viên TechNova luôn trực tuyến để hướng dẫn bạn
                  quy trình đổi trả nhanh nhất.
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <PhoneCall size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Hotline 24/7
                    </p>
                    <p className="font-black text-xl">1900 88XX</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <Mail size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Email phản hồi
                    </p>
                    <p className="font-black text-lg">returns@technova.vn</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] border-border/50 bg-white dark:bg-slate-900 p-8 flex flex-col items-center text-center justify-center group">
            <div className="mb-6 p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 transition-transform group-hover:rotate-12">
              <Box size={48} strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-black mb-2">Tự tạo yêu cầu</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Bạn có thể tự tạo yêu cầu đổi trả ngay trong lịch sử đơn hàng.
            </p>
            <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
              Gửi yêu cầu ngay <ChevronRight size={16} className="ml-1" />
            </Button>
          </Card>
        </div>

        {/* Legal Disclaimer */}
        <Card className="rounded-4xl border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/50">
          <CardContent className="p-8 flex gap-6 items-start">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div className="text-sm text-amber-800/80 dark:text-amber-200/60 space-y-2">
              <p className="font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest text-[10px]">
                Lưu ý quan trọng
              </p>
              <p>
                TechNova có quyền từ chối đổi trả nếu phát hiện các dấu hiệu
                trục lợi hoặc sản phẩm đã bị can thiệp phần cứng bởi bên thứ ba
                không thuộc ủy quyền. Thời gian hoàn tiền tùy thuộc vào ngân
                hàng của bạn (thường từ 3-7 ngày làm việc).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
