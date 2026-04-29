import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (
          id, name, slug, price, image_url, brand, stock, original_price
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, quantity = 1 } = body;

    if (!product_id || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product_id or quantity" },
        { status: 400 },
      );
    }

    // Check product stock
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single();

    if (!product || product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 },
      );
    }

    // Upsert cart item
    const { data, error } = await supabase
      .from("cart_items")
      .upsert(
        { user_id: user.id, product_id, quantity },
        { ignoreDuplicates: false },
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      return NextResponse.json(
        { error: "product_id required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", product_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, quantity } = body;

    if (!product_id || quantity < 1) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check stock
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single();

    if (!product || product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", product_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}
