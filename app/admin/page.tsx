"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Package, ShoppingCart, Users, DollarSign 
} from 'lucide-react'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

// --- Thẻ Thống kê Premium ---
function StatCard({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: any, description: string }) {
  return (
    <Card className="relative overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-all bg-white dark:bg-card/50 rounded-4xl group">
      <div className="absolute -right-4 -top-4 p-3 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 group-hover:-rotate-12 duration-500">
        <Icon className="h-32 w-32" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tighter">{value}</div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoadingStats(false))
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Hệ thống Quản trị</h1>
          <p className="text-muted-foreground font-medium mt-1">Quản lý cửa hàng một cách toàn diện.</p>
        </div>
      </div>

      {loadingStats ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Card key={i} className="h-36 rounded-4xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Tổng sản phẩm" value={stats.totalProducts} icon={Package} description="Đang được kinh doanh" />
          <StatCard title="Tổng đơn hàng" value={stats.totalOrders} icon={ShoppingCart} description="Toàn thời gian" />
          <StatCard title="Khách hàng" value={stats.totalUsers} icon={Users} description="Thành viên đã đăng ký" />
          <StatCard title="Doanh thu" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} description="Tổng thu nhập thực tế" />
        </div>
      )}

      <div className="text-center text-muted-foreground text-lg font-medium p-12 border-2 border-dashed border-border/60 rounded-4xl">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-2xl font-black mb-2">Sử dụng Sidebar Navigation</h3>
        <p>Click vào các mục trong sidebar bên trái để quản lý Sản phẩm, Đơn hàng, Khách hàng, Danh mục.</p>
        <p className="text-sm mt-2 opacity-75">Các trang riêng biệt đã có đầy đủ chức năng CRUD hoạt động bình thường!</p>
      </div>
    </div>
  )
}
