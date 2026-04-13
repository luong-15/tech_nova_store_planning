"use client"

import { useEffect, useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, Edit, Trash2, Eye, Search, Loader2, Package, 
  ShoppingCart, Users, DollarSign, LayoutDashboard, Phone, Mail 
} from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Interfaces ---
interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}
interface Category { id: string; name: string; description?: string }
interface Product { id: string; name: string; price: number; stock: number; category: Category }
interface Order { id: string; order_number: string; status: string; total: number; created_at: string }
interface User { id: string; full_name: string; email: string | null; phone: string }

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
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 })
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  
  const [productsSearch, setProductsSearch] = useState('')
  const [ordersSearch, setOrdersSearch] = useState('')
  const [usersSearch, setUsersSearch] = useState('')
  
  const [newCategoryOpen, setNewCategoryOpen] = useState(false)
  const [editCategoryOpen, setEditCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  // Fetch API Logic (Giữ nguyên)
  useEffect(() => {
    fetch('/api/admin/stats').then(res => res.json()).then(setStats).finally(() => setLoadingStats(false))
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    try {
      const res = await fetch('/api/admin/products?limit=1000')
      const data = await res.json()
      setProducts(data.data || [])
    } catch (error) { console.error('Error fetching products:', error) } finally { setLoadingProducts(false) }
  }, [])

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true)
    try {
      const res = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data || [])
    } catch (error) { console.error('Error fetching categories:', error) } finally { setLoadingCategories(false) }
  }, [])

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true)
    try {
      const res = await fetch('/api/admin/orders?limit=1000')
      const data = await res.json()
      setOrders(data.data || [])
    } catch (error) { console.error('Error fetching orders:', error) } finally { setLoadingOrders(false) }
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users?limit=1000')
      const data = await res.json()
      setUsers(data.data || [])
    } catch (error) { console.error('Error fetching users:', error) } finally { setLoadingUsers(false) }
  }, [])

  // CRUD Category
  const handleCreateCategory = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      })
      if (res.ok) {
        const newCat = await res.json()
        setCategories(prev => [newCat, ...prev])
        setNewCategoryOpen(false)
        setNewCategoryName('')
      }
    } catch (error) { console.error('Error creating category:', error) }
  }

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedCategory.id, name: newCategoryName })
      })
      if (res.ok) {
        const updatedCat = await res.json()
        setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updatedCat : c))
        setEditCategoryOpen(false)
        setSelectedCategory(null)
        setNewCategoryName('')
      }
    } catch (error) { console.error('Error updating category:', error) }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Xóa danh mục này?')) return
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) setCategories(prev => prev.filter(c => c.id !== id))
    } catch (error) { console.error('Error deleting category:', error) }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-md text-[10px] uppercase font-bold tracking-widest">Đã giao</Badge>
      case 'cancelled': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none rounded-md text-[10px] uppercase font-bold tracking-widest">Đã hủy</Badge>
      case 'shipped': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none rounded-md text-[10px] uppercase font-bold tracking-widest">Đang giao</Badge>
      default: return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none rounded-md text-[10px] uppercase font-bold tracking-widest">Đang xử lý</Badge>
    }
  }

  useEffect(() => {
    if (activeTab === 'products') fetchProducts()
    if (activeTab === 'categories') fetchCategories()
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'users') fetchUsers()
  }, [activeTab, fetchProducts, fetchCategories, fetchOrders, fetchUsers])

  return (
    <div className="container mx-auto p-6 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Hệ thống Quản trị</h1>
          <p className="text-muted-foreground font-medium mt-1">Quản lý cửa hàng một cách toàn diện.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center justify-between bg-muted/50 p-1.5 rounded-2xl w-max border border-border/50">
            <TabsList className="bg-transparent border-none flex gap-1 h-auto p-0">
              {[
                { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
                { id: "products", label: "Sản phẩm", icon: Package },
                { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
                { id: "users", label: "Khách hàng", icon: Users },
                { id: "categories", label: "Danh mục", icon: Edit },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="rounded-xl px-5 py-2.5 text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all flex items-center gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* TỔNG QUAN */}
        <TabsContent value="overview" className="mt-0 outline-none">
          {loadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <Card key={i} className="animate-pulse h-36 rounded-4xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Tổng sản phẩm" value={stats.totalProducts} icon={Package} description="Đang được kinh doanh" />
              <StatCard title="Tổng đơn hàng" value={stats.totalOrders} icon={ShoppingCart} description="Toàn thời gian" />
              <StatCard title="Khách hàng" value={stats.totalUsers} icon={Users} description="Thành viên đã đăng ký" />
              <StatCard title="Doanh thu" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} description="Tổng thu nhập thực tế" />
            </div>
          )}
        </TabsContent>

        {/* SẢN PHẨM */}
        <TabsContent value="products" className="space-y-6 mt-0 outline-none">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-black flex-1">Danh sách Sản phẩm <span className="text-muted-foreground text-lg font-medium">({products.length})</span></h2>
            <div className="flex w-full lg:w-auto gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={productsSearch}
                  onChange={(e) => setProductsSearch(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white dark:bg-card border-border/50 shadow-sm"
                />
              </div>
              <Button disabled className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-5 w-5" /> Thêm mới
              </Button>
            </div>
          </div>
          {loadingProducts ? (
             <div className="h-64 flex items-center justify-center bg-white dark:bg-card rounded-4xl border border-border/50 shadow-sm"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Card className="border-border/50 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden rounded-4xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900">
                    <TableRow>
                      <TableHead className="py-5 px-6 font-black uppercase tracking-widest text-xs">Thông tin sản phẩm</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-xs">Giá bán</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-xs">Tồn kho</TableHead>
                      <TableHead className="text-right px-6 font-black uppercase tracking-widest text-xs">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.filter(p => p.name.toLowerCase().includes(productsSearch.toLowerCase())).map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-border/40">
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                             <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{product.name}</span>
                             <span className="text-[11px] text-muted-foreground font-medium mt-1">Danh mục: {product.category?.name || 'Chưa phân loại'}</span>
                          </div>
                        </TableCell>
                        <TableCell><span className="font-black text-blue-600 dark:text-blue-400">{formatCurrency(product.price)}</span></TableCell>
                        <TableCell>
                          {product.stock <= 0 ? 
                            <Badge variant="destructive" className="rounded-md text-[10px] uppercase font-bold tracking-widest">Hết hàng</Badge> : 
                            <span className="font-bold">{product.stock}</span>
                          }
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-border/60" disabled><Edit className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-border/60" disabled><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {products.filter(p => p.name.toLowerCase().includes(productsSearch.toLowerCase())).length === 0 && (
                      <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium">Không tìm thấy sản phẩm nào.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* ĐƠN HÀNG */}
        <TabsContent value="orders" className="space-y-6 mt-0 outline-none">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-black flex-1">Danh sách Đơn hàng <span className="text-muted-foreground text-lg font-medium">({orders.length})</span></h2>
            <div className="flex w-full lg:w-auto gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm mã đơn hàng..."
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white dark:bg-card border-border/50 shadow-sm"
                />
              </div>
            </div>
          </div>
          {loadingOrders ? (
             <div className="h-64 flex items-center justify-center bg-white dark:bg-card rounded-4xl border border-border/50 shadow-sm"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Card className="border-border/50 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden rounded-4xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900">
                    <TableRow>
                      <TableHead className="py-5 px-6 font-black uppercase tracking-widest text-xs">Mã đơn & Thời gian</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-xs">Trạng thái</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-xs">Tổng thanh toán</TableHead>
                      <TableHead className="text-right px-6 font-black uppercase tracking-widest text-xs">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(o => o.order_number.includes(ordersSearch) || o.status.includes(ordersSearch)).map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-border/40">
                        <TableCell className="py-4 px-6">
                           <div className="flex flex-col">
                             <span className="font-bold text-sm text-slate-900 dark:text-slate-100">#{order.order_number}</span>
                             <span className="text-[11px] text-muted-foreground font-medium mt-1">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                           </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell><span className="font-black text-blue-600 dark:text-blue-400">{formatCurrency(order.total)}</span></TableCell>
                        <TableCell className="text-right px-6">
                          <Button variant="outline" size="sm" className="rounded-xl h-9 border-border/60 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" /> Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.filter(o => o.order_number.includes(ordersSearch) || o.status.includes(ordersSearch)).length === 0 && (
                      <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium">Không tìm thấy đơn hàng nào.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* KHÁCH HÀNG */}
        <TabsContent value="users" className="space-y-6 mt-0 outline-none">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-black flex-1">Danh sách Khách hàng <span className="text-muted-foreground text-lg font-medium">({users.length})</span></h2>
            <div className="flex w-full lg:w-auto gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm tên hoặc email..."
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white dark:bg-card border-border/50 shadow-sm"
                />
              </div>
            </div>
          </div>
          {loadingUsers ? (
             <div className="h-64 flex items-center justify-center bg-white dark:bg-card rounded-4xl border border-border/50 shadow-sm"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Card className="border-border/50 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden rounded-4xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900">
                    <TableRow>
                      <TableHead className="py-5 px-6 font-black uppercase tracking-widest text-xs">Thông tin khách hàng</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-xs">Liên hệ</TableHead>
                      <TableHead className="text-right px-6 font-black uppercase tracking-widest text-xs">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.filter(u => u.full_name.toLowerCase().includes(usersSearch.toLowerCase()) || (u.email && u.email.toLowerCase().includes(usersSearch.toLowerCase()))).map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-border/40">
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                               <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{user.full_name}</span>
                               <span className="text-[11px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1"><Mail className="h-3 w-3"/> {user.email || 'Không có email'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground"/> {user.phone || 'Chưa cập nhật'}</span>
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-border/60" disabled><Edit className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-border/60" disabled><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.filter(u => u.full_name.toLowerCase().includes(usersSearch.toLowerCase()) || (u.email && u.email.toLowerCase().includes(usersSearch.toLowerCase()))).length === 0 && (
                      <TableRow><TableCell colSpan={3} className="h-32 text-center text-muted-foreground font-medium">Không có khách hàng phù hợp.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* DANH MỤC */}
        <TabsContent value="categories" className="space-y-6 mt-0 outline-none">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-black flex-1">Danh mục sản phẩm <span className="text-muted-foreground text-lg font-medium">({categories.length})</span></h2>
            <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 w-full lg:w-auto">
                  <Plus className="mr-2 h-5 w-5" /> Thêm danh mục
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-4xl">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-black">Thêm danh mục mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold" htmlFor="category-name">Tên danh mục</Label>
                    <Input id="category-name" className="rounded-xl h-12" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Ví dụ: Laptop, Smartphone..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <DialogClose asChild><Button type="button" variant="outline" className="rounded-xl h-11 px-6">Hủy</Button></DialogClose>
                    <Button onClick={handleCreateCategory} className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700">Tạo mới</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {loadingCategories ? (
             <div className="h-64 flex items-center justify-center bg-white dark:bg-card rounded-4xl border border-border/50 shadow-sm"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="rounded-4xl border-border/50 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all bg-white dark:bg-slate-900 group">
                  <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                    <div>
                      <h3 className="font-black text-xl mb-1 text-slate-900 dark:text-white">{category.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{category.description || "Chưa có mô tả chi tiết cho danh mục này."}</p>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t border-border/40 mt-auto">
                      <Dialog open={editCategoryOpen && selectedCategory?.id === category.id} onOpenChange={(open) => {
                        if (open) { setSelectedCategory(category); setNewCategoryName(category.name); setEditCategoryOpen(true) } 
                        else { setEditCategoryOpen(false); setSelectedCategory(null) }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-xl h-9 hover:text-blue-600 hover:border-blue-600 transition-colors">
                            <Edit className="h-4 w-4 mr-2" /> Sửa
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-4xl">
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-black">Chỉnh sửa danh mục</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label className="font-bold" htmlFor="edit-category-name">Tên danh mục</Label>
                              <Input id="edit-category-name" className="rounded-xl h-12" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <DialogClose asChild><Button type="button" variant="outline" className="rounded-xl h-11 px-6">Hủy</Button></DialogClose>
                              <Button onClick={handleUpdateCategory} className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700">Lưu cập nhật</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 text-destructive hover:bg-destructive hover:text-white transition-colors" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {categories.length === 0 && (
                <div className="col-span-full h-40 flex items-center justify-center border-2 border-dashed border-border/60 rounded-4xl text-muted-foreground font-medium">
                  Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* DIALOG CHI TIẾT ĐƠN HÀNG */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="rounded-4xl max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-2xl font-black">Chi tiết Đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {selectedOrder && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-border/50 space-y-5">
                <div className="flex justify-between items-center pb-4 border-b border-border/60">
                  <span className="font-bold text-muted-foreground">Mã đơn</span>
                  <span className="font-mono text-lg font-black text-slate-900 dark:text-white">#{selectedOrder.order_number}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/60">
                  <span className="font-bold text-muted-foreground">Trạng thái</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/60">
                  <span className="font-bold text-muted-foreground">Ngày đặt hàng</span>
                  <span className="font-medium text-sm">{new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-muted-foreground">Tổng tiền</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <DialogClose asChild>
                <Button className="rounded-xl h-11 px-8 font-bold">Đóng lại</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )}