import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id, amount } = body // amount in smallest unit (VND -> as is since Stripe supports VND)

    // Verify order exists
    // In production, fetch from DB to verify
    // For now, trust client but add checks

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'vnd',
      metadata: {
        order_id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error('Stripe intent error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

