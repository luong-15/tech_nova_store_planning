import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

// NOTE: Placeholder implementation.
// If you have a PayOS SDK installed, replace the HTTP requests below with SDK calls.

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;
const PAYOS_BASE_URL = process.env.PAYOS_BASE_URL || "https://api.payos.vn";

function ensureEnv() {
  if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
    throw new Error(
      "PayOS not configured. Missing PAYOS_CLIENT_ID/PAYOS_API_KEY/PAYOS_CHECKSUM_KEY in env.",
    );
  }
  console.log(`[PayOS] Using API endpoint: ${PAYOS_BASE_URL}`);
}

export async function POST(request: NextRequest) {
  try {
    ensureEnv();

    const body = await request.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const supabaseAdmin = await createAdminServerClient();

    // Fetch order
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total, status, payment_status")
      .eq("id", order_id)
      .single();

    if (!order || order.status !== "pending") {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const amount = Math.round(Number(order.total));
    const orderCode = order.order_number; // per your requirement

    // --- Create PayOS transaction ---
    // PayOS API details depend on your PayOS dashboard configuration.
    // Commonly:
    // POST /payment-requests
    // with body: { orderCode, amount, description, cancelUrl, returnUrl, buyer, items }
    //
    // WEBHOOK SETUP:
    // - PayOS will call /api/payos/webhook with payment status updates
    // - Make sure webhook URL is configured in PayOS Dashboard
    // - See webhook/route.ts for implementation

    // If you have front-end provided URLs, plug them here.
    const origin = request.headers.get("origin") || "";

    // Return URL after successful payment
    const returnUrl = origin
      ? `${origin}/orders/${order_id}/status`
      : undefined;
    // Cancel URL if user cancels payment
    const cancelUrl = origin ? `${origin}/cart` : undefined;

    const payload: Record<string, any> = {
      orderCode,
      amount,
      description: `VQRIO${orderCode}`,
      ...(returnUrl ? { returnUrl } : {}),
      ...(cancelUrl ? { cancelUrl } : {}),
    };

    console.log("[PayOS] Creating transaction for order:", {
      orderCode,
      amount,
      orderId: order_id,
      timestamp: new Date().toISOString(),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    let res;
    try {
      res = await fetch(`${PAYOS_BASE_URL}/payment-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(PAYOS_API_KEY ? { "x-api-key": PAYOS_API_KEY } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error("[PayOS] Network error:", fetchError.message);

      // Check for specific network errors
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            error: "PayOS request timeout (10s)",
            details:
              "The PayOS API server is not responding. Please try again later.",
          },
          { status: 503 },
        );
      }

      if (
        fetchError.code === "ENOTFOUND" ||
        fetchError.message.includes("ENOTFOUND")
      ) {
        return NextResponse.json(
          {
            error: "PayOS API unreachable",
            details: `Cannot connect to ${PAYOS_BASE_URL}. Make sure PAYOS_BASE_URL is correctly configured in .env.local`,
          },
          { status: 503 },
        );
      }

      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[PayOS] Transaction creation failed:", {
        status: res.status,
        data,
      });
      return NextResponse.json(
        { error: "PayOS create transaction failed", details: data },
        { status: 400 },
      );
    }

    console.log("[PayOS] Transaction created successfully:", {
      orderCode,
      reference: data?.data?.reference,
    });

    // Update order with transaction/payment ref if available
    const reference =
      data?.data?.reference ||
      data?.data?.paymentLinkId ||
      data?.data?.transactionId ||
      null;

    if (reference) {
      const { error: updateErr } = await supabaseAdmin
        .from("orders")
        .update({
          transaction_id: reference,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id);

      if (updateErr) {
        console.error("[PayOS] Order update error:", updateErr);
      }
    }

    const paymentLink =
      data?.data?.checkoutUrl ||
      data?.data?.paymentLink ||
      data?.data?.paymentLinkId;

    console.log("[PayOS] Transaction response:", {
      orderCode,
      paymentLink,
      hasCancelUrl: !!cancelUrl,
      hasReturnUrl: !!returnUrl,
    });

    return NextResponse.json({
      success: true,
      order_id,
      order_number: orderCode,
      payos_reference: reference,
      // Some PayOS responses return a paymentLinkId / paymentLink.
      // Frontend should redirect user to this link
      paymentLink,
      // Info for webhook processing
      webhook: {
        status: "configured",
        description: "Payment status will be updated via webhook callback",
      },
    });
  } catch (error) {
    console.error("PayOS create-transaction error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500 },
    );
  }
}
