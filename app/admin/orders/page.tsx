"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, Printer, Search, Package, MapPin, User, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/currency"
import type { Order } from "@/lib/types"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  })
  const [ordersSearch, setOrdersSearch] = useState("")
  const [debouncedOrdersSearch, setDebouncedOrdersSearch] = useState("")
  const [ordersStatusFilter, setOrdersStatusFilter] = useState("all")
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)

  // Hàm lấy màu cho Badge dựa trên trạng thái
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Chờ xử lý", variant: "outline" },
      processing: { label: "Đang xử lý", variant: "secondary" },
      shipped: { label: "Đang giao", variant: "secondary" },
      delivered: { label: "Hoàn thành", variant: "default" },
      cancelled: { label: "Đã hủy", variant: "destructive" },
    }
    const config = statusMap[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
      unpaid: { label: "Chưa TT", variant: "outline" },
      paid: { label: "Đã TT", variant: "default" },
      failed: { label: "Thất bại", variant: "destructive" },
      cancelled: { label: "Hủy", variant: "secondary" },
    }
    const config = statusMap[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
  }

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true)
      const params = new URLSearchParams({
        page: ordersPagination.page.toString(),
        limit: ordersPagination.limit.toString(),
      })

      if (debouncedOrdersSearch) params.append("search", debouncedOrdersSearch)
      if (ordersStatusFilter && ordersStatusFilter !== "all") params.append("status", ordersStatusFilter)

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      setOrders(data.data || [])
      setOrdersPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0
      }))
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setOrdersLoading(false)
    }
  }, [ordersPagination.page, ordersPagination.limit, debouncedOrdersSearch, ordersStatusFilter])

  const updateOrderStatus = async (status: string) => {
    if (!selectedOrder) return
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedOrder(data.order)
        fetchOrders() // Refresh danh sách
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedOrdersSearch(ordersSearch), 500)
    return () => clearTimeout(timer)
  }, [ordersSearch])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi, cập nhật và in hóa đơn đơn hàng.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã đơn hàng..."
                className="pl-8"
                value={ordersSearch}
                onChange={(e) => setOrdersSearch(e.target.value)}
              />
            </div>
            <Select value={ordersStatusFilter} onValueChange={setOrdersStatusFilter}>
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="shipped">Đang giao</SelectItem>
                <SelectItem value="delivered">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>SĐT</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Phương thức TT</TableHead>
                    <TableHead>Trạng thái TT</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Trạng thái DH</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.order_number}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell className="max-w-25 truncate">{order.shipping_name || "Khách lẻ"}</TableCell>
                      <TableCell className="text-xs">{order.shipping_phone || '-'}</TableCell>
                      <TableCell className="max-w-30 truncate text-xs">{order.shipping_address || '-'}</TableCell>
                      <TableCell className="text-xs capitalize">{order.payment_method === 'online' ? 'Online' : 'COD'}</TableCell>
                      <TableCell>{getPaymentBadge(order.payment_status)}</TableCell>
                      <TableCell className="text-xs">{order.order_items_count || 0} sp</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={async () => {
                            const res = await fetch(`/api/admin/orders/${order.id}`)
                            if (res.ok) {
                              const details = await res.json()
                              setSelectedOrder(details)
                              setOrderDialogOpen(true)
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex justify-between items-center pr-6">
              <DialogTitle className="text-2xl">Chi tiết đơn hàng #{selectedOrder?.order_number}</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> In hóa đơn
              </Button>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-8 py-4">
              {/* Thông tin khách hàng & Trạng thái */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Thông tin khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Tên:</strong> {selectedOrder.shipping_name}</div>
                    <div><strong>Email:</strong> {selectedOrder.shipping_email || '-'}</div>
                    <div><strong>SĐT:</strong> {selectedOrder.shipping_phone || '-'}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Địa chỉ giao
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}</div>
                    <div><strong>TP/Thành phố:</strong> {selectedOrder.shipping_city}</div>
                    <div><strong>Mã bưu điện:</strong> {selectedOrder.shipping_postal_code}</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-center text-sm font-medium"><MapPin className="mr-2 h-4 w-4" /> Địa chỉ giao hàng</div>
                    <p className="text-sm">{selectedOrder.shipping_address}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Trạng thái đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Trạng thái hiện tại:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div>
                      <Select defaultValue={selectedOrder.status} onValueChange={updateOrderStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Chờ xử lý</SelectItem>
                          <SelectItem value="processing">Đang xử lý</SelectItem>
                          <SelectItem value="shipped">Đang giao</SelectItem>
                          <SelectItem value="delivered">Hoàn thành</SelectItem>
                          <SelectItem value="cancelled">Hủy đơn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ngày tạo: {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bảng sản phẩm */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center"><Package className="mr-2 h-4 w-4" /> Sản phẩm đã đặt</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
{selectedOrder.order_items?.map((item: any, index: number) => (
                        <TableRow key={item.id || index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {item.product_image && (
                                <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                              )}
                              <div>
                                <div className="font-medium">{item.product_name || item.products?.name || 'N/A'}</div>
                                <div className="text-xs text-muted-foreground">SKU: {item.product_id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right font-semibold text-lg text-primary">{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            Không có sản phẩm
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Tổng kết */}
              <div className="flex justify-end">
                <div className="w-full max-w-75 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính:</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}