import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createAdminServerClient } from "@/lib/supabase/server"

function serialize(data: any): any {
  return JSON.parse(JSON.stringify(data, (key, value) => 
    value instanceof Date ? value.toISOString() : value
  ))
}

export async function GET() {
  try {
    const supabase = await createAdminServerClient()

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const body = await request.json()
    const id = body.id
    const { name, description, image_url, slug } = body

    if (!id || !name) {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 })
    }

    console.log('[API UPDATE CATEGORY]', { id, name, description: description?.substring(0, 50) + '...' })

    // First check if category exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from("categories")
      .update({ 
        name, 
        description: description || null, 
        image_url: image_url || null,
        slug: slug || name.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      })
      .eq("id", id)

    if (error) {
      console.error('[UPDATE ERROR]', error)
      return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 })
    }

    revalidatePath('/admin/categories')
    revalidatePath('/api/admin/categories')

    // Return updated category
    const { data: updatedCategory } = await supabase
      .from("categories")
      .select('id, name, slug, description, image_url')
      .eq("id", id)
      .single()

    return new NextResponse(JSON.stringify(serialize(updatedCategory)), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    })

  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const categoryData = await request.json()

    const { data: newCategory, error } = await supabase
      .from("categories")
      .insert(categoryData)
      .select('id, name, slug, description, image_url')
      .single()

    if (error) throw error

    revalidatePath('/admin/categories')
    revalidatePath('/api/admin/categories')

    return new NextResponse(JSON.stringify(serialize(newCategory)), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) throw error

    revalidatePath('/admin/categories')
    revalidatePath('/api/admin/categories')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
