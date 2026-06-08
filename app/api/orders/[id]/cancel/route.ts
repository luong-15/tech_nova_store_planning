import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: orderId } = await params;

    if (!orderId) {
      console.log("Params:", params);
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const supabaseAdmin = await createServerClient();

    // Get current user
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find order
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check belongs to user
    if (user.id !== order.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow cancel unpaid + not cancelled
    if (order.payment_status === "paid" || order.status === "cancelled") {
      return NextResponse.json(
        { error: "Cannot cancel this order" },
        { status: 400 },
      );
    }

    // Update order - no .single() to avoid JSON coerce error
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "cancelled",
        payment_status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Cancel order error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Cancel API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
