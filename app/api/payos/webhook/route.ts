import { PayOS } from "@payos/node";
import { NextResponse } from "next/server";
// Dùng createClient gốc của Supabase, KHÔNG dùng createServerClient ở webhook
import { createClient } from "@supabase/supabase-js"; 

const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID || "",
  apiKey: process.env.PAYOS_API_KEY || "",
  checksumKey: process.env.PAYOS_CHECKSUM_KEY || "",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const webhookData = await payOS.webhooks.verify(body);
    console.log("PayOS webhook verified:", webhookData);

    const payload = (webhookData as any)?.data ?? (webhookData as any);
    const orderCode = Number((payload as any)?.orderCode);
    const amount = Number((payload as any)?.amount);
    const webhookCode = (payload as any)?.code ?? (webhookData as any)?.code;

    if (webhookCode === "00") {
      if (!orderCode || Number.isNaN(orderCode)) {
        console.warn("Webhook: Missing or invalid orderCode", { payload });
        return NextResponse.json(
          { message: "Webhook received but orderCode is invalid" },
          { status: 200 },
        );
      }

      // Khởi tạo Supabase bằng SERVICE_ROLE_KEY để vượt qua RLS
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || "", 
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      // Tìm đơn hàng bằng supabaseAdmin
      const { data: orders, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("payos_order_code", orderCode); 

      if (fetchError) {
        console.error("Webhook DB lookup error:", fetchError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      if (orders && orders.length > 0) {
        const ids = orders.map((o) => o.id);

        // Cập nhật bằng supabaseAdmin
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({ payment_status: "paid", status: "processing" })
          .in("id", ids);

        if (updateError) {
          console.error("Webhook DB update error:", updateError);
        } else {
          console.log(`✅ Successfully updated order. payos_order_code=${orderCode}, amount=${amount}`);
        }
      } else {
        console.warn(`Webhook: No order found matching payos_order_code=${orderCode}`);
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Verification Failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }
}