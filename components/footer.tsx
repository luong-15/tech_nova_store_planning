"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Facebook, Twitter, Instagram, Youtube, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function Footer() {
  const [currentUrl, setCurrentUrl] = useState('')
  const siteTitle = "TechNova Store - Sản phẩm công nghệ chính hãng"

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(siteTitle)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(currentUrl)}`,
    youtube: `https://www.youtube.com/share?url=${encodeURIComponent(currentUrl)}`
  }

  return (
    <footer className="relative border-t border-border/40 bg-slate-50 dark:bg-[#020617] overflow-hidden">
      {/* Hiệu ứng ánh sáng nền tinh tế */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* About Section */}
          <div className="flex flex-col">
            <Link href="/" className="mb-6 flex items-center gap-2 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight">TechNova</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chuyên cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường. Định hình phong cách số của bạn với sự uy tín, chất lượng và dịch vụ hậu mãi chu đáo nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold tracking-tight">Liên kết nhanh</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Sản phẩm", path: "/products" },
                { name: "Khuyến mãi", path: "/deals" },
                { name: "Giới thiệu", path: "/about" },
                { name: "Liên hệ", path: "/contact" },
              ].map((link) => (
                <li key={link.name} className="group">
                  <Link 
                    href={link.path} 
                    className="inline-flex items-center text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1.5 font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/0 mr-2 transition-all duration-300 group-hover:bg-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-lg font-bold tracking-tight">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Chính sách bảo hành", path: "/warranty" },
                { name: "Vận chuyển & Giao nhận", path: "/shipping" },
                { name: "Đổi trả hàng", path: "/returns" },
                { name: "Câu hỏi thường gặp (FAQ)", path: "/faq" },
              ].map((link) => (
                <li key={link.name} className="group">
                  <Link 
                    href={link.path} 
                    className="inline-flex items-center text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1.5 font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/0 mr-2 transition-all duration-300 group-hover:bg-primary" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="mb-6 text-lg font-bold tracking-tight">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium mb-8">
              <li className="flex items-start gap-2 text-foreground">
                <span className="text-muted-foreground">Hotline:</span> 
                <span className="font-bold text-primary hover:underline cursor-pointer">1900 xxxx</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">Email:</span> 
                <span className="hover:text-foreground cursor-pointer transition-colors">support@technova.vn</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-muted-foreground whitespace-nowrap">Địa chỉ:</span> 
                <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
            
            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Facebook, url: shareUrls.facebook, label: "Facebook", color: "hover:bg-blue-600" },
                { icon: Twitter, url: shareUrls.twitter, label: "Twitter", color: "hover:bg-sky-500" },
                { icon: Instagram, url: shareUrls.instagram, label: "Instagram", color: "hover:bg-pink-600" },
                { icon: Youtube, url: shareUrls.youtube, label: "YouTube", color: "hover:bg-red-600" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-border/50 text-muted-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:text-white hover:border-transparent hover:shadow-lg",
                    social.color
                  )}
                  title={`Chia sẻ trên ${social.label}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
          <p>&copy; 2025 TechNova Store. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">Bảo mật</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}