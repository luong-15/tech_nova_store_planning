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
    const categoryId = searchParams.get("category_id") || ""

    const offset = (page - 1) * limit

    let query = supabase
      .from("products")
      .select("*", { count: 'exact' })

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

    return new NextResponse(JSON.stringify({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const { id, ...productData } = await request.json()

    // Filter optional fields to avoid schema cache errors (null/empty)
    const safeData = {
      name: productData.name,
      description: productData.description || null,
      price: Number(productData.price),
      stock: Number(productData.stock),
      brand: productData.brand || null,
      category_id: productData.category_id || null,
      image_url: productData.image_url || null,
      is_featured: Boolean(productData.is_featured),
      is_deal: Boolean(productData.is_deal),
      ...(productData.original_price && { original_price: Number(productData.original_price) }),
      ...(productData.discount_price && { discount_price: Number(productData.discount_price) }),
      ...(productData.specs && { specs: productData.specs }),
    }

    const { error, data } = await supabase
      .from("products")
      .update(safeData)
      .eq("id", id)
      .select()

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/api/admin/products')
    revalidatePath('/')

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const productData = await request.json()

    const safeData = {
      name: productData.name,
      slug: productData.name.toLowerCase().replace(/ /g, '-'),
      description: productData.description || null,
      price: Number(productData.price),
      stock: Number(productData.stock),
      brand: productData.brand || null,
      category_id: productData.category_id || null,
      image_url: productData.image_url || null,
      is_featured: Boolean(productData.is_featured),
      is_deal: Boolean(productData.is_deal),
      ...(productData.original_price && { original_price: Number(productData.original_price) }),
      ...(productData.discount_price && { discount_price: Number(productData.discount_price) }),
      ...(productData.specs && { specs: productData.specs }),
    }

    const { data: newProduct, error } = await supabase
      .from("products")
      .insert(safeData)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/admin/products')
    revalidatePath('/api/admin/products')
    revalidatePath('/')

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createAdminServerClient()
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

    revalidatePath('/admin/products')
    revalidatePath('/api/admin/products')
    revalidatePath('/')

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
