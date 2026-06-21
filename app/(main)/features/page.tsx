'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  Search,
  QrCode,
  Users,
  Package,
  Settings,
  TrendingUp,
  Lock,
  Smartphone,
  Rocket,
  Star,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: "customer" | "admin" | "technical";
}

const features: Feature[] = [
  // Customer Features
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "Giỏ hàng thông minh",
    description:
      "Giỏ hàng linh hoạt với quản lý trạng thái toàn cục, hiển thị tiến độ miễn phí vận chuyển",
    category: "customer",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Tìm kiếm & Lọc nâng cao",
    description:
      "Lọc sản phẩm theo danh mục, giá, thương hiệu và thặc tính kỹ thuật với giao diện thân thiện",
    category: "customer",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "So sánh sản phẩm",
    description:
      "So sánh chi tiết các sản phẩm theo danh mục với bảng thặc tính đầy đủ",
    category: "customer",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Trợ lý AI 24/7",
    description:
      "Chatbot hỗ trợ khách hàng tích hợp Google Generative AI, hỗ trợ tìm kiếm sản phẩm và theo dõi đơn hàng",
    category: "customer",
  },
  {
    icon: <QrCode className="h-6 w-6" />,
    title: "Thanh toán VietQR",
    description:
      "Thanh toán trực tuyến thông qua mã QR, tự động xác minh thanh toán trong vòng 5 giây",
    category: "customer",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Đánh giá & Nhận xét",
    description:
      "Hệ thống đánh giá 5 sao với bình luận chi tiết từ người dùng thực tế",
    category: "customer",
  },

  // Admin Features
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Bảng điều khiển phân tích",
    description:
      "Thống kê doanh thu, sản phẩm bán chạy và xu hướng bán hàng với biểu đồ Recharts",
    category: "admin",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Quản lý sản phẩm",
    description:
      "CRUD hoàn chỉnh, xử lý hình ảnh, phân loại và đánh dấu sản phẩm nổi bật/khuyến mại",
    category: "admin",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Quản lý danh mục",
    description:
      "Hỗ trợ danh mục phân cấp với cấu trúc cha-con linh hoạt",
    category: "admin",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "Quản lý đơn hàng",
    description:
      "Theo dõi đơn hàng theo thời gian thực, cập nhật trạng thái thanh toán và vận chuyển",
    category: "admin",
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Cấu hình cửa hàng",
    description:
      "Quản lý thông tin cửa hàng, tỷ lệ thuế, chế độ bảo trì và thông tin liên hệ",
    category: "admin",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Quản lý người dùng",
    description:
      "Quản lý hồ sơ khách hàng, phân quyền và kiểm soát truy cập",
    category: "admin",
  },

  // Technical Features
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Next.js 16 App Router",
    description:
      "Xây dựng với Next.js 16 mới nhất, Server Components, Streaming và View Transitions",
    category: "technical",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Supabase RLS",
    description:
      "Bảo mật hàng đầu với Row Level Security (RLS) trên cơ sở dữ liệu PostgreSQL",
    category: "technical",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Thiết kế Responsive",
    description:
      "Mobile-first design với Tailwind CSS v4 và shadcn/ui, hỗ trợ Dark/Light mode",
    category: "technical",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "State Management",
    description:
      "Quản lý trạng thái toàn cục với Zustand cho giỏ hàng, so sánh và UI",
    category: "technical",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "TypeScript + Zod",
    description:
      "An toàn kiểu dữ liệu hoàn chỉnh với validation schema và runtime checks",
    category: "technical",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "SEO & Analytics",
    description:
      "Tối ưu hóa SEO, Metadata API, Vercel Analytics và hỗ trợ sitemap",
    category: "technical",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function FeaturesPage() {
  const customerFeatures = features.filter((f) => f.category === "customer");
  const adminFeatures = features.filter((f) => f.category === "admin");
  const technicalFeatures = features.filter((f) => f.category === "technical");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-background/50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                <Zap className="mr-1 h-3 w-3" />
                Khám phá các tính năng mạnh mẽ
              </Badge>

              <h1 className="mb-4 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Một nền tảng thương mại điện tử toàn diện
              </h1>

              <p className="mb-8 text-balance text-lg text-muted-foreground">
                Tech Nova Store kết hợp công nghệ hiện đại với trải nghiệm
                người dùng tuyệt vời, được thiết kế cho cửa hàng công nghệ Việt
                Nam
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Khám phá sản phẩm
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/">Về trang chủ</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features by Category */}
      <div className="space-y-24 py-20">
        {/* Customer Features */}
        <section className="container mx-auto px-4">
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-3 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
                Cho khách hàng
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">
                Trải nghiệm mua sắm tuyệt vời
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Giao diện thân thiện, công cụ mạnh mẽ để tìm kiếm và so sánh
                sản phẩm công nghệ
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {customerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-all group-hover:bg-primary/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Admin Features */}
        <section className="container mx-auto px-4">
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-3 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                Cho quản trị viên
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">
                Bảng điều khiển quản lý mạnh mẽ
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Kiểm soát toàn bộ cửa hàng của bạn từ một bảng điều khiển
                trực quan và dễ sử dụng
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-emerald-500/10 p-3 text-emerald-600 transition-all group-hover:bg-emerald-500/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Technical Features */}
        <section className="container mx-auto px-4">
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-3 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">
                Công nghệ
              </Badge>
              <h2 className="text-3xl font-bold md:text-4xl">
                Xây dựng bằng công nghệ hàng đầu
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Sử dụng stack công nghệ hiện đại nhất để đảm bảo hiệu suất,
                bảo mật và khả năng mở rộng
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-3 text-purple-600 transition-all group-hover:bg-purple-500/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* Highlights Section */}
      <section className="border-t border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Tại sao chọn Tech Nova Store?
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Hiệu suất cao",
                description:
                  "Tối ưu hóa cho tốc độ với Next.js 16, caching thông minh và CDN Vercel",
                icon: <Rocket className="h-5 w-5" />,
              },
              {
                title: "Bảo mật tuyệt đối",
                description:
                  "Row Level Security trên Supabase PostgreSQL, xác thực an toàn và mã hóa dữ liệu",
                icon: <Shield className="h-5 w-5" />,
              },
              {
                title: "Dễ sử dụng",
                description:
                  "Giao diện intuitiv với shadcn/ui, hỗ trợ Dark mode và hoàn toàn responsive",
                icon: <Smartphone className="h-5 w-5" />,
              },
              {
                title: "Dễ mở rộng",
                description:
                  "Kiến trúc modular, TypeScript typed, dễ dàng thêm tính năng mới",
                icon: <TrendingUp className="h-5 w-5" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4 rounded-lg border border-border bg-card p-6"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-2xl rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">Bắt đầu ngay hôm nay</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Trải nghiệm nền tảng thương mại điện tử tuyệt vời với tất cả các
              tính năng mà bạn cần
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  Khám phá sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Liên hệ với chúng tôi</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
