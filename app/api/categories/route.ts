import { NextResponse } from "next/server";
import { createReadOnlyServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createReadOnlyServerClient();

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
