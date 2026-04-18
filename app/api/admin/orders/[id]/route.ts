import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
    const { status, payment_status } = body

    const supabaseAdmin = await createAdminServerClient()

    const updateData = { 
        ...(status && { status }),
        ...(payment_status && { payment_status }),
        updated_at: new Date().toISOString()
      };
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select("*")


    if (error) {
      console.error('Update order error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    revalidatePath('/admin/orders')
    revalidatePath('/api/admin/orders')

    return new NextResponse(JSON.stringify({ 
      success: true, 
      order: data[0] || null
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Admin orders PATCH error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

