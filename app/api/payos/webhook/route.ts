import { PayOS } from "@payos/node";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // verify chữ ký payOS
    const webhookData: any = payOS.webhooks.verify(body);
    console.log("PayOS webhook verified:", webhookData);

    // payOS SDK verify() có thể trả về object dạng {code, success, data, signature}
    const payload = (webhookData as any)?.data ?? webhookData;

    const paidOrderCode = (payload as any)?.orderCode;
    const paidAmount = (payload as any)?.amount;
    const webhookCode = (payload as any)?.code ?? (webhookData as any)?.code;

    if (webhookCode === "00") {
      const supabase = await createServerClient();

      const numericPaidOrderCode = Number(paidOrderCode);
      const paidCodeStr =
        paidOrderCode !== undefined && paidOrderCode !== null
          ? String(paidOrderCode).replace(/\D/g, "")
          : undefined;

      if (!paidCodeStr || !Number.isFinite(numericPaidOrderCode)) {
        console.warn("Webhook: missing/invalid orderCode, cannot update orders");
        return NextResponse.json(
          { message: "Webhook received but orderCode missing" },
          { status: 200 },
        );
      }

      const orFilter = `order_number.eq.${paidCodeStr},id.eq.${paidCodeStr},order_number.eq.${numericPaidOrderCode}`;

      const { data: orders, error } = await supabase
        .from("orders")
        .select("id")
        .or(orFilter);

      if (error) {
        console.error("Webhook DB lookup error:", error);
      } else if (orders && orders.length > 0) {
        const ids = orders.map((o) => o.id);
        await supabase
          .from("orders")
          .update({ payment_status: "paid", status: "processing" })
          .in("id", ids);
      } else {
        console.warn("Webhook: order not found for orderCode:", paidOrderCode);
      }

      console.log(`Paid orderCode=${paidOrderCode} amount=${paidAmount}`);
    }


    return NextResponse.json(
      { message: "Webhook received and verified" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Webhook Verification Failed:", error);
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }
}
