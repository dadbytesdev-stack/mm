// app/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Moon, Sun, Settings, Heart, History, X, Check, Bell, Lock, Crown, Plus, Trash2 } from 'lucide-react'

// Generate or retrieve a stable anonymous device ID.
// Replace this with a real user ID once you add auth.
function getOrCreateUserId(): string {
  let id = localStorage.getItem('mm_user_id')
  if (!id) {
    id = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem('mm_user_id', id)
  }
  return id
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark'
type View = 'home' | 'settings' | 'history' | 'upgrade' | 'notifications'

interface ScheduledNotification {
  id: string
  hour: number
  minute: number
  enabled: boolean
  label: string
}

interface Affirmation {
  id: number
  text: string
  category: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const affirmations: Affirmation[] = [
  { id: 1, text: "I am confident in my abilities and trust my decisions.", category: "Confidence" },
  { id: 2, text: "My presence commands respect and my voice matters.", category: "Confidence" },
  { id: 3, text: "I face challenges head-on with courage and determination.", category: "Confidence" },
  { id: 4, text: "I am worthy of success and all the good things life offers.", category: "Confidence" },
  { id: 5, text: "My self-belief grows stronger with each passing day.", category: "Confidence" },
  { id: 6, text: "I trust myself to make the right choices for my life.", category: "Confidence" },
  { id: 7, text: "I am comfortable being authentically myself.", category: "Confidence" },
  { id: 8, text: "My confidence inspires others to believe in themselves.", category: "Confidence" },
  { id: 9, text: "I embrace my strengths and work on my weaknesses.", category: "Confidence" },
  { id: 10, text: "I am becoming the man I was meant to be.", category: "Confidence" },
  { id: 11, text: "I am building a career that aligns with my values and goals.", category: "Career" },
  { id: 12, text: "My work makes a meaningful impact on the world.", category: "Career" },
  { id: 13, text: "I am constantly growing and developing new skills.", category: "Career" },
  { id: 14, text: "Success flows to me through focused action and persistence.", category: "Career" },
  { id: 15, text: "I am a valuable asset to any team or organization.", category: "Career" },
  { id: 16, text: "My professional network expands with quality connections.", category: "Career" },
  { id: 17, text: "I take calculated risks that advance my career.", category: "Career" },
  { id: 18, text: "I am worthy of recognition and advancement.", category: "Career" },
  { id: 19, text: "My leadership skills inspire excellence in others.", category: "Career" },
  { id: 20, text: "I create opportunities through dedication and vision.", category: "Career" },
  { id: 21, text: "My body is strong, capable, and getting better every day.", category: "Fitness" },
  { id: 22, text: "I honor my body through consistent exercise and proper nutrition.", category: "Fitness" },
  { id: 23, text: "Physical strength builds mental resilience.", category: "Fitness" },
  { id: 24, text: "I am committed to becoming the strongest version of myself.", category: "Fitness" },
  { id: 25, text: "Every workout makes me more powerful and disciplined.", category: "Fitness" },
  { id: 26, text: "I respect my body's limits while pushing past my comfort zone.", category: "Fitness" },
  { id: 27, text: "My health is a priority and I invest in it daily.", category: "Fitness" },
  { id: 28, text: "I am building a body that serves me for decades to come.", category: "Fitness" },
  { id: 29, text: "Physical fitness enhances every area of my life.", category: "Fitness" },
  { id: 30, text: "I am disciplined in my training and consistent in my effort.", category: "Fitness" },
  { id: 31, text: "I build meaningful connections based on mutual respect.", category: "Relationships" },
  { id: 32, text: "I am a supportive partner who listens and understands.", category: "Relationships" },
  { id: 33, text: "My relationships are built on honesty and trust.", category: "Relationships" },
  { id: 34, text: "I attract people who value and appreciate me.", category: "Relationships" },
  { id: 35, text: "I communicate my needs clearly and respectfully.", category: "Relationships" },
  { id: 36, text: "I am worthy of love, respect, and healthy relationships.", category: "Relationships" },
  { id: 37, text: "I invest time and energy in the people who matter most.", category: "Relationships" },
  { id: 38, text: "My presence brings value to my relationships.", category: "Relationships" },
  { id: 39, text: "I set healthy boundaries that protect my wellbeing.", category: "Relationships" },
  { id: 40, text: "I am both strong and vulnerable in my connections.", category: "Relationships" },
  { id: 41, text: "I control my thoughts and choose positivity.", category: "Mindset" },
  { id: 42, text: "Obstacles are opportunities for growth and learning.", category: "Mindset" },
  { id: 43, text: "I am the architect of my own destiny.", category: "Mindset" },
  { id: 44, text: "My mindset determines my success more than my circumstances.", category: "Mindset" },
  { id: 45, text: "I embrace change as a catalyst for personal evolution.", category: "Mindset" },
  { id: 46, text: "I am grateful for the lessons life teaches me.", category: "Mindset" },
  { id: 47, text: "My potential is limitless when I believe in myself.", category: "Mindset" },
  { id: 48, text: "I focus on solutions rather than dwelling on problems.", category: "Mindset" },
  { id: 49, text: "I am resilient and bounce back from setbacks stronger.", category: "Mindset" },
  { id: 50, text: "My thoughts create my reality, so I think powerfully.", category: "Mindset" },
  { id: 51, text: "I am present and engaged in my children's lives.", category: "Fatherhood" },
  { id: 52, text: "My love and guidance shape the next generation.", category: "Fatherhood" },
  { id: 53, text: "I lead my family with strength, wisdom, and compassion.", category: "Fatherhood" },
  { id: 54, text: "I am the role model my children need and deserve.", category: "Fatherhood" },
  { id: 55, text: "I balance discipline with unconditional love.", category: "Fatherhood" },
  { id: 56, text: "My patience and understanding create a safe home.", category: "Fatherhood" },
  { id: 57, text: "I teach my children through my actions and words.", category: "Fatherhood" },
  { id: 58, text: "I am building memories that will last a lifetime.", category: "Fatherhood" },
  { id: 59, text: "My presence in my children's lives makes a difference.", category: "Fatherhood" },
  { id: 60, text: "I am proud of the father I am becoming.", category: "Fatherhood" },
  { id: 61, text: "I am in control of my emotions and reactions.", category: "Mindset" },
  { id: 62, text: "My word is my bond and I honor my commitments.", category: "Confidence" },
  { id: 63, text: "I invest in my future through smart decisions today.", category: "Career" },
  { id: 64, text: "My energy levels are high and my body feels great.", category: "Fitness" },
  { id: 65, text: "I am a man of integrity and principle.", category: "Confidence" },
  { id: 66, text: "I create value wherever I go.", category: "Career" },
  { id: 67, text: "My relationships enrich my life and bring me joy.", category: "Relationships" },
  { id: 68, text: "I am constantly evolving into a better version of myself.", category: "Mindset" },
  { id: 69, text: "I protect and provide for those I love.", category: "Fatherhood" },
  { id: 70, text: "My discipline today creates freedom tomorrow.", category: "Fitness" },
  { id: 71, text: "I speak with clarity and conviction.", category: "Confidence" },
  { id: 72, text: "I am building wealth and financial security.", category: "Career" },
  { id: 73, text: "I treat my body as the temple it is.", category: "Fitness" },
  { id: 74, text: "I am a source of strength for my loved ones.", category: "Relationships" },
  { id: 75, text: "I learn from my mistakes and grow wiser.", category: "Mindset" },
  { id: 76, text: "I am the hero of my own story.", category: "Confidence" },
  { id: 77, text: "My work ethic sets me apart from the crowd.", category: "Career" },
  { id: 78, text: "I push my limits and discover new capabilities.", category: "Fitness" },
  { id: 79, text: "I am emotionally intelligent and self-aware.", category: "Relationships" },
  { id: 80, text: "I choose courage over comfort.", category: "Mindset" },
  { id: 81, text: "I am a man of action, not just words.", category: "Confidence" },
  { id: 82, text: "I seize opportunities when they present themselves.", category: "Career" },
  { id: 83, text: "My physical strength reflects my mental fortitude.", category: "Fitness" },
  { id: 84, text: "I nurture deep, meaningful connections.", category: "Relationships" },
  { id: 85, text: "I am the master of my fate.", category: "Mindset" },
  { id: 86, text: "I stand tall in the face of adversity.", category: "Confidence" },
  { id: 87, text: "I am building a legacy through my work.", category: "Career" },
  { id: 88, text: "I fuel my body with what it needs to thrive.", category: "Fitness" },
  { id: 89, text: "I am a pillar of support in my community.", category: "Relationships" },
  { id: 90, text: "I transform challenges into stepping stones.", category: "Mindset" },
  { id: 91, text: "I am proud of who I am and who I'm becoming.", category: "Confidence" },
  { id: 92, text: "I deliver excellence in everything I do.", category: "Career" },
  { id: 93, text: "My commitment to fitness is unwavering.", category: "Fitness" },
  { id: 94, text: "I give and receive love freely.", category: "Relationships" },
  { id: 95, text: "I am focused on what truly matters.", category: "Mindset" },
  { id: 96, text: "I trust my instincts and intuition.", category: "Confidence" },
  { id: 97, text: "I am a problem solver and innovator.", category: "Career" },
  { id: 98, text: "I honor my body through rest and recovery.", category: "Fitness" },
  { id: 99, text: "I am present in every moment with my loved ones.", category: "Fatherhood" },
  { id: 100, text: "I am grateful for this day and all it brings.", category: "Mindset" },
]

const categories = [
  { id: 'Confidence', name: 'Confidence', description: 'Build unshakeable self-belief' },
  { id: 'Career', name: 'Career', description: 'Advance your professional life' },
  { id: 'Fitness', name: 'Fitness', description: 'Strengthen body and mind' },
  { id: 'Relationships', name: 'Relationships', description: 'Deepen meaningful connections' },
  { id: 'Mindset', name: 'Mindset', description: 'Cultivate mental resilience' },
  { id: 'Fatherhood', name: 'Fatherhood', description: 'Lead with love and wisdom' },
]

const DEFAULT_NOTIFICATION_TIMES: ScheduledNotification[] = [
  { id: '1', hour: 8, minute: 0, enabled: true, label: 'Morning' },
]

const MAX_NOTIFICATIONS = 3
const SUBSCRIPTION_PRICE = '$2.99'

// ─── Notification Helpers ─────────────────────────────────────────────────────

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 === 0 ? 12 : hour % 12
  const m = minute.toString().padStart(2, '0')
  return `${h}:${m} ${period}`
}

async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

function scheduleNotificationsViaSW(notifications: ScheduledNotification[], affirmationText: string) {
  if (!('serviceWorker' in navigator)) return
  navigator.serviceWorker.ready.then(reg => {
    localStorage.setItem('notificationSchedule', JSON.stringify(notifications))
    localStorage.setItem('notificationAffirmation', affirmationText)
    reg.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATIONS',
      notifications: notifications.filter(n => n.enabled),
      affirmation: affirmationText,
    })
  })
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MantraMind() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [view, setView] = useState<View>('home')
  const [favorites, setFavorites] = useState<number[]>([])
  const [dailyAffirmation, setDailyAffirmation] = useState<Affirmation | null>(null)
  const [history, setHistory] = useState<Array<{ date: string; affirmation: Affirmation }>>([])
  const [isPremium, setIsPremium] = useState(false)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false)
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default')
  const [scheduledNotifs, setScheduledNotifs] = useState<ScheduledNotification[]>(DEFAULT_NOTIFICATION_TIMES)

  const checkSubscriptionStatus = async (uid: string) => {
    try {
      const res = await fetch('/api/subscription-status?userId=' + uid)
      if (!res.ok) return
      const data = await res.json()
      if (data.isPremium) {
        // Server confirms premium — update local state
        setIsPremium(true)
        localStorage.setItem('isPremium', 'true')
        setCancelAtPeriodEnd(data.cancelAtPeriodEnd ?? false)
        setCurrentPeriodEnd(data.currentPeriodEnd ?? null)
      }
      // If server says not premium, we do NOT clear localStorage here.
      // The in-memory server store resets on every restart, so we trust
      // localStorage as the source of truth until a real DB is added.
    } catch {
      // Network error — keep existing local state
    }
  }

  useEffect(() => {
    const savedCategories = localStorage.getItem('selectedCategories')
    const savedTheme = localStorage.getItem('theme')
    const savedFavorites = localStorage.getItem('favorites')
    const savedHistory = localStorage.getItem('history')
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding')
    const savedNotifs = localStorage.getItem('scheduledNotifs')

    if (hasCompletedOnboarding) setShowOnboarding(false)
    if (savedCategories) setSelectedCategories(JSON.parse(savedCategories))
    else setSelectedCategories(['Confidence', 'Mindset'])
    if (savedTheme) setTheme(savedTheme as Theme)
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedHistory) setHistory(JSON.parse(savedHistory))
    if (savedNotifs) setScheduledNotifs(JSON.parse(savedNotifs))
    if ('Notification' in window) setNotifPermission(Notification.permission)

    const uid = getOrCreateUserId()
    setUserId(uid)

    // Check localStorage first for instant UI (also catches return from Stripe)
    const savedPremium = localStorage.getItem('isPremium')
    if (savedPremium === 'true') {
      setIsPremium(true)
      // Also navigate to notifications if returning from successful upgrade
      const params = new URLSearchParams(window.location.search)
      if (params.get('upgraded') === 'true') {
        setView('notifications')
        window.history.replaceState({}, '', '/')
      }
    }

    // Then verify with server in background (only upgrades, never downgrades locally)
    checkSubscriptionStatus(uid)
  }, [])

  useEffect(() => {
    if (selectedCategories.length === 0) return
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('affirmationDate')
    const savedAffirmationId = localStorage.getItem('affirmationId')

    if (savedDate === today && savedAffirmationId) {
      const affirmation = affirmations.find(a => a.id === parseInt(savedAffirmationId))
      if (affirmation) { setDailyAffirmation(affirmation); return }
    }

    const filtered = affirmations.filter(a => selectedCategories.includes(a.category))
    if (filtered.length === 0) return

    const seed = new Date().getDate() + new Date().getMonth() * 31 + new Date().getFullYear() * 365
    const newAffirmation = filtered[seed % filtered.length]

    setDailyAffirmation(newAffirmation)
    localStorage.setItem('affirmationDate', today)
    localStorage.setItem('affirmationId', newAffirmation.id.toString())

    const newHistory = [
      { date: today, affirmation: newAffirmation },
      ...history.filter(h => h.date !== today).slice(0, 6)
    ]
    setHistory(newHistory)
    localStorage.setItem('history', JSON.stringify(newHistory))
  }, [selectedCategories])

  const handleCategoryToggle = (categoryId: string) => {
    const next = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId]
    setSelectedCategories(next)
    localStorage.setItem('selectedCategories', JSON.stringify(next))
  }

  const handleCompleteOnboarding = () => {
    if (selectedCategories.length === 0) { alert('Please select at least one category'); return }
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setShowOnboarding(false)
  }

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  const toggleFavorite = (id: number) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('favorites', JSON.stringify(next))
  }

  // ── Stripe Payment Handlers ───────────────────────────────────────────────
  const handleSubscribe = async () => {
    if (!userId) return
    setStripeLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url  // Redirect to Stripe Checkout
      } else {
        alert('Could not start checkout. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setStripeLoading(false)
    }
  }

  const handleCancelPremium = async () => {
    if (!userId) return
    const confirmed = confirm(
      'Cancel your Pro subscription? You will keep Pro access until the end of your current billing period.'
    )
    if (!confirmed) return
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setCancelAtPeriodEnd(true)
        if (data.currentPeriodEnd) setCurrentPeriodEnd(data.currentPeriodEnd)
        alert('Your subscription has been cancelled. You will keep Pro access until ' +
          new Date(data.currentPeriodEnd * 1000).toLocaleDateString())
      } else {
        alert('Could not cancel. Please contact support.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission()
    setNotifPermission(granted ? 'granted' : 'denied')
    return granted
  }

  const handleSaveNotifications = async () => {
    if (notifPermission !== 'granted') {
      const granted = await handleRequestPermission()
      if (!granted) return
    }
    localStorage.setItem('scheduledNotifs', JSON.stringify(scheduledNotifs))
    if (dailyAffirmation) scheduleNotificationsViaSW(scheduledNotifs, dailyAffirmation.text)
    alert('Reminder schedule saved!')
  }

  const addNotification = () => {
    if (scheduledNotifs.length >= MAX_NOTIFICATIONS) return
    const labels = ['Morning', 'Afternoon', 'Evening']
    const newNotif: ScheduledNotification = {
      id: Date.now().toString(),
      hour: 12,
      minute: 0,
      enabled: true,
      label: labels[scheduledNotifs.length] || 'Reminder',
    }
    setScheduledNotifs(prev => [...prev, newNotif])
  }

  const removeNotification = (id: string) => {
    setScheduledNotifs(prev => prev.filter(n => n.id !== id))
  }

  const updateNotification = (id: string, updates: Partial<ScheduledNotification>) => {
    setScheduledNotifs(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
  }

  // ── Theme helpers ──────────────────────────────────────────────────────────
  const isDark = theme === 'dark'
  const bg = isDark
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white'
  const cardBorder = isDark ? 'border-gray-700' : 'border-gray-200'
  const mutedText = isDark ? 'text-gray-400' : 'text-gray-500'
  const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'

  const BackHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between mb-6">
      {title ? <h2 className="text-2xl font-bold">{title}</h2> : <div />}
      <button onClick={() => setView('home')} className={`p-2 ${hoverBg} rounded-lg transition-colors`}>
        <X className="w-5 h-5" />
      </button>
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  if (showOnboarding) {
    return (
      <div className={`min-h-screen ${bg} transition-colors duration-300 flex items-center justify-center p-4`}>
        <div className={`w-full max-w-2xl ${cardBg} ${cardBorder} border rounded-lg shadow-lg`}>
          <div className="p-6 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to MantraMind</h1>
            <p className={`text-lg ${mutedText}`}>Daily affirmations designed for men building their best lives</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Select Your Focus Areas</h3>
              <p className={`text-sm mb-4 ${mutedText}`}>Choose the categories that resonate with your current goals</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => handleCategoryToggle(cat.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategories.includes(cat.id)
                        ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                        : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{cat.name}</h4>
                      {selectedCategories.includes(cat.id) && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                    <p className={`text-sm ${mutedText}`}>{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleCompleteOnboarding}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Start My Journey
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'settings') {
    return (
      <div className={`min-h-screen ${bg} transition-colors duration-300 p-4`}>
        <div className="max-w-2xl mx-auto">
          <BackHeader title="Settings" />
          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg mb-4`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Appearance</h3>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button onClick={toggleTheme} className={`p-2 border ${cardBorder} rounded-lg ${hoverBg} transition-colors`}>
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg mb-4`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Subscription</h3>
              {isPremium ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-amber-500">MantraMind Pro — Active</span>
                  </div>
                  {cancelAtPeriodEnd && currentPeriodEnd ? (
                    <p className={`text-sm text-amber-600`}>
                      ⚠️ Cancels on {new Date(currentPeriodEnd * 1000).toLocaleDateString()} — you keep Pro until then.
                    </p>
                  ) : (
                    <p className={`text-sm ${mutedText}`}>You have full access to notification scheduling and all premium features.</p>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setView('notifications')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      Manage Notifications
                    </button>
                    {!cancelAtPeriodEnd && (
                      <button onClick={handleCancelPremium}
                        className={`flex-1 border ${cardBorder} ${hoverBg} py-2 px-4 rounded-lg text-sm font-medium transition-colors text-red-500`}>
                        Cancel Plan
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className={`text-sm ${mutedText}`}>Current Plan: <strong className={isDark ? 'text-white' : 'text-gray-900'}>Free</strong></p>
                  <button onClick={() => setView('upgrade')}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">Focus Categories</h3>
              <p className={`text-sm ${mutedText} mb-4`}>Your daily affirmations will come from these categories</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => handleCategoryToggle(cat.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategories.includes(cat.id)
                        ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                        : isDark ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{cat.name}</h4>
                      {selectedCategories.includes(cat.id) && <Check className="w-5 h-5 text-blue-500" />}
                    </div>
                    <p className={`text-sm ${mutedText}`}>{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'history') {
    const favoriteAffirmations = affirmations.filter(a => favorites.includes(a.id))
    return (
      <div className={`min-h-screen ${bg} transition-colors duration-300 p-4`}>
        <div className="max-w-2xl mx-auto">
          <BackHeader title="History & Favorites" />
          {favoriteAffirmations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Favorites</h3>
              <div className="space-y-4">
                {favoriteAffirmations.map(a => (
                  <div key={a.id} className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg p-6`}>
                    <p className="text-lg mb-2">{a.text}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${mutedText}`}>{a.category}</span>
                      <button onClick={() => toggleFavorite(a.id)} className={`p-2 ${hoverBg} rounded-lg transition-colors`}>
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {history.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Recent Affirmations</h3>
              <div className="space-y-4">
                {history.map((item, i) => (
                  <div key={i} className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg p-6`}>
                    <p className="text-lg mb-2">{item.affirmation.text}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${mutedText}`}>{item.affirmation.category}</span>
                      <span className={`text-sm ${mutedText}`}>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {favoriteAffirmations.length === 0 && history.length === 0 && (
            <p className={`text-center ${mutedText} py-12`}>No history yet. Come back tomorrow!</p>
          )}
        </div>
      </div>
    )
  }

  if (view === 'upgrade') {
    return (
      <div className={`min-h-screen ${bg} transition-colors duration-300 p-4`}>
        <div className="max-w-md mx-auto">
          <BackHeader title="" />
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">MantraMind Pro</h1>
            <p className={mutedText}>Stay locked in all day, every day.</p>
          </div>

          <div className={`${cardBg} border-2 border-amber-500 rounded-xl shadow-xl p-6 mb-6`}>
            <div className="text-center mb-5">
              <div className="text-5xl font-bold mb-1">{SUBSCRIPTION_PRICE}</div>
              <div className={`text-sm ${mutedText}`}>per month · cancel anytime</div>
            </div>
            <div className="space-y-3">
              {[
                { icon: '🔔', label: 'Up to 3 scheduled reminders per day' },
                { icon: '⏰', label: 'Custom notification times — morning, afternoon, evening' },
                { icon: '📱', label: 'Push notifications direct to your device' },
                { icon: '✨', label: 'All free features included' },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm leading-tight pt-0.5">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBg} ${cardBorder} border rounded-xl p-4 mb-6`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-3`}>Free vs Pro</h4>
            <div className="space-y-2 text-sm">
              {[
                { feature: 'Daily affirmation', free: true, pro: true },
                { feature: 'History & favorites', free: true, pro: true },
                { feature: 'Dark mode', free: true, pro: true },
                { feature: 'Category selection', free: true, pro: true },
                { feature: 'Scheduled reminders (up to 3)', free: false, pro: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>{row.feature}</span>
                  <div className="flex gap-6">
                    <span className={row.free ? 'text-green-500' : mutedText}>{row.free ? '✓' : '—'}</span>
                    <span className={row.pro ? 'text-amber-500' : mutedText}>{row.pro ? '✓' : '—'}</span>
                  </div>
                </div>
              ))}
              <div className={`flex justify-end gap-6 text-xs font-semibold ${mutedText} pt-1 border-t ${cardBorder}`}>
                <span>Free</span>
                <span className="text-amber-500">Pro</span>
              </div>
            </div>
          </div>

          <button onClick={handleSubscribe} disabled={stripeLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 text-lg mb-3 flex items-center justify-center gap-2">
            {stripeLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Redirecting to Stripe…
              </>
            ) : (
              <>Start Pro — {SUBSCRIPTION_PRICE}/mo</>
            )}
          </button>
          <p className={`text-center text-xs ${mutedText}`}>Secure payment via Stripe · Cancel anytime · No commitment</p>
        </div>
      </div>
    )
  }

  if (view === 'notifications') {
    if (!isPremium) { setView('upgrade'); return null }
    return (
      <div className={`min-h-screen ${bg} transition-colors duration-300 p-4`}>
        <div className="max-w-2xl mx-auto">
          <BackHeader title="Reminder Schedule" />

          {notifPermission === 'denied' && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg">
              <p className="text-sm text-red-500 font-medium">Notifications are blocked</p>
              <p className={`text-xs ${mutedText} mt-1`}>Enable notifications for MantraMind in your device settings.</p>
            </div>
          )}
          {notifPermission === 'default' && (
            <div className={`mb-4 p-4 ${isDark ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'} border border-blue-500 border-opacity-30 rounded-lg`}>
              <p className="text-sm font-medium text-blue-500">Permission required</p>
              <p className={`text-xs ${mutedText} mt-1`}>Tap "Save Schedule" to grant notification access.</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Pro Feature</span>
          </div>
          <p className={`text-sm ${mutedText} mb-6`}>
            Schedule up to {MAX_NOTIFICATIONS} daily reminders to revisit your affirmation throughout the day.
          </p>

          <div className="space-y-3 mb-6">
            {scheduledNotifs.map((notif) => (
              <div key={notif.id} className={`${cardBg} ${cardBorder} border rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <input
                      type="text"
                      value={notif.label}
                      onChange={e => updateNotification(notif.id, { label: e.target.value })}
                      className={`text-sm font-medium bg-transparent border-none outline-none w-24 ${isDark ? 'text-white' : 'text-gray-900'}`}
                      placeholder="Label"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateNotification(notif.id, { enabled: !notif.enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notif.enabled ? 'bg-blue-600' : isDark ? 'bg-gray-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notif.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    {scheduledNotifs.length > 1 && (
                      <button onClick={() => removeNotification(notif.id)} className={`p-1 ${hoverBg} rounded-lg transition-colors text-red-400`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={notif.hour}
                    onChange={e => updateNotification(notif.id, { hour: parseInt(e.target.value) })}
                    disabled={!notif.enabled}
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm ${inputBg} disabled:opacity-50`}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                      </option>
                    ))}
                  </select>
                  <span className={mutedText}>:</span>
                  <select
                    value={notif.minute}
                    onChange={e => updateNotification(notif.id, { minute: parseInt(e.target.value) })}
                    disabled={!notif.enabled}
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm ${inputBg} disabled:opacity-50`}
                  >
                    {[0, 15, 30, 45].map(m => (
                      <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span className={`text-sm font-medium w-16 text-right ${mutedText}`}>
                    {formatTime(notif.hour, notif.minute)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {scheduledNotifs.length < MAX_NOTIFICATIONS ? (
            <button onClick={addNotification}
              className={`w-full py-3 border-2 border-dashed ${cardBorder} rounded-xl text-sm ${mutedText} ${hoverBg} transition-colors flex items-center justify-center gap-2 mb-6`}>
              <Plus className="w-4 h-4" />
              Add reminder ({scheduledNotifs.length}/{MAX_NOTIFICATIONS})
            </button>
          ) : (
            <p className={`text-center text-xs ${mutedText} mb-6`}>Maximum of {MAX_NOTIFICATIONS} reminders reached.</p>
          )}

          <button onClick={handleSaveNotifications}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
            Save Schedule
          </button>
          <p className={`text-center text-xs ${mutedText} mt-3`}>
            Notifications will deliver today's affirmation at your selected times.
          </p>
        </div>
      </div>
    )
  }

  // ── Home ───────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">MantraMind</h1>
          {isPremium && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 bg-opacity-20 text-amber-500 text-xs font-semibold">
              <Crown className="w-3 h-3" /> Pro
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className={`p-2 ${hoverBg} rounded-lg transition-colors`}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setView('history')} className={`p-2 ${hoverBg} rounded-lg transition-colors`}>
            <History className="w-5 h-5" />
          </button>
          <button onClick={() => isPremium ? setView('notifications') : setView('upgrade')}
            className={`p-2 ${hoverBg} rounded-lg transition-colors relative`}>
            {isPremium ? (
              <Bell className="w-5 h-5" />
            ) : (
              <span className="relative inline-block">
                <Bell className="w-5 h-5" />
                <Lock className="w-3 h-3 text-amber-500 absolute -bottom-0.5 -right-0.5" />
              </span>
            )}
          </button>
          <button onClick={() => setView('settings')} className={`p-2 ${hoverBg} rounded-lg transition-colors`}>
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="max-w-3xl w-full text-center">
          {dailyAffirmation && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-4xl md:text-5xl lg:text-6xl font-serif leading-relaxed">
                {dailyAffirmation.text}
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="px-4 py-2 rounded-full bg-blue-500 bg-opacity-20 text-blue-500 text-sm font-medium">
                  {dailyAffirmation.category}
                </span>
                <button onClick={() => toggleFavorite(dailyAffirmation.id)} className={`p-2 ${hoverBg} rounded-lg transition-colors`}>
                  <Heart className={`w-6 h-6 ${favorites.includes(dailyAffirmation.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
              <p className={`text-sm ${mutedText}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </main>

      {!isPremium && (
        <div className="px-4 pb-4 flex justify-center">
          <button onClick={() => setView('upgrade')}
            className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border ${cardBorder} ${cardBg} ${hoverBg} transition-colors text-sm`}>
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Get reminders with <strong>Pro</strong></span>
            <span className={`text-xs ${mutedText}`}>{SUBSCRIPTION_PRICE}/mo</span>
          </button>
        </div>
      )}

      <footer className={`p-4 text-center text-sm ${mutedText}`}>
        <p>Your daily dose of motivation. Come back tomorrow for a new affirmation.</p>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  )
}
