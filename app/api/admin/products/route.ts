import { NextResponse } from "next/server"
import { createAdminServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = createAdminServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("category_id") || ""

    const offset = (page - 1) * limit

    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(id, name)
      `, { count: 'exact' })

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`)
    }

    // Apply category filter
    if (categoryId) {
      query = query.eq("category_id", categoryId)
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
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createAdminServerClient()
    const { id, ...productData } = await request.json()

    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)
      .select(`
        *,
        category:categories(id, name)
      `)

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminServerClient()
    const productData = await request.json()

    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select(`
        *,
        category:categories(id, name)
      `)

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createAdminServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
