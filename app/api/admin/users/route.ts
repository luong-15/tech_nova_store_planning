import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();
    const { data: { user } } = await supabaseAdmin.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    // 1. Fetch auth users
    const { data: users, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: limit,
    });

    if (authError) throw authError;
    const authUsers = users.users;

    if (authUsers.length === 0) {
      return NextResponse.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
    }

    // 2. Fetch user profiles
    const userIds = authUsers.map((u) => u.id);
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .in("id", userIds);

    if (profileError) throw profileError;

    // 3. Map profiles by user ID
    const profileMap = (profiles || []).reduce((map, profile) => {
      map[profile.id] = profile;
      return map;
    }, {} as Record<string, any>);

    // 4. Merge data
    let enrichedUsers = authUsers.map((u) => {
      const profile = profileMap[u.id] || {};
      return {
        id: u.id,
        email: u.email,
        full_name: profile.full_name || u.user_metadata?.full_name || "",
        role: u.user_metadata?.role || "user",
        created_at: u.created_at,
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || u.user_metadata?.avatar_url || "",
        address: profile.address || "",
        city: profile.city || "",
        postal_code: profile.postal_code || "",
        country: profile.country || "",
        updated_at: profile.updated_at || null,
      };
    });

    // 5. Lọc kết quả nếu có search (tìm theo tên, email, hoặc sđt)
    if (search) {
      enrichedUsers = enrichedUsers.filter(u => 
        u.full_name.toLowerCase().includes(search) || 
        u.email?.toLowerCase().includes(search) ||
        u.phone.includes(search)
      );
    }

    return NextResponse.json({
      data: enrichedUsers,
      pagination: {
        page,
        limit,
        total: users.total, 
        totalPages: Math.ceil(users.total / limit),
      },
    });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();
    const { data: { user } } = await supabaseAdmin.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, email, ...restBody } = body;

    if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    // Cập nhật Auth Email nếu có
    if (email !== undefined) {
      const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(id, { email });
      if (emailError) throw emailError;
    }

    // Lọc và cập nhật User Profile
    const allowedFields = ['full_name', 'phone', 'avatar_url', 'address', 'city', 'postal_code', 'country'];
    const profilePatch: Record<string, any> = { updated_at: new Date().toISOString() };

    allowedFields.forEach(field => {
      if (restBody[field] !== undefined) {
        profilePatch[field] = restBody[field];
      }
    });

    // Chỉ gọi update DB nếu có ít nhất 1 field ngoài updated_at cần cập nhật
    if (Object.keys(profilePatch).length > 1) {
      const { data: updatedProfile, error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .update(profilePatch)
        .eq("id", id)
        .select()
        .single();

      if (profileError) throw profileError;
      return NextResponse.json({ success: true, data: updatedProfile });
    }

    return NextResponse.json({ success: true, message: "No profile fields to update" });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();
    const { data: { user } } = await supabaseAdmin.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    // Xóa profile trước (nếu không thiết lập ON DELETE CASCADE trong Postgres)
    const { error: profileDeleteError } = await supabaseAdmin.from("user_profiles").delete().eq("id", userId);
    if (profileDeleteError) throw profileDeleteError;

    // Xóa auth user
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authDeleteError) throw authDeleteError;

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}