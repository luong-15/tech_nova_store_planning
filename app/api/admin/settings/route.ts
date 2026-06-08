import { NextResponse } from "next/server";
import { createAdminServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createAdminServerClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "global")
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data || {});
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAdminServerClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("settings")
      .upsert({
        id: "global",
        ...body,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
