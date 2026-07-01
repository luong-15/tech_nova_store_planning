import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// 1. BẮT BUỘC: Ép Next.js vô hiệu hóa hoàn toàn cache cho API route này
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      console.error("No order ID in params");
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    console.log("Checking status for order ID:", id);

    // 2. CHUYỂN DELAY LÊN TRƯỚC KHI QUERY DATABASE
    const delayMs = Number(process.env.ORDER_STATUS_DELAY_MS || 0);
    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }

    // 3. Khởi tạo client và lấy dữ liệu MỚI NHẤT sau khi đã delay
    const supabase = await createServerClient();

    // 3.1 Lấy user hiện tại để đảm bảo phân quyền khi đọc status đơn
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("status, payment_status, order_number")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        status: order.status,
        payment_status: order.payment_status,
        isPaid: order.payment_status === "paid" || order.status === "processing",
        order_id: id,
        order_number: order.order_number,
      },
      {
        // 4. Thêm must-revalidate để báo cho trình duyệt (Browser) không được dùng cache cũ
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      },
    );
  } catch (error) {
    console.error("Order status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}