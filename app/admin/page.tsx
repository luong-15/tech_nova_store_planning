"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Package, ShoppingCart, Users, DollarSign, Edit, Trash2, Eye, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import type { Product, Category, Order, UserProfile } from "@/lib/types"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("products")
  const [productsPagination, setProductsPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [productsSearch, setProductsSearch] = useState("")
  const [debouncedProductsSearch, setDebouncedProductsSearch] = useState("")
  const [productsCategoryFilter, setProductsCategoryFilter] = useState("")
  const [productsLoading, setProductsLoading] = useState(false)
  const [categoriesSearch, setCategoriesSearch] = useState("")
  const [debouncedCategoriesSearch, setDebouncedCategoriesSearch] = useState("")
  const [usersSearch, setUsersSearch] = useState("")
  const [debouncedUsersSearch, setDebouncedUsersSearch] = useState("")
  const [ordersSearch, setOrdersSearch] = useState("")
  const [debouncedOrdersSearch, setDebouncedOrdersSearch] = useState("")
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("")
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [expandedImages, setExpandedImages] = useState<Set<string>>(new Set())
  const [expandedSpecs, setExpandedSpecs] = useState<Set<string>>(new Set())

  const [userForm, setUserForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  })

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    discount_price: "",
    stock: "",
    brand: "",
    category_id: "",
    image_url: "",
    images: "",
    is_featured: false,
    is_deal: false,
    specs: "",
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    console.log("Admin page mounted, fetching stats only")
    fetchStats()
  }, [])

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts()
    }
  }, [productsPagination.page, debouncedProductsSearch, productsCategoryFilter, activeTab])

  useEffect(() => {
    if (activeTab === "categories") {
      fetchCategories()
    }
  }, [debouncedCategoriesSearch, activeTab])

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders()
    }
  }, [ordersPagination.page, debouncedOrdersSearch, ordersStatusFilter, activeTab])

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers()
    }
  }, [usersPagination.page, debouncedUsersSearch, activeTab])

  // Debounce search inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductsSearch(productsSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [productsSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategoriesSearch(categoriesSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [categoriesSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsersSearch(usersSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [usersSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOrdersSearch(ordersSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [ordersSearch])

  const fetchStats = async () => {
    try {
      const statsResponse = await fetch("/api/admin/stats")
      const statsData = await statsResponse.json()
      setStats(statsData)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await fetch("/api/admin/categories")
      const data = await response.json()
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      const params = new URLSearchParams({
        page: ordersPagination.page.toString(),
        limit: ordersPagination.limit.toString(),
      })

      if (ordersSearch) {
        params.append("search", ordersSearch)
      }

      if (ordersStatusFilter && ordersStatusFilter !== "all") {
        params.append("status", ordersStatusFilter)
      }

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      setOrders(data.data || [])
      setOrdersPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }))
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      const params = new URLSearchParams({
        page: usersPagination.page.toString(),
        limit: usersPagination.limit.toString(),
      })

      if (usersSearch) {
        params.append("search", usersSearch)
      }

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      setUsers(data.data || [])
      setUsersPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }))
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setProductsLoading(true)
      const params = new URLSearchParams({
        page: productsPagination.page.toString(),
        limit: productsPagination.limit.toString(),
      })

      if (productsSearch) {
        params.append("search", productsSearch)
      }

      if (productsCategoryFilter) {
        params.append("category_id", productsCategoryFilter)
      }

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()

      setProducts(data.data || [])
      setProductsPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setProductsLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
      discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
      stock: parseInt(productForm.stock),
      category_id: productForm.category_id || null,
      images: productForm.images ? productForm.images.split(",").map(img => img.trim()) : [],
      specs: productForm.specs ? JSON.parse(productForm.specs) : null,
    }

    try {
      const method = selectedProduct ? "PUT" : "POST"
      const url = selectedProduct
        ? "/api/admin/products"
        : "/api/admin/products"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct ? { id: selectedProduct.id, ...productData } : productData),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      const savedProduct = await response.json()

      if (selectedProduct) {
        // Update existing product in state
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? savedProduct : p))
      } else {
        // Add new product to state
        setProducts(prev => [savedProduct, ...prev])
        // Update stats for new product
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }))
      }

      setProductDialogOpen(false)
      setSelectedProduct(null)
      setProductForm({
        name: "",
        description: "",
        price: "",
        original_price: "",
        discount_price: "",
        stock: "",
        brand: "",
        category_id: "",
        image_url: "",
        images: "",
        is_featured: false,
        is_deal: false,
        specs: "",
      })
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = selectedCategory ? "PUT" : "POST"
      const url = selectedCategory
        ? "/api/admin/categories"
        : "/api/admin/categories"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCategory ? { id: selectedCategory.id, ...categoryForm } : categoryForm),
      })

      if (!response.ok) {
        throw new Error("Failed to save category")
      }

      const savedCategory = await response.json()

      if (selectedCategory) {
        // Update existing category in state
        setCategories(prev => prev.map(c => c.id === selectedCategory.id ? savedCategory : c))
      } else {
        // Add new category to state
        setCategories(prev => [savedCategory, ...prev])
      }

      setCategoryDialogOpen(false)
      setSelectedCategory(null)
      setCategoryForm({ name: "", description: "", image_url: "" })
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return

    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Remove product from state
      setProducts(prev => prev.filter(p => p.id !== id))
      // Update stats for deleted product
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      // Remove category from state
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser?.id,
          ...userForm,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      const updatedUser = await response.json()

      // Update existing user in state
      setUsers(prev => prev.map(u => u.id === selectedUser?.id ? { ...u, ...updatedUser } : u))

      setUserDialogOpen(false)
      setSelectedUser(null)
      setUserForm({
        full_name: "",
        phone: "",
        address: "",
        city: "",
        postal_code: "",
        country: "",
      })
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      fetchStats()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-150 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Quản lý toàn bộ website</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Sản phẩm</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Danh mục</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Đơn hàng</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Người dùng</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="space-y-4">
          {productsLoading ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-10 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={productsSearch}
                  onChange={(e) => setProductsSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1 max-w-sm">
                <Select value={productsCategoryFilter} onValueChange={setProductsCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setSelectedProduct(null)
                  setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    original_price: "",
                    discount_price: "",
                    stock: "",
                    brand: "",
                    category_id: "",
                    image_url: "",
                    images: "",
                    is_featured: false,
                    is_deal: false,
                    specs: "",
                  })
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm sản phẩm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid gap-4 md:grid-cols-2 mr-2.5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên sản phẩm</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Thương hiệu</Label>
                      <Input
                        id="brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Giá</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="original_price">Giá gốc</Label>
                      <Input
                        id="original_price"
                        type="number"
                        value={productForm.original_price}
                        onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                        placeholder="Không bắt buộc"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_price">Giá khuyến mãi</Label>
                      <Input
                        id="discount_price"
                        type="number"
                        value={productForm.discount_price}
                        onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                        placeholder="Không bắt buộc"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Tồn kho</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="category">Danh mục</Label>
                      <Select value={productForm.category_id} onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="image_url">URL ảnh chính</Label>
                      <Input
                        id="image_url"
                        value={productForm.image_url}
                        onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="images">URL ảnh phụ (cách nhau bằng dấu phẩy)</Label>
                      <Textarea
                        id="images"
                        value={productForm.images}
                        onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="specs">Thông số kỹ thuật (JSON)</Label>
                      <Textarea
                        id="specs"
                        value={productForm.specs}
                        onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                        placeholder='{"Màn hình": "6.1 inch", "Camera": "12MP"}'
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={productForm.is_featured}
                        onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_featured">Sản phẩm nổi bật</Label>
                    </div>
                    <div className="space-y-2 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_deal"
                        checked={productForm.is_deal}
                        onChange={(e) => setProductForm({ ...productForm, is_deal: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_deal">Deal hot</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit">
                      {selectedProduct ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-50">Tên sản phẩm</TableHead>
                  <TableHead className="min-w-50">Mô tả</TableHead>
                  <TableHead className="min-w-30">Slug</TableHead>
                  <TableHead className="min-w-25">Thương hiệu</TableHead>
                  <TableHead className="min-w-25">Giá</TableHead>
                  <TableHead className="min-w-25">Giá gốc</TableHead>
                  <TableHead className="min-w-20">Tồn kho</TableHead>
                  <TableHead className="min-w-20">Đã bán</TableHead>
                  <TableHead className="min-w-25">Đánh giá</TableHead>
                  <TableHead className="min-w-30">Danh mục</TableHead>
                  <TableHead className="min-w-25">Đặc trưng</TableHead>
                  <TableHead className="min-w-25">Deal hot</TableHead>
                  <TableHead className="min-w-50">Hình ảnh</TableHead>
                  <TableHead className="min-w-62.5">Thông số</TableHead>
                  <TableHead className="min-w-25">Ngày tạo</TableHead>
                  <TableHead className="min-w-30">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium max-w-50">
                      <div className="truncate" title={product.name}>
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-50">
                      <div className="truncate" title={product.description}>
                        {product.description || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono">{product.slug || "-"}</TableCell>
                    <TableCell>{product.brand || "-"}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      {product.original_price ? formatCurrency(product.original_price) : "-"}
                    </TableCell>

                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sold_count || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{product.rating || 0}</span>
                        <span className="text-muted-foreground">({product.review_count || 0})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category ? product.category.name : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_featured ? "default" : "secondary"}>
                        {product.is_featured ? "Có" : "Không"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_deal ? "default" : "secondary"}>
                        {product.is_deal ? "Có" : "Không"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {product.image_url || (product.images && product.images.length > 0) ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const newExpanded = new Set(expandedImages)
                                  if (newExpanded.has(product.id)) {
                                    newExpanded.delete(product.id)
                                  } else {
                                    newExpanded.add(product.id)
                                  }
                                  setExpandedImages(newExpanded)
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                {expandedImages.has(product.id) ? (
                                  <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Thu gọn
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Chi tiết
                                  </>
                                )}
                              </Button>
                              <Badge variant="outline" className="text-xs">
                                {product.image_url ? 1 : 0} + {product.images?.length || 0} ảnh
                              </Badge>
                            </div>
                            {expandedImages.has(product.id) && (
                              <div className="mt-2 border-t pt-2">
                                <div className="flex flex-wrap gap-2">
                                  {product.image_url && (
                                    <div className="text-center">
                                      <img
                                        src={product.image_url}
                                        alt="Ảnh chính"
                                        className="w-16 h-16 object-cover rounded border cursor-pointer"
                                        onClick={() => window.open(product.image_url, '_blank')}
                                      />
                                      <div className="text-xs text-muted-foreground mt-1">Ảnh chính</div>
                                    </div>
                                  )}
                                  {product.images && product.images.map((image, index) => (
                                    <div key={index} className="text-center">
                                      <img
                                        src={image}
                                        alt={`Ảnh phụ ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded border cursor-pointer"
                                        onClick={() => window.open(image, '_blank')}
                                      />
                                      <div className="text-xs text-muted-foreground mt-1">Ảnh phụ {index + 1}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Không có ảnh</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-62.5">
                        {product.specs ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const newExpanded = new Set(expandedSpecs)
                                  if (newExpanded.has(product.id)) {
                                    newExpanded.delete(product.id)
                                  } else {
                                    newExpanded.add(product.id)
                                  }
                                  setExpandedSpecs(newExpanded)
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                {expandedSpecs.has(product.id) ? (
                                  <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Thu gọn
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Chi tiết
                                  </>
                                )}
                              </Button>
                              <Badge variant="outline" className="text-xs">
                                {Object.keys(product.specs).length} thông số
                              </Badge>
                            </div>
                            {expandedSpecs.has(product.id) ? (
                              <div className="mt-2 space-y-1 border-t pt-2">
                                {Object.entries(product.specs).map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="font-medium">{key}:</span> {String(value)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground space-y-0.5">
                                {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                                  <div key={key} className="truncate">
                                    <span className="font-medium">{key}:</span> {String(value)}
                                  </div>
                                ))}
                                {Object.keys(product.specs).length > 3 && (
                                  <div className="text-blue-600">+ {Object.keys(product.specs).length - 3} thông số khác...</div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Không có thông số</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {product.created_at ? new Date(product.created_at).toLocaleDateString('vi-VN') : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProduct(product)
                            setProductForm({
                              name: product.name,
                              description: product.description || "",
                              price: product.price.toString(),
                              original_price: product.original_price?.toString() || "",
                              discount_price: product.discount_price?.toString() || "",
                              stock: product.stock.toString(),
                              brand: product.brand || "",
                              category_id: product.category_id || "",
                              image_url: product.image_url || "",
                              images: product.images?.join(", ") || "",
                              is_featured: product.is_featured || false,
                              is_deal: product.is_deal || false,
                              specs: product.specs ? JSON.stringify(product.specs, null, 2) : "",
                            })
                            setProductDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  value={categoriesSearch}
                  onChange={(e) => setCategoriesSearch(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setSelectedCategory(null)
                  setCategoryForm({ name: "", description: "", image_url: "" })
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm danh mục
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Tên danh mục</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-description">Mô tả</Label>
                    <Textarea
                      id="category-description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-image_url">URL hình ảnh</Label>
                    <Input
                      id="category-image_url"
                      value={categoryForm.image_url}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit">
                      {selectedCategory ? "Cập nhật" : "Thêm"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                .filter(category =>
                  category.name.toLowerCase().includes(debouncedCategoriesSearch.toLowerCase()) ||
                  (category.description && category.description.toLowerCase().includes(debouncedCategoriesSearch.toLowerCase()))
                )
                .map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.image_url ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded border cursor-pointer"
                          onClick={() => window.open(category.image_url, '_blank')}
                        />
                      </div>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Không có ảnh</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(category)
                          setCategoryForm({
                            name: category.name,
                            description: category.description || "",
                            image_url: category.image_url || "",
                          })
                          setCategoryDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1 max-w-sm">
                <Select value={ordersStatusFilter} onValueChange={setOrdersStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Đang chờ</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                    <SelectItem value="shipped">Đã giao hàng</SelectItem>
                    <SelectItem value="delivered">Đã giao</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders
                .filter(order => {
                  const matchesSearch = order.order_number.toLowerCase().includes(debouncedOrdersSearch.toLowerCase()) ||
                    order.status.toLowerCase().includes(debouncedOrdersSearch.toLowerCase())
                  const matchesStatus = ordersStatusFilter === "all" || ordersStatusFilter === "" || order.status === ordersStatusFilter
                  return matchesSearch && matchesStatus
                })
                .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="user-full_name">Họ tên</Label>
                    <Input
                      id="user-full_name"
                      value={userForm.full_name}
                      onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-phone">Số điện thoại</Label>
                    <Input
                      id="user-phone"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="user-address">Địa chỉ</Label>
                    <Input
                      id="user-address"
                      value={userForm.address}
                      onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-city">Thành phố</Label>
                    <Input
                      id="user-city"
                      value={userForm.city}
                      onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-country">Quốc gia</Label>
                    <Input
                      id="user-country"
                      value={userForm.country}
                      onChange={(e) => setUserForm({ ...userForm, country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-postal_code">Mã bưu điện</Label>
                    <Input
                      id="user-postal_code"
                      value={userForm.postal_code}
                      onChange={(e) => setUserForm({ ...userForm, postal_code: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">
                    {selectedUser ? "Cập nhật" : "Thêm"}
                  </Button>
                </div>
              </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thành phố</TableHead>
                <TableHead>Quốc gia</TableHead>
                <TableHead>Mã bưu điện</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter(user =>
                  (user.full_name && user.full_name.toLowerCase().includes(debouncedUsersSearch.toLowerCase())) ||
                  (user.email && user.email.toLowerCase().includes(debouncedUsersSearch.toLowerCase())) ||
                  (user.phone && user.phone.toLowerCase().includes(debouncedUsersSearch.toLowerCase()))
                )
                .map((user) => (
                <TableRow key={user.id || '-'}>
                  <TableCell>{user.full_name || '-'}</TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{user.address || '-'}</TableCell>
                  <TableCell>{user.city || '-'}</TableCell>
                  <TableCell>{user.country || '-'}</TableCell>
                  <TableCell>{user.postal_code || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setUserForm({
                            full_name: user.full_name || "",
                            phone: user.phone || "",
                            address: user.address || "",
                            city: user.city || "",
                            postal_code: user.postal_code || "",
                            country: user.country || "",
                          })
                          setUserDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}
