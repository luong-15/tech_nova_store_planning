"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createBrowserClient } from "@/lib/supabase/client";
import { SectionTitle } from "@/components/animations/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Map,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Việt Nam",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setProfile(data);
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            postal_code: data.postal_code || "",
            country: data.country || "Việt Nam",
          });
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
          };

          const { data: upsertedProfile, error: upsertError } = await supabase
            .from("user_profiles")
            .upsert(profileData, { onConflict: "id" })
            .select()
            .single();

          if (upsertedProfile && !upsertError) {
            setProfile(upsertedProfile);
            setFormData({
              full_name: upsertedProfile.full_name || "",
              phone: upsertedProfile.phone || "",
              address: upsertedProfile.address || "",
              city: upsertedProfile.city || "",
              postal_code: upsertedProfile.postal_code || "",
              country: upsertedProfile.country || "Việt Nam",
            });
          } else {
            console.error("Profile upsert error:", upsertError);
          }
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    }
    setSaving(false);
  };

  // Giao diện Loading Skeleton đồng bộ với layout mới
  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-75 w-full md:w-1/3 rounded-xl" />
          <div className="w-full md:w-2/3 space-y-6">
            <Skeleton className="h-87.5 w-full rounded-xl" />
            <Skeleton className="h-87.5 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý thông tin tài khoản và địa chỉ giao hàng của bạn.
        </p>
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* CỘT TRÁI: THÔNG TIN NHANH & AVATAR */}
        <div className="w-full md:w-1/3 md:sticky md:top-24">
          <Card className="overflow-hidden border-border/50 shadow-sm">
            {/* Ảnh Cover nhỏ phía trên */}
            <div className="h-24 bg-linear-to-r from-primary/10 via-primary/5 to-transparent w-full" />

            <CardContent className="px-6 pb-6 pt-0 flex flex-col items-center text-center -mt-12">
              <div className="relative group rounded-full">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/5 text-3xl font-semibold text-primary">
                    {formData.full_name?.charAt(0) ||
                      email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Nút Upload Avatar hiện khi Hover */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200">
                  <Camera className="w-6 h-6" />
                  {/* Nếu sau này bạn làm tính năng upload ảnh, bắt file ở input này */}
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              <h3 className="mt-4 text-xl font-semibold tracking-tight">
                {formData.full_name || "Thành viên mới"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{email}</p>

              <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                Tham gia{" "}
                {new Date(profile?.created_at || Date.now()).toLocaleDateString(
                  "vi-VN",
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CỘT PHẢI: FORM CẬP NHẬT */}
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thẻ 1: Thông tin cơ bản */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Tên và thông tin liên lạc chính của bạn.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="full_name"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <User className="w-4 h-4" /> Họ và tên
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                    className="bg-background/50 focus-visible:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-muted/50 cursor-not-allowed opacity-70"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Phone className="w-4 h-4" /> Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Ví dụ: 0901234567"
                    className="bg-background/50 focus-visible:bg-background max-w-md"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thẻ 2: Địa chỉ giao hàng */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Địa chỉ giao hàng</CardTitle>
                <CardDescription>
                  Nơi chúng tôi sẽ gửi đơn hàng đến cho bạn.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label
                    htmlFor="address"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <MapPin className="w-4 h-4" /> Địa chỉ cụ thể
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Số nhà, Tên đường, Phường/Xã..."
                    className="bg-background/50 focus-visible:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Building2 className="w-4 h-4" /> Tỉnh / Thành phố
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Hồ Chí Minh"
                    className="bg-background/50 focus-visible:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="postal_code"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Map className="w-4 h-4" /> Mã bưu điện (Zip)
                  </Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) =>
                      setFormData({ ...formData, postal_code: e.target.value })
                    }
                    placeholder="700000"
                    className="bg-background/50 focus-visible:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Globe className="w-4 h-4" /> Quốc gia
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="Việt Nam"
                    className="bg-background/50 focus-visible:bg-background"
                  />
                </div>
              </CardContent>

              {/* Khu vực Nút Lưu Tách Biệt */}
              <CardFooter className="bg-muted/30 border-t border-border/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-medium h-5">
                  {success ? (
                    <span className="text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                      <CheckCircle2 className="w-4 h-4" /> Đã lưu thay đổi thành
                      công!
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-normal">
                      Vui lòng kiểm tra lại thông tin trước khi lưu.
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto min-w-35"
                >
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
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
