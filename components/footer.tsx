"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

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
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">TechNova Store</h3>
            <p className="text-sm text-muted-foreground">
              Chuyên cung cấp các sản phẩm công nghệ chính hãng với giá tốt nhất thị trường. Uy tín - Chất lượng - Bảo
              hành chu đáo.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground transition-colors hover:text-foreground">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground transition-colors hover:text-foreground">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/warranty" className="text-muted-foreground transition-colors hover:text-foreground">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground transition-colors hover:text-foreground">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground transition-colors hover:text-foreground">
                  Đổi trả hàng
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Hotline: 1900 xxxx</li>
              <li>Email: support@technova.vn</li>
              <li>Địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a
                href={shareUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-accent"
                title="Chia sẻ trên Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={shareUrls.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-accent"
                title="Chia sẻ trên Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={shareUrls.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-accent"
                title="Theo dõi trên Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={shareUrls.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background transition-colors hover:bg-accent"
                title="Đăng ký kênh YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 TechNova Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
