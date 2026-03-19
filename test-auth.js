const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testAuth() {
  try {
    console.log('Testing Supabase connection...')

    // Test basic connection
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Auth error:', error.message)
      return
    }

    console.log('Supabase connection successful')
    console.log('Current session:', data.session ? 'Active' : 'None')

  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

testAuth()
