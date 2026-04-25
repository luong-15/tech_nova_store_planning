"use client";

import type React from "react";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard", label: "Hồ sơ cá nhân", icon: User },
  { href: "/dashboard/orders", label: "Quản lý đơn hàng", icon: Package },
  { href: "/dashboard/wishlist", label: "Sản phẩm yêu thích", icon: Heart },
  { href: "/dashboard/settings", label: "Cài đặt tài khoản", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createBrowserClient();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/auth/login");
          return;
        }
        if (isMounted) {
          setEmail(authUser.email || null);
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();
          if (profile) setUser(profile);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.push("/auth/login");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex gap-8 flex-1">
          <Skeleton className="hidden lg:block w-64 h-100 rounded-3xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-125 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 w-fit px-4 py-1.5 rounded-full border border-border/40">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium italic">
            Bảng điều khiển
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Mobile Toggle FAB */}
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-6 right-6 z-70 h-14 w-14 rounded-full shadow-2xl lg:hidden flex items-center justify-center animate-in zoom-in"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Sidebar */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-60 w-80 bg-background/95 backdrop-blur-xl border-r p-6 transition-transform duration-500 ease-out lg:relative lg:translate-x-0 lg:w-72 lg:p-0 lg:bg-transparent lg:border-none",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="sticky top-28 space-y-6">
              {/* Profile Card */}
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-5 backdrop-blur-md shadow-sm group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <User size={60} />
                </div>
                <div className="flex items-center gap-4 relative">
                  <Avatar className="h-14 w-14 border-2 border-primary/20 p-0.5">
                    <AvatarImage
                      src={user?.avatar_url || undefined}
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user?.full_name?.charAt(0) ||
                        email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-base tracking-tight">
                      {user?.full_name || "Thành viên"}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground font-medium">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1.5">
                <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                  Menu quản lý
                </p>
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-primary transition-colors",
                        )}
                      />
                      {item.label}
                      {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-primary-foreground/40 rounded-full" />
                      )}
                    </Link>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-border/40">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-red-500/80 transition-all hover:bg-red-500/10 hover:text-red-500 group"
                  >
                    <div className="p-1 rounded-lg group-hover:bg-red-500/10 transition-colors">
                      <LogOut className="h-5 w-5" />
                    </div>
                    Đăng xuất
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Overlay for Mobile Sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="min-w-0 flex-1 lg:pl-4">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
