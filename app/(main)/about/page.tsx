"use client"

import { Button } from "@/components/ui/button"
import {
  Cpu,
  Users,
  Store,
  Award,
  Zap,
  Shield,
  Truck,
  HeadphonesIcon,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  Target,
  Rocket,
  Heart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const stats = [
  { value: "10K+", label: "Khách hàng", icon: Users },
  { value: "50+", label: "Cửa hàng", icon: Store },
  { value: "500+", label: "Sản phẩm", icon: Cpu },
  { value: "99%", label: "Hài lòng", icon: Award },
]

const team = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "CEO & Founder",
    image: "/professional-asian-man-ceo-portrait.jpg",
    bio: "10+ năm kinh nghiệm trong ngành công nghệ",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Trần Thị Mai",
    role: "CTO",
    image: "/professional-asian-woman-cto.png",
    bio: "Chuyên gia về hệ thống phân tán",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Lê Văn Hoàng",
    role: "Head of Product",
    image: "/professional-asian-man-product-manager-portrait.jpg",
    bio: "Đam mê tạo ra sản phẩm xuất sắc",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "Phạm Thị Hương",
    role: "Head of Marketing",
    image: "/asian-marketing-director.png",
    bio: "Xây dựng thương hiệu từ số 0",
    social: { github: "#", linkedin: "#", twitter: "#" },
  },
]

const values = [
  {
    icon: Target,
    title: "Chất lượng hàng đầu",
    description: "Chỉ cung cấp sản phẩm chính hãng với chất lượng tốt nhất",
  },
  {
    icon: Rocket,
    title: "Đổi mới không ngừng",
    description: "Luôn cập nhật công nghệ mới nhất để phục vụ khách hàng",
  },
  {
    icon: Heart,
    title: "Khách hàng là trọng tâm",
    description: "Mọi quyết định đều hướng đến lợi ích của khách hàng",
  },
]

const features = [
  { icon: Shield, title: "Bảo hành chính hãng", description: "Lên đến 24 tháng" },
  { icon: Truck, title: "Giao hàng nhanh", description: "2-4 giờ nội thành" },
  { icon: Zap, title: "Giá tốt nhất", description: "Cam kết hoàn tiền nếu đắt hơn" },
  { icon: HeadphonesIcon, title: "Hỗ trợ 24/7", description: "Luôn sẵn sàng giúp đỡ" },
]

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const numericValue = Number.parseInt(value.replace(/\D/g, ""))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000
          const steps = 60
          const increment = numericValue / steps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= numericValue) {
              setCount(numericValue)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [numericValue])

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-primary md:text-5xl">
        {count}
        {value.includes("+") ? "+" : value.includes("%") ? "%" : ""}
      </p>
      <p className="mt-2 text-muted-foreground">{label}</p>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Kiến tạo tương lai
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Công nghệ số
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              TechNova ra đời với sứ mệnh mang công nghệ tiên tiến nhất đến tay người Việt, với cam kết về chất lượng,
              giá cả và dịch vụ tốt nhất.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                  Khám phá sản phẩm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <Link href="#team">Đội ngũ của chúng tôi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-card/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <AnimatedCounter value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 to-blue-500/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50">
                <Image
                  src="/modern-tech-office-workspace.jpg"
                  alt="TechNova Office"
                  width={600}
                  height={500}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold md:text-4xl">Sứ mệnh của chúng tôi</h2>
              <p className="text-lg text-muted-foreground">
                TechNova được thành lập vào năm 2020 với khát vọng trở thành cầu nối giữa công nghệ tiên tiến và người
                tiêu dùng Việt Nam.
              </p>
              <p className="text-muted-foreground">
                Chúng tôi tin rằng mọi người đều xứng đáng được tiếp cận với những sản phẩm công nghệ chất lượng cao với
                mức giá hợp lý. Đó là lý do tại sao chúng tôi không ngừng nỗ lực để mang đến trải nghiệm mua sắm tốt
                nhất.
              </p>

              <div className="space-y-4 pt-4">
                {values.map((value, index) => (
                  <div
                    key={value.title}
                    className="flex gap-4 rounded-xl border border-border/50 bg-card/50 p-4 transition-colors hover:border-primary/30"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Đội ngũ lãnh đạo</h2>
            <p className="mt-4 text-muted-foreground">
              Những người đam mê công nghệ, tận tâm xây dựng TechNova mỗi ngày
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20 transition-transform group-hover:scale-105">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>

                <div className="mt-4 flex justify-center gap-3">
                  <a
                    href={member.social.github}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Tại sao chọn TechNova?</h2>
            <p className="mt-4 text-muted-foreground">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm công nghệ tốt nhất
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-gradient-to-r from-primary/10 via-background to-blue-500/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Sẵn sàng khám phá?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tham gia cùng hơn 10,000 khách hàng hài lòng và trải nghiệm cách mua sắm công nghệ hoàn toàn mới.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                  Bắt đầu mua sắm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent">
                <Link href="/auth/login">Đăng ký tài khoản</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
