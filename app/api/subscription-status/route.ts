import { NextRequest, NextResponse } from 'next/server'
import { getSubscription } from '../webhook/route'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const record = getSubscription(userId)

    if (!record) {
      return NextResponse.json({ isPremium: false })
    }

    const isActive = record.status === 'active' || record.status === 'trialing'

    return NextResponse.json({
      isPremium: isActive,
      status: record.status,
      cancelAtPeriodEnd: record.cancelAtPeriodEnd,
      currentPeriodEnd: record.currentPeriodEnd,
    })
  } catch (err: unknown) {
    console.error('Subscription status error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
