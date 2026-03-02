import { NextResponse } from "next/server"
import { createAdminServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = createAdminServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit

    let query = supabase
      .from("orders")
      .select("*", { count: 'exact' })

    // Apply search filter
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,status.ilike.%${search}%`)
    }

    // Apply status filter
    if (status) {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
