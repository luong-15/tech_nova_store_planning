import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

// Mock webhook - replace with real bank webhook (TPBank/VietQR gateway)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("VietQR webhook:", body);

    const { order_number, amount, transaction_id, status } = body;

    if (status !== "paid" || !order_number) {
      return NextResponse.json({ success: false, message: "Invalid payment" });
    }

    const supabaseAdmin = await createAdminServerClient();

    // Find order by order_number
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", order_number)
      .eq("total", amount)
      .eq("status", "pending")
      .single();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    // Update order
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "processing",
        payment_status: "paid",
        transaction_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (error) {
      console.error("Webhook update error:", error);
      return NextResponse.json({ success: false, error: error.message });
    }

    console.log(`Payment confirmed for order ${order_number}`);

    return NextResponse.json({ success: true, order_id: order.id });
  } catch (error) {
    console.error("VietQR webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// GET for manual polling/test
export async function GET(request: NextRequest) {
  // Manual poll trigger for testing
  return NextResponse.json({
    message: "Webhook ready. Configure bank/TPBank callback to this URL.",
  });
}
