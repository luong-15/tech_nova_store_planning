import { createServerClient } from './lib/supabase/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check user app_metadata role
    if (!user.app_metadata?.role || user.app_metadata.role !== 'admin') {
      const redirectUrl = new URL('/unauthorized', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Allow access
    return NextResponse.next()
  } catch (error) {
    console.error('[ADMIN_MIDDLEWARE_ERROR]:', error)
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ['/admin/:path*']
}
