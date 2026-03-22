import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // userId is used to link the Stripe customer back to your user.
    // Right now MindMantra is localStorage-only, so we pass a device/session
    // identifier generated on the client. When you add auth (Clerk, NextAuth,
    // Supabase, etc.) replace this with the real user ID from the session.
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // your recurring price ID from Stripe dashboard
          quantity: 1,
        },
      ],
      // Pre-fill email if you have it
      // customer_email: userEmail,

      // Pass userId so the webhook can identify who subscribed
      client_reference_id: userId,
      metadata: { userId },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,

      subscription_data: {
        metadata: { userId },
      },

      // Allow promotional codes
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
