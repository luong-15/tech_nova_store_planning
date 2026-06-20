import { NextRequest, NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

// Hàm sắp xếp object để chuẩn bị cho việc băm (hash) chữ ký
function stableStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return JSON.stringify(obj.map(stableStringify));
  const keys = Object.keys(obj).sort();
  const out: any = {};
  for (const k of keys) out[k] = stableStringify(obj[k]);
  return JSON.stringify(out);
}

// Hàm xác thực tính hợp lệ của Webhook từ PayOS gửi đến
function isSignatureValid(body: any, signature: string | undefined): boolean {
  if (!PAYOS_CHECKSUM_KEY || !signature) return false;

  const payload = { ...body };
  delete payload.signature;

  try {
    const message = stableStringify(payload);
    const hmac = crypto.createHmac("sha256", PAYOS_CHECKSUM_KEY);
    hmac.update(message);
    const sigHex = hmac.digest("hex");

    return sigHex === signature;
  } catch (err) {
    console.error("[PayOS Webhook] Signature verification error:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    // Xử lý an toàn nếu payload bị trống (Tránh ném lỗi 400 để PayOS không đánh giá URL bị chết)
    if (!body || !body.data) {
      return NextResponse.json(
        { success: true, message: "No data payload, but webhook is alive" }, 
        { status: 200 }
      );
    }

    // 1. Xác thực chữ ký
    // Nếu bị lỗi 401 ở bước test Dashboard, hãy kiểm tra lại PAYOS_CHECKSUM_KEY trong file .env
    if (!isSignatureValid(body, body.signature)) {
      console.error("[PayOS Webhook] Invalid signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" }, 
        { status: 401 } // Riêng lỗi bảo mật sai key thì vẫn nên trả 401
      );
    }

    const { code, success, data } = body;

    // 2. Kiểm tra trạng thái giao dịch
    // Nếu giao dịch thất bại, vẫn trả về 200 để xác nhận đã nhận thông tin, nhưng không xử lý tiếp.
    if (code !== "00" || success !== true) {
      console.warn(`[PayOS Webhook] Payment failed or incomplete. Code: ${code}`);
      return NextResponse.json(
        { success: true, message: "Payment not successful but webhook received" }, 
        { status: 200 }
      );
    }

    const { orderCode, amount, reference } = data;
    const supabaseAdmin = await createAdminServerClient();

    // 3. Tìm đơn hàng
    const { data: order, error: findErr } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total, status")
      .eq("order_number", orderCode)
      .eq("status", "pending")
      .single();

    // ĐÃ SỬA: Luôn trả về 200 để vượt qua bước gửi Test Webhook của PayOS
    if (findErr || !order) {
      console.warn(`[PayOS Webhook] Order not found/processed: ${orderCode}. Ignored.`);
      return NextResponse.json(
        { success: true, message: "Webhook received but order not found or already processed" }, 
        { status: 200 }
      );
    }

    // 4. Xác minh số tiền
    const expectedAmount = Math.round(Number(order.total));
    if (amount !== expectedAmount) {
      console.error(`[PayOS Webhook] Amount mismatch. Expected ${expectedAmount}, got ${amount}`);
      // ĐÃ SỬA: Vẫn trả về 200 để báo với PayOS là "Tôi đã nghe bạn nói"
      return NextResponse.json(
        { success: true, message: "Webhook received but amount mismatched" }, 
        { status: 200 }
      );
    }

    // 5. Cập nhật trạng thái thanh toán
    const { error: updateErr } = await supabaseAdmin
      .from("orders")
      .update({
        status: "processing",
        payment_status: "paid",
        transaction_id: reference || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateErr) throw updateErr;

    console.log(`[PayOS Webhook] ✓ Order ${orderCode} paid in ${Date.now() - startTime}ms`);
    return NextResponse.json(
      { success: true, order_id: order.id, message: "Success" }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error(`[PayOS Webhook] ✗ CRITICAL ERROR:`, error.message);
    return NextResponse.json(
      { success: false, message: "Webhook processing error", error: error.message }, 
      { status: 500 }
    );
  }
}