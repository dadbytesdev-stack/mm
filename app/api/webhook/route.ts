import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import { saveSubscription, deleteSubscription, getSubscription } from '../../../lib/subscriptionStore'
import Stripe from 'stripe'

// Tell Next.js not to parse the body — Stripe needs the raw bytes to verify the signature
export const config = { api: { bodyParser: false } }

// ─── Webhook handler ────────────────────────────────────────────────────────────



export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: unknown) {
    console.error('Webhook signature verification failed:', err)
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    switch (event.type) {

      // ── User completed checkout ──────────────────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId || session.client_reference_id

        if (!userId || !session.subscription) break

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        await saveSubscription(userId, {
          subscriptionId: subscription.id,
          customerId: session.customer as string,
          status: subscription.status,
          currentPeriodEnd: (subscription as unknown as { current_period_end: number }).current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })

        console.log(`✅ Subscription activated for user: ${userId}`)
        break
      }

      // ── Recurring payment succeeded ──────────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as unknown as { subscription: string }).subscription

        if (!subId) break

        const subscription = await stripe.subscriptions.retrieve(subId)
        const userId = subscription.metadata?.userId

        if (!userId) break

        await saveSubscription(userId, {
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          status: subscription.status,
          currentPeriodEnd: (subscription as unknown as { current_period_end: number }).current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })

        console.log(`✅ Invoice paid, subscription renewed for user: ${userId}`)
        break
      }

      // ── Payment failed ───────────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as unknown as { subscription: string }).subscription

        if (!subId) break

        const subscription = await stripe.subscriptions.retrieve(subId)
        const userId = subscription.metadata?.userId

        if (userId) {
          const existing = getSubscription(userId)
          if (existing) {
            await saveSubscription(userId, { ...existing, status: 'past_due' })
          }
        }

        console.log(`⚠️ Payment failed for subscription: ${subId}`)
        break
      }

      // ── Subscription updated (e.g. cancel_at_period_end toggled) ─────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) break

        await saveSubscription(userId, {
          subscriptionId: subscription.id,
          customerId: subscription.customer as string,
          status: subscription.status,
          currentPeriodEnd: (subscription as unknown as { current_period_end: number }).current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        })

        console.log(`🔄 Subscription updated for user: ${userId}`)
        break
      }

      // ── Subscription cancelled / deleted ─────────────────────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await deleteSubscription(userId)
          console.log(`❌ Subscription cancelled for user: ${userId}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error('Error processing webhook event:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
