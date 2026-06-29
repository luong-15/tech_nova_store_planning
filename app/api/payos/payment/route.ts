import { PayOS } from "@payos/node";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, NEXT_PUBLIC_BASE_URL } = process.env;

const payOS = new PayOS({
  clientId: PAYOS_CLIENT_ID || "",
  apiKey: PAYOS_API_KEY || "",
  checksumKey: PAYOS_CHECKSUM_KEY || "",
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { order_id } = body as { order_id?: string };

    if (!order_id) {
      return NextResponse.json({ success: false, error: "Missing order_id" }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, total, payment_status, status")
      .eq("id", order_id)
      .single();

    if (error || !order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const amount = Math.round(Number(order.total));
    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid order total" }, { status: 400 });
    }

    // 1. Tạo orderCode duy nhất bằng số cho PayOS
    // Dùng timestamp miliseconds (13 số) + random (2 số) = 15 số (an toàn, luôn dưới 16 số của Max Safe Integer)
    const uniqueString = Date.now().toString() + Math.floor(Math.random() * 100).toString().padStart(2, '0');
    const orderCode = Number(uniqueString);

    // 2. BẮT BUỘC: Lưu orderCode vào database trước khi gọi PayOS
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payos_order_code: orderCode })
      .eq("id", order_id);

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      return NextResponse.json({ success: false, error: "Failed to update order code" }, { status: 500 });
    }

    // 3. Rút gọn tên đơn cho vừa mô tả (PayOS giới hạn 25 ký tự)
    const description = `Thanh toan don ${order.order_number}`.substring(0, 25);

    const paymentData = {
      orderCode,
      amount,
      description,
      cancelUrl: `${NEXT_PUBLIC_BASE_URL}/cancel`,
      returnUrl: `${NEXT_PUBLIC_BASE_URL}/success`,
    };

    console.log("PayOS payment payload:", { order_id: order.id, orderCode, amount });

    const paymentLink = await payOS.paymentRequests.create(paymentData);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
      orderCode,
      amount,
      checkoutUrl: paymentLink.checkoutUrl,
      qr_code: (paymentLink as any).qrCode || paymentLink.checkoutUrl,
      instructions: (paymentLink as any).instructions || "Mở link thanh toán và hoàn tất giao dịch.",
      is_payos: true,
    });
  } catch (error) {
    console.error("PayOS Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}