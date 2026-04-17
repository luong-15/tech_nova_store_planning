import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/50">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-3xl border shadow-2xl">
        <div className="text-center">
          <ShieldAlert className="w-24 h-24 mx-auto text-destructive mb-6 opacity-75" />
          <h1 className="text-3xl font-black bg-linear-to-r from-destructive to-destructive/60 bg-clip-text text-transparent mb-4">
            Không có quyền truy cập
          </h1>
          <p className="text-muted-foreground mb-8">
            Bạn cần tài khoản admin để truy cập trang quản trị. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="flex-1">
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="flex-1">
            <Link href="/auth/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

