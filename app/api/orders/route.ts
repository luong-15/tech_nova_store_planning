import { NextRequest, NextResponse } from "next/server";
import {
  createServerClient,
  createAdminServerClient,
  createReadOnlyServerClient,
} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const { data, error, count } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          product:name
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: { page, limit, total: count || 0 },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient();

    const body = await request.json();

    const {
      items,
      subtotal,
      shipping_fee,
      total,
      shipping_name,
      shipping_email,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      payment_method,
      notes,
      user_id,
    } = body;

    console.log(
      "Creating order - frontend user_id:",
      user_id,
      "payment_method:",
      payment_method,
    );

    const status = payment_method === "cod" ? "processing" : "pending";

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user_id, // Trust frontend user_id (already validated in checkout)
        order_number: `TN${Date.now()}`,
        status,
        payment_status: "unpaid",
        payment_method,
        subtotal,
        shipping_fee,
        total: Number(total),
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code: shipping_postal_code || null,
        notes: notes || null,
      })
      .select()
      .single();

    console.log(
      "Order created:",
      order ? order.id : "FAILED",
      orderError?.message,
    );

    if (orderError || !order) {
      console.error("Order error:", orderError);
      return NextResponse.json(
        { error: orderError?.message || "Failed to create order" },
        { status: 500 },
      );
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image_url || "",
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Items error:", itemsError);
      return NextResponse.json(
        { error: "Items failed", details: itemsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
    });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
