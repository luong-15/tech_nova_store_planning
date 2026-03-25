import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSupabaseSessionContext() {
  const [session, setSession] = useState<any>(null)
  
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    
    return () => subscription?.unsubscribe()
  }, [])
  
  return { data: { session } }
}
