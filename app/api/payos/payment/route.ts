import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * PayOS Payment Initiation Endpoint
 * POST /api/payos/payment
 *
 * Request body:
 * {
 *   order_id: string,
 *   return_url: string (optional)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   payment_url: string (redirect to this URL)
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { order_id, return_url } = body;

    // Validate inputs
    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 },
      );
    }

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order is already paid
    if (order.payment_status === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 },
      );
    }

    // Initialize PayOS payment
    const paymentUrl = generatePayOSPaymentUrl({
      clientId: process.env.PAYOS_CLIENT_ID!,
      apiKey: process.env.PAYOS_API_KEY!,
      checksumKey: process.env.PAYOS_CHECKSUM_KEY!,
      orderCode: order_id,
      amount: order.total,
      description: `Order #${order.order_number}`,
      returnUrl: return_url || `${getBaseUrl(request)}/orders/${order_id}`,
      cancelUrl: `${getBaseUrl(request)}/orders/${order_id}`,
      buyerEmail: user.email || "",
      buyerName: order.shipping_name || "Customer",
      buyerPhone: order.shipping_phone || "",
    });

    // Update order status to pending payment
    await supabase
      .from("orders")
      .update({
        payment_method: "payos",
        payment_status: "pending",
      })
      .eq("id", order_id);

    return NextResponse.json({
      success: true,
      payment_url: paymentUrl,
      order_id,
    });
  } catch (error) {
    console.error("PayOS payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Generate PayOS payment URL
 * For actual implementation, you need PayOS SDK or API call
 * This is a template - adjust based on PayOS API documentation
 */
function generatePayOSPaymentUrl(params: {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  orderCode: string;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
}): string {
  // TODO: Implement actual PayOS SDK integration
  // This is placeholder - refer to PayOS documentation

  // Option 1: Use PayOS SDK (recommended)
  // const payos = new PayOS(params.clientId, params.apiKey, params.checksumKey);
  // const payment = await payos.createPaymentLink({...});
  // return payment.checkoutUrl;

  // Option 2: Direct API call
  // POST to PayOS API endpoint with signature verification

  // For now, return error
  throw new Error(
    "PayOS SDK not configured. Implement based on PayOS API documentation",
  );
}

/**
 * Helper function to get base URL
 */
function getBaseUrl(request: NextRequest): string {
  const { protocol, host } = new URL(request.url);
  return `${protocol}//${host}`;
}

/**
 * Test endpoint to verify payment initiation is ready
 */
export async function GET(request: NextRequest) {
  const hasEnvVars = !!(
    process.env.PAYOS_CLIENT_ID &&
    process.env.PAYOS_API_KEY &&
    process.env.PAYOS_CHECKSUM_KEY
  );

  return NextResponse.json({
    message: "PayOS payment endpoint is active",
    configured: hasEnvVars,
    note: "Implement PayOS SDK integration for full functionality",
  });
}
