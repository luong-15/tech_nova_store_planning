"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera, Save, Loader2 } from "lucide-react"
import type { UserProfile } from "@/lib/types"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Việt Nam",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setEmail(user.email || "")
        const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

        if (data && !error) {
          setProfile(data)
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            postal_code: data.postal_code || "",
            country: data.country || "Việt Nam",
          })
        } else {
          // Create or update profile
          const profileData = {
            id: user.id,
            full_name: user.user_metadata?.full_name || "",
            phone: "",
            address: "",
            city: "",
            postal_code: "",
            country: "Việt Nam",
            updated_at: new Date().toISOString(),
          }

          const { data: upsertedProfile, error: upsertError } = await supabase
            .from("user_profiles")
            .upsert(profileData, { onConflict: 'id' })
            .select()
            .single()

          if (upsertedProfile && !upsertError) {
            setProfile(upsertedProfile)
            setFormData({
              full_name: upsertedProfile.full_name || "",
              phone: upsertedProfile.phone || "",
              address: upsertedProfile.address || "",
              city: upsertedProfile.city || "",
              postal_code: upsertedProfile.postal_code || "",
              country: upsertedProfile.country || "Việt Nam",
            })
          } else {
            console.error("Profile upsert error:", upsertError)
          }
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      })

      if (!error) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          {/* Avatar Section */}
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-2xl">
                  {formData.full_name?.charAt(0) || email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold">{formData.full_name || "Chưa cập nhật"}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Thành viên từ {new Date(profile?.created_at || Date.now()).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Quốc gia</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Việt Nam"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Đường ABC, Phường XYZ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Thành phố</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Hồ Chí Minh"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Mã bưu điện</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="700000"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex items-center gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
            {success && <span className="text-sm text-green-500">Cập nhật thành công!</span>}
          </div>
        </div>
      </form>
    </div>
  )
}
