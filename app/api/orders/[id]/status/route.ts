import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      console.error("No order ID in params:", params);
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    console.log("Checking status for order ID:", id);

    const supabase = await createServerClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("status, payment_status, order_number")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // isPaid when payment_status is "paid" or order status is "processing" (for COD)
    const isPaid = order.payment_status === "paid" || order.status === "processing";

    return NextResponse.json({
      success: true,
      status: order.status,
      payment_status: order.payment_status,
      isPaid,
      order_id: id,
      order_number: order.order_number,
    });
  } catch (error) {
    console.error("Order status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
