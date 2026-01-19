"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Shield, Globe, Trash2, Loader2, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    orders: true,
    promotions: false,
    newsletter: false,
  })

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp")
      setChangingPassword(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự")
      setChangingPassword(false)
      return
    }

    const supabase = createBrowserClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPasswordSuccess(false), 3000)
    }
    setChangingPassword(false)
  }

  const handleDeleteAccount = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và tùy chọn</p>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Bảo mật</h3>
            <p className="text-sm text-muted-foreground">Đổi mật khẩu tài khoản</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>

          {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-500">Đổi mật khẩu thành công!</p>}

          <Button type="submit" disabled={changingPassword || !newPassword || !confirmPassword}>
            {changingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>
        </form>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Thông báo</h3>
            <p className="text-sm text-muted-foreground">Quản lý cách nhận thông báo</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Thông báo qua Email</p>
              <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cập nhật đơn hàng</p>
              <p className="text-sm text-muted-foreground">Thông báo khi đơn hàng thay đổi trạng thái</p>
            </div>
            <Switch
              checked={notifications.orders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, orders: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Khuyến mãi</p>
              <p className="text-sm text-muted-foreground">Nhận thông tin về các chương trình khuyến mãi</p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Bản tin</p>
              <p className="text-sm text-muted-foreground">Nhận tin tức về sản phẩm mới</p>
            </div>
            <Switch
              checked={notifications.newsletter}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
            />
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Ngôn ngữ & Khu vực</h3>
            <p className="text-sm text-muted-foreground">Cài đặt hiển thị</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ngôn ngữ</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Đơn vị tiền tệ</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="VND">VND - Việt Nam Đồng</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-destructive">Vùng nguy hiểm</h3>
            <p className="text-sm text-muted-foreground">Các thao tác không thể hoàn tác</p>
          </div>
        </div>

        <div className="mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tài khoản
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Xác nhận xóa tài khoản?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Xóa tài khoản
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
