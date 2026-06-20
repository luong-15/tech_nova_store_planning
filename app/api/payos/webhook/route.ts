import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

// PayOS requires verifying `signature` (checksum) using PAYOS_CHECKSUM_KEY.
// Docs: https://payos.vn/docs (checksum = HMAC-SHA256 over sorted payload)
//
// SETUP INSTRUCTIONS:
// 1. In PayOS Dashboard: Settings > Webhook Configuration
// 2. Set Webhook URL to: https://your-domain.com/api/payos/webhook
// 3. Make sure your domain is publicly accessible
// 4. Test webhook from PayOS dashboard
//
// TROUBLESHOOTING 401 ERROR:
// If you get "Request failed with status code 401", the signature verification failed.
// This usually means:
// - PAYOS_CHECKSUM_KEY in .env.local doesn't match your PayOS Dashboard key
// - Check PayOS Dashboard > Settings > API Key/Checksum Key
// - Make sure you copied the EXACT checksum key (case-sensitive)
//
// Debug tips:
// - Check server logs for "[PayOS Webhook]" messages
// - Look for signature mismatch details in logs
// - Verify .env.local has correct PAYOS_CHECKSUM_KEY value

function stableStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return JSON.stringify(obj.map(stableStringify));
  const keys = Object.keys(obj).sort();
  const out: any = {};
  for (const k of keys) out[k] = stableStringify(obj[k]);
  return JSON.stringify(out);
}

async function isSignatureValid(
  body: any,
  signature: string | undefined,
): Promise<boolean> {
  if (!PAYOS_CHECKSUM_KEY) {
    console.error("[PayOS Webhook] PAYOS_CHECKSUM_KEY not configured");
    return false;
  }
  if (!signature) {
    console.error("[PayOS Webhook] No signature provided in request body");
    return false;
  }

  // PayOS signature is calculated over request body excluding signature
  // by HMAC-SHA256 using Node.js crypto module
  const payload = { ...body };
  delete payload.signature;

  const message = stableStringify(payload);

  try {
    console.log("[PayOS Webhook] Signature calculation details:", {
      checksumKeyLength: PAYOS_CHECKSUM_KEY.length,
      messageToHash: message.substring(0, 100) + "...",
      receivedSignature: signature.substring(0, 20) + "...",
    });

    // Use Node.js crypto for server-side signing
    const hmac = crypto.createHmac("sha256", PAYOS_CHECKSUM_KEY);
    hmac.update(message);
    const sigHex = hmac.digest("hex");

    const isValid = sigHex === signature;
    console.log(
      `[PayOS Webhook] Signature validation: ${isValid ? "✓ VALID" : "✗ INVALID"}`,
    );

    if (!isValid) {
      console.log("[PayOS Webhook] Signature mismatch:");
      console.log(`  Calculated: ${sigHex}`);
      console.log(`  Received:   ${signature}`);
      console.log(`  Message (first 200 chars): ${message.substring(0, 200)}`);
    }

    return isValid;
  } catch (err) {
    console.error("[PayOS Webhook] Signature verification error:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(`[PayOS Webhook] ============ WEBHOOK RECEIVED ============`);
    console.log(`[PayOS Webhook] Payload overview:`, {
      code: body?.code,
      success: body?.success,
      orderCode: body?.data?.orderCode,
      amount: body?.data?.amount,
      hasSignature: !!body?.signature,
    });
    console.log(
      `[PayOS Webhook] Full request body:`,
      JSON.stringify(body, null, 2),
    );

    const signature = body?.signature;

    // Verify signature
    if (!(await isSignatureValid(body, signature))) {
      console.error("[PayOS Webhook] ✗ WEBHOOK REJECTED - Invalid signature");
      console.error("[PayOS Webhook] Possible causes:");
      console.error(
        "  1. PAYOS_CHECKSUM_KEY in .env.local doesn't match PayOS Dashboard",
      );
      console.error(
        "  2. Request body was modified before reaching this endpoint",
      );
      console.error(
        "  3. PayOS signature calculation method differs from expected",
      );
      return NextResponse.json(
        {
          success: false,
          message: "Invalid signature",
          hint: "Check PAYOS_CHECKSUM_KEY in .env.local matches PayOS Dashboard settings",
        },
        { status: 401 },
      );
    }

    const data = body?.data;
    const code = body?.code;
    const success = body?.success;

    console.log(
      `[PayOS Webhook] Verified webhook. Code: ${code}, Success: ${success}`,
    );

    // Handle different PayOS response codes
    // code: "00" = success, other codes = various error states
    if (code !== "00") {
      console.warn(`[PayOS Webhook] PayOS returned error code: ${code}`);
      return NextResponse.json(
        { success: false, message: `PayOS error code: ${code}` },
        { status: 400 },
      );
    }

    if (success !== true) {
      console.warn(`[PayOS Webhook] success flag is false`);
      return NextResponse.json(
        { success: false, message: "Payment not successful" },
        { status: 400 },
      );
    }

    if (!data) {
      console.error("[PayOS Webhook] Missing data in payload");
      return NextResponse.json(
        { success: false, message: "Missing data in payload" },
        { status: 400 },
      );
    }

    const orderCode = data.orderCode;
    const amount = data.amount;
    const reference = data.reference; // Payment reference from PayOS
    const transactionDateTime = data.transactionDateTime;

    if (!orderCode) {
      console.error("[PayOS Webhook] Missing orderCode");
      return NextResponse.json(
        { success: false, message: "Missing orderCode" },
        { status: 400 },
      );
    }

    console.log(
      `[PayOS Webhook] Processing payment for order: ${orderCode}, Amount: ${amount}VND`,
    );

    const supabaseAdmin = await createAdminServerClient();

    // Find order by order_number
    const { data: order, error: findErr } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total, status, payment_status")
      .eq("order_number", orderCode)
      .eq("status", "pending")
      .single();

    if (findErr || !order) {
      console.error(
        `[PayOS Webhook] Order not found for code: ${orderCode}`,
        findErr,
      );
      return NextResponse.json(
        { success: false, message: "Order not found or already processed" },
        { status: 404 },
      );
    }

    // Verify amount matches
    const expectedAmount = Math.round(Number(order.total));
    if (amount !== expectedAmount) {
      console.error(
        `[PayOS Webhook] Amount mismatch for order ${orderCode}: expected ${expectedAmount}, got ${amount}`,
      );
      return NextResponse.json(
        { success: false, message: "Amount mismatch" },
        { status: 400 },
      );
    }

    console.log(`[PayOS Webhook] Updating order ${order.id} to paid status`);

    // Update order status to processing and mark as paid
    const { error: updateErr } = await supabaseAdmin
      .from("orders")
      .update({
        status: "processing",
        payment_status: "paid",
        transaction_id: reference || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateErr) {
      console.error("[PayOS Webhook] Failed to update order:", updateErr);
      return NextResponse.json(
        { success: false, error: updateErr.message },
        { status: 500 },
      );
    }

    console.log(
      `[PayOS Webhook] ✓ Order ${order.id} (${orderCode}) successfully marked as paid`,
    );

    return NextResponse.json({
      success: true,
      order_id: order.id,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("[PayOS Webhook] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
