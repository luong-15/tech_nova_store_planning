import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminServerClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle payment_intent.succeeded
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const orderId = paymentIntent.metadata.order_id

    if (orderId) {
      const supabase = await createAdminServerClient() // Use admin client for webhook

      // Update order payment_status to 'paid' and status to 'processing'
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          status: 'processing'
        })
        .eq('id', orderId)

      if (error) {
        console.error('Failed to update order:', error)
      } else {
        console.log(`Order ${orderId} marked as paid`)
      }
    }
  }

  // Handle payment_intent.payment_failed
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const orderId = paymentIntent.metadata.order_id

    if (orderId) {
      const supabase = await createAdminServerClient()

      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'failed',
          status: 'cancelled'
        })
        .eq('id', orderId)

      if (error) console.error('Failed to update failed order:', error)
    }
  }

  return NextResponse.json({ received: true })
}

