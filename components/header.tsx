"use client"

import Link from "next/link"
import { ShoppingCart, Search, User, Menu, X, LogOut, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useCartStore } from "@/lib/store/cart-store"
import { useComparisonStore } from "@/lib/store/comparison-store"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function CartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems())
  const openCart = useCartStore((state) => state.openCart)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
      <ShoppingCart className="h-5 w-5" />
      {isClient && totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {totalItems}
        </span>
      )}
    </Button>
  )
}

function ComparisonButton() {
  const productCount = useComparisonStore((state) => state.getProductCount())
  const openComparison = useComparisonStore((state) => state.openComparison)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={openComparison}>
      <GitCompare className="h-5 w-5" />
      {isClient && productCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {productCount}
        </span>
      )}
    </Button>
  )
}

export function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (authUser) {
          setUser(authUser)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createBrowserClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/products')
    }

    // Reset searching state after navigation
    setTimeout(() => setIsSearching(false), 100)
  }

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsMobileSearchOpen(false)

    if (mobileSearchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`)
    } else {
      router.push('/products')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">TN</span>
              </div>
              <span className="hidden text-xl font-bold md:inline-block">TechNova</span>
            </Link>

            {/* Search Bar */}
            <div className="mx-4 hidden flex-1 max-w-xl lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm laptop, smartphone, phụ kiện..."
                  className="w-full pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}
              </form>
            </div>

            {/* Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
                Sản phẩm
              </Link>
              <Link href="/deals" className="text-sm font-medium text-blue-500 transition-colors hover:text-blue-600">
                Deal hot
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                Giới thiệu
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Sheet open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Search className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-auto pb-6 p-2.5">
                  <SheetTitle className="sr-only">Tìm kiếm sản phẩm</SheetTitle>
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-lg font-semibold mt-[10px]">Tìm kiếm sản phẩm</h2>
                      <p className="text-sm text-muted-foreground">Tìm laptop, smartphone, phụ kiện...</p>
                    </div>

                    <form onSubmit={handleMobileSearch} className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Nhập tên sản phẩm..."
                          className="pl-12 h-12 text-base"
                          value={mobileSearchQuery}
                          onChange={(e) => setMobileSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <Button type="submit" className="w-full h-11" size="lg">
                        <Search className="mr-2 h-4 w-4" />
                        Tìm kiếm
                      </Button>
                    </form>

                    {/* Quick Search Suggestions */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Tìm kiếm phổ biến:</p>
                      <div className="flex flex-wrap gap-2">
                        {["iPhone", "Samsung", "MacBook", "Dell", "Gaming"].map((term) => (
                          <Button
                            key={term}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              setMobileSearchQuery(term)
                              router.push(`/products?search=${encodeURIComponent(term)}`)
                              setIsMobileSearchOpen(false)
                            }}
                          >
                            {term}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.email?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || "Người dùng"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Tài khoản
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/auth/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              <ComparisonButton />
              <CartButton />

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96">
                  <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between py-4 border-b">
                      <h2 className="text-lg font-semibold p-2.5">Menu</h2>
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button> */}
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 py-6">
                      <div className="space-y-1">
                        <Link
                          href="/"
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          🏠 Trang chủ
                        </Link>
                        <Link
                          href="/products"
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          📱 Sản phẩm
                        </Link>
                        <Link
                          href="/categories"
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          📂 Danh mục
                        </Link>
                        <Link
                          href="/deals"
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium text-blue-600 rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          🔥 Deal hot
                        </Link>
                        <Link
                          href="/about"
                          className="flex items-center gap-3 px-3 py-3 text-base font-medium rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          ℹ️ Giới thiệu
                        </Link>
                      </div>

                      {/* Categories Section */}
                      <div className="mt-8">
                        <h3 className="px-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Danh mục phổ biến
                        </h3>
                        <div className="space-y-1">
                          <Link
                            href="/categories/laptop"
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            💻 Laptop
                          </Link>
                          <Link
                            href="/categories/smartphone"
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            📱 Smartphone
                          </Link>
                          <Link
                            href="/categories/tablet"
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            📟 Tablet
                          </Link>
                          <Link
                            href="/categories/accessories"
                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            🎧 Phụ kiện
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        {user ? (
                          <>
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              👤 Tài khoản
                            </Link>
                            <button
                              onClick={() => {
                                handleLogout()
                                setIsMobileMenuOpen(false)
                              }}
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-left"
                            >
                              🚪 Đăng xuất
                            </button>
                          </>
                        ) : (
                          <Link
                            href="/auth/login"
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            👤 Đăng nhập
                          </Link>
                        )}
                        <Link
                          href="/cart"
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          🛒 Giỏ hàng
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}
