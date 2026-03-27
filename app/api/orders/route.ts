import { NextRequest, NextResponse } from 'next/server'
import { createAdminServerClient, createReadOnlyServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = await createAdminServerClient()
    
    const body = await request.json()

    const {
      items,
      subtotal,
      shipping_fee,
      total,
      shipping_name,
      shipping_email,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      payment_method,
      notes,
      user_id
    } = body

// Get current user for RLS (using read-only client)
    const supabase = createReadOnlyServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    const status = payment_method === 'cod' ? 'processing' : 'pending'

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user?.id || user_id,
        order_number: `TN${Date.now()}`,
        status,
        payment_method,
        subtotal,
        shipping_fee,
        total: Number(total),
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code: shipping_postal_code || null,
        notes: notes || null
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order error:', orderError)
      return NextResponse.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image_url || '',
      quantity: item.quantity,
      price: item.product.price
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Items error:', itemsError)
      return NextResponse.json({ error: 'Items failed', details: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      order_id: order.id,
      order_number: order.order_number
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json({ error: 'Server error', details: (error as Error).message }, { status: 500 })
  }
}

