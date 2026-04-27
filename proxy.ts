import { createServerClient } from "./lib/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Only protect admin routes
  console.log("[PROXY] Admin route access:", request.nextUrl.pathname);
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(
      "[PROXY] User:",
      user ? `${user.id} role:${user.app_metadata?.role}` : "NO USER",
    );

    if (!user) {
      const redirectUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check user app_metadata role
    if (!user.app_metadata?.role || user.app_metadata.role !== "admin") {
      const redirectUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Allow access
    return NextResponse.next();
  } catch (error) {
    console.error("[PROXY ADMIN ERROR FULL]:", error);
    console.error(
      "[PROXY] Error details:",
      (error as Error).message,
      (error as Error).stack,
    );
    const redirectUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
