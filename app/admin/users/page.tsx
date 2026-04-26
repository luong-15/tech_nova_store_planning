"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notifyError, notifySuccess } from "@/lib/notifications";
import type { UserProfile } from "@/lib/types";

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [usersSearch, setUsersSearch] = useState("");
  const [debouncedUsersSearch, setDebouncedUsersSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams({
        page: usersPagination.page.toString(),
        limit: usersPagination.limit.toString(),
      });

      if (debouncedUsersSearch) {
        params.append("search", debouncedUsersSearch);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      setUsers(data.data || []);
      setUsersPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  }, [usersPagination.page, debouncedUsersSearch]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser?.id,
          ...userForm,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      notifySuccess("Lưu thành công!");
      setUserDialogOpen(false);
      setSelectedUser(null);
      setUserForm({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postal_code: "",
        country: "",
      });

      // Wait then refresh
      setTimeout(() => {
        fetchUsers();
      }, 500);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật người dùng",
        variant: "destructive",
      });
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Effects
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsersSearch(usersSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [usersSearch]);

  const filteredUsers = users.filter(
    (user) =>
      (user.full_name &&
        user.full_name
          .toLowerCase()
          .includes(debouncedUsersSearch.toLowerCase())) ||
      (user.phone &&
        user.phone.toLowerCase().includes(debouncedUsersSearch.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
        <p className="text-muted-foreground">Quản lý thông tin khách hàng</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={usersSearch}
            onChange={(e) => setUsersSearch(e.target.value)}
          />
        </div>
        <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser
                  ? "Chỉnh sửa người dùng"
                  : "Xem thông tin người dùng"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Họ tên</Label>
                  <Input
                    value={userForm.full_name}
                    onChange={(e) =>
                      setUserForm({ ...userForm, full_name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm({ ...userForm, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Email</Label>
                  <Input
                    value={userForm.email}
                    readOnly
                    className="bg-muted/50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    value={userForm.address}
                    onChange={(e) =>
                      setUserForm({ ...userForm, address: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Thành phố</Label>
                  <Input
                    value={userForm.city}
                    onChange={(e) =>
                      setUserForm({ ...userForm, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quốc gia</Label>
                  <Input
                    value={userForm.country}
                    onChange={(e) =>
                      setUserForm({ ...userForm, country: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã bưu điện</Label>
                  <Input
                    value={userForm.postal_code}
                    onChange={(e) =>
                      setUserForm({ ...userForm, postal_code: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUserDialogOpen(false)}
                >
                  Đóng
                </Button>
                <Button type="submit" disabled={!selectedUser}>
                  Cập nhật
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {usersLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name || "-"}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell className="max-w-xs">
                  {user.address || "-"}
                </TableCell>
                <TableCell>{user.city || "-"}</TableCell>
                <TableCell>{user.country || "-"}</TableCell>
                <TableCell>{user.postal_code || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserForm({
                          full_name: user.full_name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          address: user.address || "",
                          city: user.city || "",
                          postal_code: user.postal_code || "",
                          country: user.country || "",
                        });

                        setUserDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(user.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có người dùng phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
