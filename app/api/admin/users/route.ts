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

    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: limit,
    });

    if (error) throw error;

    return NextResponse.json({
      data: users.users.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || "",
        phone: u.user_metadata?.phone || "",
        role: u.user_metadata?.role || "user",
        created_at: u.created_at,
      })),
      pagination: { page, limit, total: users.total },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
