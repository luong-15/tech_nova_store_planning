import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { PayOS } from "@payos/node";

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
 *   qr_code: string (base64 or URL),
 *   order_id: string,
 *   order_number: string,
 *   amount: number,
 *   instructions: string
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

    // Initialize PayOS payment and get QR code
    let paymentData: PayOSPaymentData;
    try {
      paymentData = await generatePayOSQRCode({
        clientId: process.env.PAYOS_CLIENT_ID!,
        apiKey: process.env.PAYOS_API_KEY!,
        checksumKey: process.env.PAYOS_CHECKSUM_KEY!,
        orderCode: Number(order_id),
        amount: order.total,
        description: `Order #${order.order_number}`,
        returnUrl: return_url || `${getBaseUrl(request)}/orders/${order_id}`,
        cancelUrl: `${getBaseUrl(request)}/orders/${order_id}`,
        buyerEmail: user.email || "",
        buyerName: order.shipping_name || "Customer",
        buyerPhone: order.shipping_phone || "",
      });
    } catch (sdkError) {
      console.error("PayOS SDK error:", sdkError);
      return NextResponse.json(
        {
          error: "PayOS SDK not configured",
          details: (sdkError as Error).message,
        },
        { status: 500 },
      );
    }

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
      qr_code: paymentData.qr_code,
      order_id,
      order_number: order.order_number,
      amount: order.total,
      instructions: paymentData.instructions,
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
 * PayOS Payment Data interface
 */
interface PayOSPaymentData {
  qr_code: string;
  instructions: string;
}

/**
 * Generate PayOS QR Code
 */
async function generatePayOSQRCode(params: {
  clientId: string;
  apiKey: string;
  checksumKey: string;
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
}): Promise<PayOSPaymentData> {
  try {
    const payos = new PayOS({
      clientId: params.clientId,
      apiKey: params.apiKey,
      checksumKey: params.checksumKey,
    });

    // Create payment link
    const paymentLink = await payos.paymentRequests.create({
      orderCode: params.orderCode,
      // PayOS expects orderCode as number (per PayOS SDK typings)
      amount: Math.round(parseFloat(String(params.amount))), // Ensure amount is integer in VND
      description: params.description,
      returnUrl: params.returnUrl,
      cancelUrl: params.cancelUrl,
      buyerEmail: params.buyerEmail,
      buyerName: params.buyerName,
      buyerPhone: params.buyerPhone,
    });

    console.log("[v0] PayOS payment link created:", {
      orderCode: params.orderCode,
      amount: params.amount,
      checkoutUrl: paymentLink.checkoutUrl?.substring(0, 50) + "...",
    });

    return {
      qr_code: paymentLink.qrCode || paymentLink.checkoutUrl || "",
      instructions:
        "Quét mã QR hoặc nhấp vào liên kết thanh toán để hoàn tất giao dịch",
    };
  } catch (error) {
    console.error("[v0] PayOS SDK error:", error);
    throw error;
  }
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
    message: "Điểm cuối thanh toán PayOS đang hoạt động",
    configured: hasEnvVars,
    status: hasEnvVars ? "ready" : "incomplete",
    timestamp: new Date().toISOString(),
  });
}
