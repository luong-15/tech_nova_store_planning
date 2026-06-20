import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
      throw new Error("Missing PayOS environment variables.");
    }

    const { order_id } = await request.json();
    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const supabaseAdmin = await createAdminServerClient();

    // 1. Fetch Order from Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total, status, payment_status")
      .eq("id", order_id)
      .single();

    if (orderError || !order || order.status !== "pending") {
      return NextResponse.json({ error: "Invalid or non-pending order" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "";
    // LƯU Ý: PayOS yêu cầu orderCode phải là số nguyên (number)
    const orderCode = Number(order.order_number); 
    const amount = Math.round(Number(order.total));

    // 2. Prepare PayOS Payload
    const payload = {
      orderCode,
      amount,
      description: `VQRIO${orderCode}`,
      ...(origin && {
        returnUrl: `${origin}/orders/${order_id}/status`,
        cancelUrl: `${origin}/cart`,
      }),
    };

    console.log("[PayOS] Creating transaction:", { orderCode, amount, orderId: order_id });

    // 3. Call PayOS API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const payosResponse = await fetch("https://api.payos.vn/payment-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": PAYOS_API_KEY,
        "x-client-id": PAYOS_CLIENT_ID,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    const data = await payosResponse.json().catch(() => ({}));

    if (!payosResponse.ok) {
      console.error("[PayOS] Creation failed:", { status: payosResponse.status, data });
      return NextResponse.json({ error: "PayOS transaction failed", details: data }, { status: 400 });
    }

    const reference = data?.data?.reference || data?.data?.paymentLinkId || null;
    const paymentLink = data?.data?.checkoutUrl || data?.data?.paymentLink;

    // 4. Update order with transaction reference (nếu có)
    if (reference) {
      await supabaseAdmin
        .from("orders")
        .update({
          transaction_id: reference,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id);
    }

    return NextResponse.json({
      success: true,
      order_id,
      order_number: orderCode,
      payos_reference: reference,
      paymentLink,
      webhook: { status: "configured" },
    });

  } catch (error: any) {
    console.error("[PayOS] create-transaction error:", error.message);
    
    if (error.name === "AbortError" || error.message.includes("ENOTFOUND")) {
      return NextResponse.json({ error: "PayOS API unreachable or timed out." }, { status: 503 });
    }

    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}