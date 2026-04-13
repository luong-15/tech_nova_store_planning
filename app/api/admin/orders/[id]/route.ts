import { NextRequest, NextResponse } from 'next/server'
import { createAdminServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createAdminServerClient()
    const { id } = await params

    console.log('API called with ID:', id)

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url,
            price
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
    }

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('GET order error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params


    const body = await request.json()
    const orderId = id
    const { status, paymentStatus } = body

    const supabaseAdmin = await createAdminServerClient()


    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: status || 'processing',
        paymentStatus: paymentStatus || 'paid',
        updated_at: new Date().toISOString()
      })

      .eq('id', orderId)
      .select()

    if (error) {
      console.error('Update order error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      order: data[0] || null
    })
  } catch (error) {
    console.error('Admin orders PATCH error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


