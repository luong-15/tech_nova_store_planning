import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

const BANK_CODE = process.env.VIETQR_BANK_CODE;
const ACCOUNT_NO = process.env.VIETQR_ACCOUNT_NO;
const ACCOUNT_NAME = process.env.VIETQR_ACCOUNT_NAME;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, total } = body;

    if (!order_id || !total) {
      return NextResponse.json(
        { error: "Missing order_id or total" },
        { status: 400 },
      );
    }

    // Verify order exists
    const supabaseAdmin = await createAdminServerClient();
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("order_number, total, status")
      .eq("id", order_id)
      .single();

    if (!order || order.status !== "pending") {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    // Generate VietQR URL (compact QR image)
    const amount = Math.round(total); // No decimals for VND QR
    const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${order.order_number || order_id}&accountName=${encodeURIComponent(ACCOUNT_NAME || '')}`;

    return NextResponse.json({
      success: true,
      order_id,
      qr_url: qrUrl,
      bank_code: BANK_CODE,
      account_no: ACCOUNT_NO,
      account_name: ACCOUNT_NAME,
      amount: amount,
      order_number: order.order_number || order_id,
      instructions: "Quét mã QR bằng app ngân hàng để thanh toán",
    });
  } catch (error) {
    console.error("VietQR error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
