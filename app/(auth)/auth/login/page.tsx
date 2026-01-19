"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock, User, Loader2, Zap, Check, X } from "lucide-react"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(signupPassword)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"]
  const strengthLabels = ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else if (data.user) {
        // Show success toast and redirect to dashboard immediately
        toast({
          title: "Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại TechNova.",
        })
        router.push("/")
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng")
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          full_name: signupName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.")
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: "google" | "github") => {
    const supabase = createBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 lg:flex lg:flex-col lg:justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">TechNova</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            Khám phá thế giới
            <br />
            <span className="text-blue-400">công nghệ</span>
          </h1>
          <p className="text-lg text-blue-100/80">
            Đăng nhập để trải nghiệm mua sắm công nghệ tuyệt vời với hàng ngàn sản phẩm chính hãng.
          </p>
        </div>

        <div className="flex items-center gap-8 text-sm text-blue-200/60">
          <span>© 2025 TechNova</span>
          <Link href="#" className="hover:text-white">
            Điều khoản
          </Link>
          <Link href="#" className="hover:text-white">
            Bảo mật
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">TechNova</span>
            </Link>
          </div>

          {/* Tab Switcher with Animation */}
          <div className="relative flex rounded-lg bg-muted p-1">
            <div
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-md bg-background shadow-sm transition-all duration-300 ease-out"
              style={{
                left: activeTab === "login" ? "4px" : "calc(50% + 0px)",
              }}
            />
            <button
              onClick={() => {
                setActiveTab("login")
                setError(null)
                setSuccess(null)
              }}
              className={`relative z-10 flex-1 rounded-md py-2.5 text-sm font-medium transition-colors duration-300 ${
                activeTab === "login" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => {
                setActiveTab("signup")
                setError(null)
                setSuccess(null)
              }}
              className={`relative z-10 flex-1 rounded-md py-2.5 text-sm font-medium transition-colors duration-300 ${
                activeTab === "signup" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500 animate-in fade-in slide-in-from-top-2">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-500 animate-in fade-in slide-in-from-top-2">
              <Check className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: activeTab === "login" ? "translateX(0)" : "translateX(-50%)",
                width: "200%",
              }}
            >
              {/* Login Form */}
              <div className="w-1/2 shrink-0 space-y-6 px-1">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold">Chào mừng trở lại!</h2>
                  <p className="text-muted-foreground">Đăng nhập để tiếp tục mua sắm</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="email@example.com"
                        className="pl-10 bg-transparent"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Mật khẩu</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-transparent"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Hoặc đăng nhập với</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-transparent" onClick={() => handleOAuth("google")}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="bg-transparent" onClick={() => handleOAuth("github")}>
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </div>

              {/* Signup Form */}
              <div className="w-1/2 shrink-0 space-y-6 px-1">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold">Tạo tài khoản mới</h2>
                  <p className="text-muted-foreground">Đăng ký để nhận ưu đãi độc quyền</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="pl-10 bg-transparent"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="email@example.com"
                        className="pl-10 bg-transparent"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-transparent"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupPassword && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Độ mạnh: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Nhập mật khẩu"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      Tôi đồng ý với{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Điều khoản sử dụng
                      </Link>{" "}
                      và{" "}
                      <Link href="#" className="text-primary hover:underline">
                        Chính sách bảo mật
                      </Link>
                    </label>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || !agreeTerms}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng ký...
                      </>
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Hoặc đăng ký với</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-transparent" onClick={() => handleOAuth("google")}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="bg-transparent" onClick={() => handleOAuth("github")}>
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
