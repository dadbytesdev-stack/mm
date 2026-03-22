import Stripe from 'stripe'

export type SubscriptionRecord = {
  subscriptionId: string
  customerId: string
  status: Stripe.Subscription.Status
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
}

// In-memory store — swap these functions for DB calls (Supabase, PlanetScale, etc.)
// when you're ready for production persistence.
const subscriptionStore = new Map<string, SubscriptionRecord>()

export async function saveSubscription(userId: string, record: SubscriptionRecord) {
  subscriptionStore.set(userId, record)
  // TODO: await db.subscriptions.upsert({ where: { userId }, data: record })
}

export async function deleteSubscription(userId: string) {
  subscriptionStore.delete(userId)
  // TODO: await db.subscriptions.delete({ where: { userId } })
}

export function getSubscription(userId: string): SubscriptionRecord | undefined {
  return subscriptionStore.get(userId)
  // TODO: return await db.subscriptions.findUnique({ where: { userId } })
}
