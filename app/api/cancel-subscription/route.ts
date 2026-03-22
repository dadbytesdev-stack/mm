import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { getSubscription, saveSubscription } from '../../../lib/subscriptionStore'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const record = getSubscription(userId)

    if (!record) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    // Cancel at period end — user keeps Pro until their billing period expires.
    // To cancel immediately, use: stripe.subscriptions.cancel(record.subscriptionId)
    const updated = await stripe.subscriptions.update(record.subscriptionId, {
      cancel_at_period_end: true,
    })

    await saveSubscription(userId, {
      ...record,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: (updated as unknown as { current_period_end: number }).current_period_end,
    })

    return NextResponse.json({
      success: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: (updated as unknown as { current_period_end: number }).current_period_end,
    })
  } catch (err: unknown) {
    console.error('Cancel subscription error:', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
