import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

type ReactivateSubscriptionRequestBody = {
  subscription_id: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ReactivateSubscriptionRequestBody = await request.json()
    const { subscription_id } = body

    if (!subscription_id) {
      return NextResponse.json(
        { error: 'Required field: subscription_id' },
        { status: 400 }
      )
    }

    const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || ''

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Stripe service not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    // Reativa a subscription removendo o cancelamento agendado
    const subscription = await stripe.subscriptions.update(subscription_id, {
      cancel_at_period_end: false,
    })

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error('Error in reactivate subscription route:', error)
    const errorMessage: string =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
