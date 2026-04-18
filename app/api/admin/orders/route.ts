import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createAdminServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit

    let query = supabase
      .from("orders")
      .select("*, order_items(count)", { count: 'exact' })

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

    const dataWithCounts = data?.map(order => ({
      ...order,
      order_items_count: order.order_items?.[0]?.count || 0,
      customer_name: order.shipping_name || 'Khách lẻ'
    })) || []

    return NextResponse.json({
      data: dataWithCounts,
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

export async function PUT(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const body = await request.json()
    const orderId = body.id
    const { status, payment_status, notes } = body

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const updateData = {
        ...(status && { status }),
        ...(payment_status && { payment_status }),
        ...(notes && { admin_notes: notes }),
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (error) throw error

    revalidatePath('/admin/orders')
    revalidatePath('/api/admin/orders')
    revalidatePath('/dashboard')

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

// export async function DELETE(request: Request) {
//   try {
//     const supabase = await createAdminServerClient()
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get("id")

//     if (!id) {
//       return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
//     }

//     const { error } = await supabase
//       .from("orders")
//       .delete()
//       .eq("id", id)

//     if (error) throw error

//     revalidatePath('/admin/orders')
//     revalidatePath('/api/admin/orders')

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting order:", error)
//     return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
//   }
// }
