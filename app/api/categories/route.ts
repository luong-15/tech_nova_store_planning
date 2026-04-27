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
      console.error("Categories API error:", error);
      throw error;
    }

    console.log("Categories API - Returning", data?.length || 0, "categories");

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching categories in API:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
