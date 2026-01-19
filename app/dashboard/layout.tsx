"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Package, Heart, Settings, LogOut, ChevronRight, Menu, X, Zap, Home } from "lucide-react"
import type { UserProfile } from "@/lib/types"

const sidebarItems = [
  { href: "/dashboard", label: "Hồ sơ", icon: User },
  { href: "/dashboard/orders", label: "Đơn hàng", icon: Package },
  { href: "/dashboard/wishlist", label: "Yêu thích", icon: Heart },
  { href: "/dashboard/settings", label: "Cài đặt", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        const supabase = createBrowserClient()
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        console.log("Dashboard auth check:", { authUser, authError })

        if (!isMounted) return

        if (authError) {
          console.error("Auth error:", authError)
          // Don't redirect immediately on auth error, let auth state listener handle it
          setLoading(false)
          return
        }

        if (!authUser) {
          console.log("No user found, redirecting to login")
          if (isMounted) {
            router.push("/auth/login")
          }
          return
        }

        console.log("User authenticated:", authUser.email)
        setEmail(authUser.email || null)

        const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", authUser.id).single()

        if (!isMounted) return

        if (profile && !error) {
          console.log("Profile found:", profile)
          setUser(profile)
        } else {
          console.log("Creating/updating profile for user:", authUser.id)
          // Create or update profile
          const profileData = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || "",
            phone: "",
            address: "",
            city: "",
            postal_code: "",
            country: "Việt Nam",
            updated_at: new Date().toISOString(),
          }

          const { data: upsertedProfile, error: upsertError } = await supabase
            .from("user_profiles")
            .upsert(profileData, { onConflict: 'id' })
            .select()
            .single()

          if (!isMounted) return

          if (upsertedProfile && !upsertError) {
            console.log("Profile created/updated:", upsertedProfile)
            setUser(upsertedProfile)
          } else {
            console.error("Profile upsert error:", upsertError)
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        // Don't redirect on error, let auth state listener handle authentication
        setLoading(false)
        return
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createBrowserClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email)

      if (!isMounted) return

      if (event === 'SIGNED_IN' && session?.user) {
        // User is authenticated, update state
        console.log("User authenticated in state change:", session.user.email)
        setEmail(session.user.email || null)

        const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("id", session.user.id).single()

        if (!isMounted) return

        if (profile && !error) {
          console.log("Profile found in state change:", profile)
          setUser(profile)
        } else {
          console.log("Profile not found in state change, creating for user:", session.user.id)
          // Create or update profile
          const profileData = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || "",
            phone: "",
            address: "",
            city: "",
            postal_code: "",
            country: "Việt Nam",
            updated_at: new Date().toISOString(),
          }

          const { data: upsertedProfile, error: upsertError } = await supabase
            .from("user_profiles")
            .upsert(profileData)
            .select()
            .single()

          if (!isMounted) return

          if (upsertedProfile && !upsertError) {
            console.log("Profile created in state change:", upsertedProfile)
            setUser(upsertedProfile)
          } else {
            console.error("Profile upsert error in state change:", upsertError)
            // Continue without profile
            setUser(null)
          }
        }
        setLoading(false)
      } else if (event === 'SIGNED_OUT' || !session?.user) {
        // User is not authenticated, redirect to login
        console.log("User not authenticated in state change, redirecting to login")
        router.push("/auth/login")
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <div className="hidden w-64 lg:block">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">TechNova</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Tài khoản</span>
        </div>

        <div className="flex flex-row gap-8 relative">
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 z-[70] h-12 w-12 rounded-full shadow-lg lg:hidden bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          <aside
            className={`
              fixed inset-y-0 left-0 z-[60] w-72 bg-background border-r border-border/50 p-6 
              transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:relative lg:translate-x-0 lg:w-64 lg:p-0 lg:bg-transparent lg:border-none
            `.replace(/\s+/g, ' ').trim()}
          >
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-primary/10">
                    <AvatarImage src={user?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {user?.full_name?.charAt(0) || email?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">{user?.full_name || "Người dùng"}</h3>
                    <p className="truncate text-xs text-muted-foreground">{email}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      {item.label}
                    </Link>
                  )
                })}

                <div className="pt-4 mt-4 border-t border-border/50">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
          )}

          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
