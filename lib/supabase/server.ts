import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import https from "https"

const customFetch = (url: RequestInfo | URL, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    agent: new https.Agent({
      rejectUnauthorized: false,
    }),
  } as any)
}

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing
          // user sessions.
        }
      },
    },
    global: {
      fetch: customFetch,
    },
  })
}

export const createClient = createServerClient
