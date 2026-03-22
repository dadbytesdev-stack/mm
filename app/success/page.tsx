'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Crown, CheckCircle, Loader2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    // Set isPremium immediately — arriving at /success means Stripe confirmed payment
    localStorage.setItem('isPremium', 'true')

    if (!sessionId) {
      // No session_id in URL but still set premium and show success
      setStatus('success')
      return
    }

    const timer = setTimeout(() => {
      setStatus('success')
    }, 1500)

    return () => clearTimeout(timer)
  }, [sessionId])

  const handleContinue = () => {
    // Force a full page navigation so page.tsx re-reads localStorage fresh
    window.location.href = '/?upgraded=true'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-amber-500" />
            <p className="text-gray-400">Activating your Pro subscription…</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">You&apos;re Pro now!</h1>
              <p className="text-gray-400">
                Welcome to MantraMind Pro. Your reminders are ready to set up.
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-left space-y-3">
              {[
                'Up to 3 daily reminder notifications',
                'Custom morning, afternoon & evening times',
                'Cancel anytime from Settings',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 text-lg"
            >
              Set Up My Reminders →
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <p className="text-red-400">Something went wrong. Please contact support.</p>
            <button onClick={() => router.replace('/')} className="text-amber-500 underline text-sm">
              Return to app
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
