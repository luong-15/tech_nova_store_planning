import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser();

    // Check if admin (extend UserProfile role)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Stats query
    const [ordersRes, productsRes, usersRes] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("total, count", { count: "exact", head: true }),
      supabaseAdmin
        .from("products")
        .select("count", { count: "exact", head: true }),
      supabaseAdmin.auth.admin
        .listUsers()
        .then((users) => ({ count: users.data.users.length })),
    ]);

    const totalRevenue = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("payment_status", "paid");

    const stats = {
      totalOrders: ordersRes.count || 0,
      totalProducts: productsRes.count || 0,
      totalUsers: usersRes.count || 0,
      totalRevenue:
        totalRevenue.data?.reduce(
          (sum: number, order: any) => sum + (order.total || 0),
          0,
        ) || 0,
      avgOrderValue:
        (ordersRes.count || 1) > 0
          ? (totalRevenue.data?.reduce(
              (sum: number, order: any) => sum + (order.total || 0),
              0,
            ) || 0) / (ordersRes.count || 1)
          : 0,
      pendingOrders: await supabaseAdmin
        .from("orders")
        .select("count")
        .eq("status", "pending")
        .single()
        .then((res) => res.count || 0),
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
