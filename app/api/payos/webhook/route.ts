import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * PayOS Webhook Handler
 * Endpoint: POST /api/payos/webhook
 * Webhook URL to register in PayOS dashboard: https://your-domain.com/api/payos/webhook
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[v0] PayOS Webhook received - Full payload:", JSON.stringify(body, null, 2));

    // Verify PayOS webhook signature
    const isValid = verifyPayOSSignature(body);

    if (!isValid) {
      console.error("[v0] Invalid PayOS webhook signature - rejecting request");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("[v0] PayOS Webhook signature verified successfully");

    // Destructure webhook data
    const {
      code,
      desc,
      data: {
        orderCode,
        amount,
        amountPaid,
        amountRemaining,
        status,
        transactionDateTime,
      },
    } = body;

    console.log("PayOS Webhook received:", {
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
 * Verify PayOS webhook signature using HMAC-SHA256
 * @param data - The webhook payload
 * @returns boolean - Whether signature is valid
 */
function verifyPayOSSignature(data: any): boolean {
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!checksumKey) {
    console.error("[v0] PAYOS_CHECKSUM_KEY not configured");
    return false;
  }

  // Extract signature and data
  const { signature, code, desc, data: webhookData } = data;

  if (!signature) {
    console.error("[v0] No signature provided in webhook");
    return false;
  }

  if (!webhookData) {
    console.error("[v0] No data object in webhook payload");
    return false;
  }

  const {
    orderCode,
    amount,
    amountPaid,
    amountRemaining,
    status,
    transactionDateTime,
  } = webhookData;

  // PayOS signature verification:
  // Signature = HMAC-SHA256(data string, checksum key)
  // Data string must have fields in ALPHABETICAL order (important!)
  // Format: "amount=VALUE&amountPaid=VALUE&amountRemaining=VALUE&code=VALUE&desc=VALUE&orderCode=VALUE&status=VALUE&transactionDateTime=VALUE"

  // Build data string with fields in alphabetical order
  const dataString = `amount=${amount}&amountPaid=${amountPaid}&amountRemaining=${amountRemaining}&code=${code ?? ""}&desc=${desc ?? ""}&orderCode=${orderCode}&status=${status}&transactionDateTime=${transactionDateTime}`;

  console.log("[v0] PayOS Webhook - Payload structure:");
  console.log("[v0]   signature (from payload):", signature.substring(0, 16) + "...");
  console.log("[v0]   code:", code);
  console.log("[v0]   desc:", desc);
  console.log("[v0]   webhookData keys:", Object.keys(webhookData));
  console.log("[v0]   data string:", dataString);

  const computedSignature = crypto
    .createHmac("sha256", checksumKey)
    .update(dataString)
    .digest("hex");

  console.log("[v0] PayOS Webhook - Computed signature:", computedSignature.substring(0, 16) + "...");
  console.log("[v0] PayOS Webhook - Signature match:", signature === computedSignature);

  if (signature !== computedSignature) {
    console.error("[v0] Signature mismatch!");
    console.error("[v0]   Expected: " + signature);
    console.error("[v0]   Got:      " + computedSignature);
  }

  return signature === computedSignature;

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
