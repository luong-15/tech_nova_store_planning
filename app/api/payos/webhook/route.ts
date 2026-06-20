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

    // Verify PayOS webhook signature
    const isValid = verifyPayOSSignature(body);

    if (!isValid) {
      console.error("Invalid PayOS webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

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
    console.error("PAYOS_CHECKSUM_KEY not configured");
    return false;
  }

  // PayOS signature verification:
  // Signature = HMAC-SHA256(data string, checksum key)
  // Data string format: "orderCode=VALUE&amount=VALUE&amountPaid=VALUE&amountRemaining=VALUE&status=VALUE&transactionDateTime=VALUE"

  const {
    data: {
      orderCode,
      amount,
      amountPaid,
      amountRemaining,
      status,
      transactionDateTime,
    },
    signature,
  } = data;

  const dataString = `amount=${amount}&amountPaid=${amountPaid}&amountRemaining=${amountRemaining}&code=${data.code ?? ""}&desc=${data.desc ?? ""}&orderCode=${orderCode}&status=${status}&transactionDateTime=${transactionDateTime}`;

  const computedSignature = crypto
    .createHmac("sha256", checksumKey)
    .update(dataString)
    .digest("hex");

  return signature === computedSignature;

}

/**
 * GET endpoint to verify webhook is active
 * PayOS validator expects a 200 OK response
 */
export async function GET(request: NextRequest) {
  try {
    // Return 200 OK for webhook verification
    // PayOS sends GET request to validate webhook URL
    return new NextResponse("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("PayOS webhook GET error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
