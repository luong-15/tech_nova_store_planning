import { PayOS } from "@payos/node";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// Khởi tạo payOS instance
const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id } = body as { order_id?: string };

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: "Missing order_id" },
        { status: 400 },
      );
    }

    const supabase = await createServerClient();

    // Lấy dữ liệu đơn để tạo thanh toán đúng amount và mapping orderCode <-> DB
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, total, payment_status, status")
      .eq("id", order_id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    const amount = Math.round(Number(order.total || 0));
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order total" },
        { status: 400 },
      );
    }

    // payOS yêu cầu orderCode là số và không vượt quá 9007199254740991.
    // Ưu tiên dùng order_number nếu là số; fallback dùng hash đơn theo dạng số.
    const MAX_ORDERCODE = 9007199254740991;
    let orderCode: number;

    if (order.order_number !== null && order.order_number !== undefined) {
      const n = Number(order.order_number);
      orderCode =
        Number.isFinite(n) && n > 0 ? n : parseInt(String(order_id).replace(/\D/g, ""), 10);
    } else {
      orderCode = parseInt(String(order_id).replace(/\D/g, ""), 10);
    }

    if (!orderCode || !Number.isFinite(orderCode) || orderCode <= 0) {
      orderCode = Math.floor(Date.now() / 1000) % 1000000000;
    }

    // Clamp vào đúng giới hạn PayOS.
    orderCode = Math.max(1, Math.min(Math.floor(orderCode), MAX_ORDERCODE));

    // description bị giới hạn tối đa 25 ký tự.
    const rawDescription = `Thanh toán đơn #${order.order_number ?? order_id}`;
    const description = String(rawDescription).slice(0, 25);

    const paymentData = {
      orderCode,
      amount,
      description,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    };

    console.log("PayOS paymentRequests.create payload:", {
      order_id: order.id,
      order_number: order.order_number,
      orderCode,
      amount,
      description,
    });

    const paymentLink = await payOS.paymentRequests.create(paymentData);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
      orderCode,
      amount,
      checkoutUrl: paymentLink.checkoutUrl,
      qr_code: (paymentLink as any).qrCode || paymentLink.checkoutUrl,
      instructions:
        (paymentLink as any).instructions ||
        "Mở link thanh toán và hoàn tất giao dịch.",
      is_payos: true,
    });
  } catch (error) {
    console.error("PayOS Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
