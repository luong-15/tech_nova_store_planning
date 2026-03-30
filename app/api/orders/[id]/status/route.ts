import { NextRequest, NextResponse } from 'next/server'
import { createAdminServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params
    const orderId = parseInt(paramId)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const supabase = await createAdminServerClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const isPaid = order.status === 'paid' || order.status === 'processing'

    return NextResponse.json({
      success: true,
      status: order.status,
      isPaid,
      order_id: orderId
    })
  } catch (error) {
    console.error('Order status error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

