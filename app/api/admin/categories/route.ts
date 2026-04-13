import { NextResponse } from "next/server"
import { createAdminServerClient } from "@/lib/supabase/server"

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
    const { id, ...categoryData } = await request.json()

    const { data, error } = await supabase
      .from("categories")
      .update(categoryData)
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAdminServerClient()
    const categoryData = await request.json()

    const { data, error } = await supabase
      .from("categories")
      .insert(categoryData)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
