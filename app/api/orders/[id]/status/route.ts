import { NextRequest, NextResponse } from 'next/server'
import { createAdminServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
const { id } = await params
    if (!id) {
      console.error('No order ID in params:', params)
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
    }

    console.log('Checking status for order ID:', id)

    const supabase = await createAdminServerClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select('status, order_number')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const isPaid = order.status === 'paid' || order.status === 'processing'

    return NextResponse.json({
      success: true,
      status: order.status,
      isPaid,
      order_id: id
    })
  } catch (error) {
    console.error('Order status error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

