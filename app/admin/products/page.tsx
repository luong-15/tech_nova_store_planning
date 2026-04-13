"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Search, Package, ImageIcon } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import type { Product, Category } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [productsPagination, setProductsPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [productsSearch, setProductsSearch] = useState("")
  const [debouncedProductsSearch, setDebouncedProductsSearch] = useState("")
  const [productsCategoryFilter, setProductsCategoryFilter] = useState("all")
  const [productsLoading, setProductsLoading] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // State quản lý việc mở rộng cột trong bảng
  const [expandedSpecs, setExpandedSpecs] = useState<Set<string>>(new Set())

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
    specs: "{}",
  })

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/categories")
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : data?.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true)
      const params = new URLSearchParams({
        page: productsPagination.page.toString(),
        limit: productsPagination.limit.toString(),
      })
      if (debouncedProductsSearch) params.append("search", debouncedProductsSearch)
      if (productsCategoryFilter !== "all") params.append("category_id", productsCategoryFilter)

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()

      setProducts(data.data || [])
      setProductsPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0
      }))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setProductsLoading(false)
    }
  }, [productsPagination.page, productsPagination.limit, debouncedProductsSearch, productsCategoryFilter])

  useEffect(() => { fetchCategories() }, [fetchCategories])
  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedProductsSearch(productsSearch), 500)
    return () => clearTimeout(timer)
  }, [productsSearch])

  const toggleSpecs = (id: string) => {
    const newSet = new Set(expandedSpecs)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setExpandedSpecs(newSet)
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productData = {
        ...productForm,
        price: Number(productForm.price),
        original_price: productForm.original_price ? Number(productForm.original_price) : null,
        discount_price: productForm.discount_price ? Number(productForm.discount_price) : null,
        stock: Number(productForm.stock),
        images: productForm.images.split(",").map(i => i.trim()).filter(i => i !== ""),
        specs: JSON.parse(productForm.specs || "{}")
      }

      const method = selectedProduct ? "PUT" : "POST"
      const response = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct ? { id: selectedProduct.id, ...productData } : productData),
      })

      if (!response.ok) throw new Error("Failed to save")
      setProductDialogOpen(false)
      fetchProducts()
    } catch (error) {
      alert("Lỗi khi lưu sản phẩm: " + error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" })
    fetchProducts()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý kho hàng và thông tin sản phẩm.</p>
        </div>
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedProduct(null)
              setProductForm({
                name: "", description: "", price: "", original_price: "", 
                discount_price: "", stock: "", brand: "", category_id: "",
                image_url: "", images: "", is_featured: false, is_deal: false, specs: "{}"
              })
            }}>
              <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? "Chỉnh sửa" : "Thêm mới"} sản phẩm</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tên sản phẩm</Label>
                  <Input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Giá bán (VND)</Label>
                    <Input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Số lượng kho</Label>
                    <Input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <Select value={productForm.category_id} onValueChange={val => setProductForm({...productForm, category_id: val})}>
                    <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ảnh chính (URL)</Label>
                  <Input value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Thông số kỹ thuật (JSON)</Label>
                  <Textarea className="font-mono text-xs" rows={5} value={productForm.specs} onChange={e => setProductForm({...productForm, specs: e.target.value})} />
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" checked={productForm.is_featured} onCheckedChange={val => setProductForm({...productForm, is_featured: !!val})} />
                    <Label htmlFor="featured">Nổi bật</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="deal" checked={productForm.is_deal} onCheckedChange={val => setProductForm({...productForm, is_deal: !!val})} />
                    <Label htmlFor="deal">Hot Deal</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4">Lưu sản phẩm</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm tên sản phẩm..." className="pl-8" value={productsSearch} onChange={e => setProductsSearch(e.target.value)} />
            </div>
            <Select value={productsCategoryFilter} onValueChange={setProductsCategoryFilter}>
              <SelectTrigger className="w-50"><SelectValue placeholder="Danh mục" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-20">Ảnh</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Thông số</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10"><Skeleton className="h-20 w-full" /></TableCell></TableRow>
                ) : products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded border" />
                      ) : <div className="w-12 h-12 bg-muted rounded flex items-center justify-center"><ImageIcon className="h-4 w-4" /></div>}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.brand}</div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "outline" : "destructive"}>{product.stock} sp</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleSpecs(product.id)}>
                        {expandedSpecs.has(product.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      {expandedSpecs.has(product.id) && (
                        <pre className="mt-2 text-[10px] bg-muted p-2 rounded max-w-50 overflow-x-auto">
                          {JSON.stringify(product.specs, null, 2)}
                        </pre>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => {
                          setSelectedProduct(product)
                          setProductForm({
                            ...product,
                            price: product.price.toString(),
                            original_price: product.original_price?.toString() || "",
                            discount_price: product.discount_price?.toString() || "",
                            stock: product.stock.toString(),
                            images: product.images?.join(", ") || "",
                            specs: JSON.stringify(product.specs, null, 2)
                          } as any)
                          setProductDialogOpen(true)
                        }}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}