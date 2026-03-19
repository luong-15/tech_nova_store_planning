import { NextResponse } from "next/server"
import { createAdminServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createAdminServerClient()

    // Fetch stats
    const [productsRes, ordersRes, usersRes, revenueRes] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("user_profiles").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("total").eq("payment_status", "paid"),
    ])

    const stats = {
      totalProducts: productsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalUsers: usersRes.count || 0,
      totalRevenue: revenueRes.data?.reduce((sum: number, order: any) => sum + order.total, 0) || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
