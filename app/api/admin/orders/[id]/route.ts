import { NextRequest, NextResponse } from 'next/server'
import { createAdminServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const orderId = params.id
    const { status, payment_status } = body

    const supabaseAdmin = await createAdminServerClient()

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: status || 'processing',
        payment_status: payment_status || 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Update order error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      order: data 
    })
  } catch (error) {
    console.error('Admin orders PATCH error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

