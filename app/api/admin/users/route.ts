import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: limit,
    });

    if (error) throw error;

    // Get user IDs
    const userIds = users.users.map((u) => u.id);

    // Fetch user profiles with additional information
    let query = supabaseAdmin
      .from("user_profiles")
      .select("*")
      .in("id", userIds);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: profiles } = await query;

    // Map profiles by user ID for easy lookup
    const profileMap = (profiles || []).reduce(
      (map, profile) => {
        map[profile.id] = profile;
        return map;
      },
      {} as Record<string, any>,
    );

    // Merge auth users with profile data
    const enrichedUsers = users.users.map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.user_metadata?.full_name || "",
      phone: u.user_metadata?.phone || "",
      role: u.user_metadata?.role || "user",
      created_at: u.created_at,
      // Add profile data
      address: profileMap[u.id]?.address || "",
      city: profileMap[u.id]?.city || "",
      postal_code: profileMap[u.id]?.postal_code || "",
      country: profileMap[u.id]?.country || "",
      updated_at: profileMap[u.id]?.updated_at || null,
    }));

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
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, full_name, email, phone, address, city, postal_code, country } =
      body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Update user profile in user_profile table
    const { data: updatedProfile, error: profileError } = await supabaseAdmin
      .from("user_profile")
      .update({
        full_name,
        email,
        phone,
        address,
        city,
        postal_code,
        country,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (profileError) throw profileError;

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Delete user profile
    await supabaseAdmin.from("user_profile").delete().eq("id", userId);

    // Delete auth user
    await supabaseAdmin.auth.admin.deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
