"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/animations/section-title";
import {
  Bell,
  Lock,
  User,
  Palette,
  LogOut,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { notifySuccess, notifyError } from "@/lib/notifications";
import type { UserProfile } from "@/lib/types";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });
  const [preferences, setPreferences] = useState({
    notifications_email: true,
    notifications_sms: false,
    newsletter: true,
    marketing: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setProfile(profile);
          setFormData({
            full_name: profile.full_name || "",
            email: user.email || "",
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({ full_name: formData.full_name })
          .eq("id", user.id);

        if (error) throw error;
        notifySuccess("Cập nhật thông tin cá nhân thành công");
      }
    } catch (err) {
      notifyError("Lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (err) {
      notifyError("Lỗi khi đăng xuất");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto p-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const settingSections = [
    {
      icon: User,
      title: "Thông tin cá nhân",
      description: "Quản lý tên, email và thông tin liên hệ",
      color: "from-blue-500/10 to-blue-600/5",
    },
    {
      icon: Bell,
      title: "Thông báo",
      description: "Cài đặt cách bạn nhận thông báo",
      color: "from-purple-500/10 to-purple-600/5",
    },
    {
      icon: Lock,
      title: "Bảo mật",
      description: "Quản lý mật khẩu và quyền truy cập",
      color: "from-red-500/10 to-red-600/5",
    },
    {
      icon: Palette,
      title: "Giao diện",
      description: "Tùy chỉnh chủ đề và hiển thị",
      color: "from-green-500/10 to-green-600/5",
    },
  ];

  return (
    <motion.div
      className="space-y-8 max-w-4xl mx-auto p-6 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionTitle className="text-4xl font-bold tracking-tight mb-2">
          Cài đặt tài khoản
        </SectionTitle>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm của bạn
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {settingSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              className={`rounded-2xl border border-border/50 bg-gradient-to-br ${section.color} p-6 cursor-pointer transition-all hover:border-primary/30 hover:shadow-md`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{section.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div>
          <SectionTitle className="text-2xl font-bold mb-1">
            Thông tin cá nhân
          </SectionTitle>
          <p className="text-sm text-muted-foreground">
            Cập nhật tên và email của bạn
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên đầy đủ</label>
            <Input
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Nhập tên của bạn"
              className="rounded-lg h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={formData.email}
              disabled
              className="rounded-lg h-10 bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email không thể thay đổi
            </p>
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full h-10 rounded-lg"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div>
          <SectionTitle className="text-2xl font-bold mb-1">
            Thông báo
          </SectionTitle>
          <p className="text-sm text-muted-foreground">
            Chọn cách bạn muốn nhận thông báo
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "notifications_email",
              label: "Thông báo qua Email",
              desc: "Nhận cập nhật đơn hàng và khuyến mãi qua email",
            },
            {
              key: "notifications_sms",
              label: "Thông báo qua SMS",
              desc: "Nhận thông báo quan trọng qua tin nhắn",
            },
            {
              key: "newsletter",
              label: "Đăng ký bản tin",
              desc: "Nhận tin tức và đề xuất sản phẩm mới",
            },
            {
              key: "marketing",
              label: "Tiếp thị",
              desc: "Nhận thông tin về khuyến mãi và sự kiện",
            },
          ].map((item) => (
            <motion.div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors"
              whileHover={{ x: 4 }}
            >
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={preferences[item.key as keyof typeof preferences]}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    [item.key]: checked,
                  })
                }
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="space-y-4 rounded-2xl border border-red-200/50 dark:border-red-900/20 bg-red-50/30 dark:bg-red-950/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <SectionTitle className="text-lg font-bold mb-1">
              Vùng nguy hiểm
            </SectionTitle>
            <p className="text-sm text-muted-foreground mb-4">
              Các tác vụ này không thể hoàn tác
            </p>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full h-10 rounded-lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
