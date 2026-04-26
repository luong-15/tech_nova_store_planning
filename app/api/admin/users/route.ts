import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createAdminServerClient();
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // First get user profiles with pagination
    let profilesQuery = supabase
      .from("user_profiles")
      .select("*", { count: "exact" });

    // Apply search filter
    if (search) {
      profilesQuery = profilesQuery.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
      );
    }

    const {
      data: profiles,
      error: profilesError,
      count,
    } = await profilesQuery
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (profilesError) throw profilesError;

    // Get auth users data to include emails (only for the profiles we fetched)
    const userIds = profiles?.map((p: any) => p.id) || [];
    const { data, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) throw authError;

    const authUsers = data?.users || [];

    // Combine profile data with auth email data
    const usersWithEmails =
      profiles?.map((profile: any) => {
        const authUser = authUsers.find((user: any) => user.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || null,
        };
      }) || [];

    return new NextResponse(
      JSON.stringify({
        data: usersWithEmails,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createAdminServerClient();
    const { id, email, ...userData } = await request.json();

    const { data, error } = await supabase
      .from("user_profiles")
      .update(userData)
      .eq("id", id)
      .select();

    if (error) throw error;

    revalidatePath("/admin/users");
    revalidatePath("/api/admin/users");

    return new NextResponse(JSON.stringify(data[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createAdminServerClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Delete from user_profiles first
    const { error: profileError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", id);

    if (profileError) throw profileError;

    // Delete from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) throw authError;

    revalidatePath("/admin/users");
    revalidatePath("/api/admin/users");
    revalidatePath("/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
