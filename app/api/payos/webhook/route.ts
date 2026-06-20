import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { PayOS } from "@payos/node";

/**
 * PayOS Webhook Handler
 * Endpoint: POST /api/payos/webhook
 * Webhook URL to register in PayOS dashboard: https://your-domain.com/api/payos/webhook
 */

// Initialize PayOS SDK
function getPayOS(): PayOS {
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    throw new Error(
      "Missing PayOS environment variables: PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY"
    );
  }

  return new PayOS({
    clientId,
    apiKey,
    checksumKey,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[v0] PayOS Webhook received - Full payload:", JSON.stringify(body, null, 2));

    // Verify PayOS webhook signature using PayOS SDK
    let webhookData;
    try {
      const payos = getPayOS();
      webhookData = await payos.webhooks.verify(body);
      
      if (!webhookData) {
        console.error("[v0] Invalid PayOS webhook signature - rejecting request");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
      
      console.log("[v0] PayOS Webhook signature verified successfully");
    } catch (verifyError) {
      console.error("[v0] PayOS signature verification error:", verifyError);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Extract verified webhook data
    const {
      orderCode,
      amount,
      amountPaid,
      amountRemaining,
      status,
      transactionDateTime,
    } = webhookData;

    console.log("[v0] PayOS Webhook received:", {
      orderCode,
      status,
      amount,
      amountPaid,
    });

    // Update order status in database
    const supabase = await createServerClient();

    // Map PayOS status to your system status
    // PayOS: 0=unpaid, 1=paid, -1=cancelled, -2=refunded
    // System: "pending", "paid", "failed", "cancelled"
    let paymentStatus: "pending" | "paid" | "failed" | "cancelled" = "pending";
    if (status === 0) {
      paymentStatus = "pending";
    } else if (status === -1) {
      paymentStatus = "cancelled";
    } else if (status === -2) {
      paymentStatus = "failed";
    } else if (status === 1) {
      paymentStatus = "paid";
    }

    // Update order payment status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_method: "payos",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderCode);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Return success response to PayOS
    return NextResponse.json({
      code: "00",
      desc: "success",
    });
  } catch (error) {
    console.error("PayOS webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}



/**
 * GET endpoint to verify webhook is active
 * PayOS validator expects a 200 OK response
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Check if this is a test/debug request
    if (searchParams.has("test")) {
      return NextResponse.json({
        status: "webhook active",
        endpoint: "/api/payos/webhook",
        checksum_configured: !!process.env.PAYOS_CHECKSUM_KEY,
        timestamp: new Date().toISOString(),
      });
    }

    // Return 200 OK for webhook verification
    // PayOS sends GET request to validate webhook URL
    return new NextResponse("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("[v0] PayOS webhook GET error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
