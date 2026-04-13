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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit, Trash2, Search, ImageIcon } from "lucide-react"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesSearch, setCategoriesSearch] = useState("")
  const [debouncedCategoriesSearch, setDebouncedCategoriesSearch] = useState("")
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true)
      const response = await fetch("/api/admin/categories")
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : data?.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategoriesSearch(categoriesSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [categoriesSearch])

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = selectedCategory ? "PUT" : "POST"
      const url = "/api/admin/categories"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCategory ? { id: selectedCategory.id, ...categoryForm } : categoryForm),
      })

      if (!response.ok) throw new Error("Failed to save category")

      setCategoryDialogOpen(false)
      setSelectedCategory(null)
      setCategoryForm({ name: "", description: "", image_url: "" })
      fetchCategories() // Refresh list
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return
    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete category")
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(debouncedCategoriesSearch.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(debouncedCategoriesSearch.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh mục</h1>
          <p className="text-muted-foreground">Quản lý các nhóm sản phẩm trong cửa hàng của bạn.</p>
        </div>
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedCategory(null)
              setCategoryForm({ name: "", description: "", image_url: "" })
            }}>
              <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>{selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="VD: Điện thoại, Laptop..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về danh mục..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL hình ảnh</Label>
                <Input
                  id="image_url"
                  value={categoryForm.image_url}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>Hủy</Button>
                <Button type="submit">{selectedCategory ? "Cập nhật" : "Tạo danh mục"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              className="pl-8"
              value={categoriesSearch}
              onChange={(e) => setCategoriesSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Ảnh</TableHead>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead className="hidden md:table-cell">Mô tả</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          {category.image_url ? (
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-10 h-10 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-md border">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
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
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Không tìm thấy danh mục nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}