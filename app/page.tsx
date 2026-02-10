// app/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { Moon, Sun, Settings, Heart, History, X, Check } from 'lucide-react'

const affirmations = [
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

export default function MantraMind() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [dailyAffirmation, setDailyAffirmation] = useState<typeof affirmations[0] | null>(null)
  const [history, setHistory] = useState<Array<{ date: string; affirmation: typeof affirmations[0] }>>([])

  useEffect(() => {
    const savedCategories = localStorage.getItem('selectedCategories')
    const savedTheme = localStorage.getItem('theme')
    const savedFavorites = localStorage.getItem('favorites')
    const savedHistory = localStorage.getItem('history')
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding')

    if (hasCompletedOnboarding) {
      setShowOnboarding(false)
    }

    if (savedCategories) {
      setSelectedCategories(JSON.parse(savedCategories))
    } else {
      setSelectedCategories(['Confidence', 'Mindset'])
    }

    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark')
    }

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    if (selectedCategories.length === 0) return

    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('affirmationDate')
    const savedAffirmationId = localStorage.getItem('affirmationId')

    if (savedDate === today && savedAffirmationId) {
      const affirmation = affirmations.find(a => a.id === parseInt(savedAffirmationId))
      if (affirmation) {
        setDailyAffirmation(affirmation)
        return
      }
    }

    const filteredAffirmations = affirmations.filter(a => 
      selectedCategories.includes(a.category)
    )

    if (filteredAffirmations.length === 0) return

    const seed = new Date().getDate() + new Date().getMonth() * 31 + new Date().getFullYear() * 365
    const index = seed % filteredAffirmations.length
    const newAffirmation = filteredAffirmations[index]

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
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId]
    
    setSelectedCategories(newCategories)
    localStorage.setItem('selectedCategories', JSON.stringify(newCategories))
  }

  const handleCompleteOnboarding = () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category')
      return
    }
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setShowOnboarding(false)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleFavorite = (affirmationId: number) => {
    const newFavorites = favorites.includes(affirmationId)
      ? favorites.filter(id => id !== affirmationId)
      : [...favorites, affirmationId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'

  if (showOnboarding) {
    return (
      <div className={`min-h-screen ${themeClasses} transition-colors duration-300 flex items-center justify-center p-4`}>
        <div className={`w-full max-w-2xl ${cardBg} ${cardBorder} border rounded-lg shadow-lg`}>
          <div className="p-6 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to MantraMind</h1>
            <p className="text-lg opacity-75">
              Daily affirmations designed specifically for men who are building their best lives
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Your Focus Areas</h3>
              <p className="text-sm mb-4 opacity-75">Choose 2-3 categories that resonate with your current goals</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategories.includes(category.id)
                        ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{category.name}</h4>
                      {selectedCategories.includes(category.id) && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm opacity-75">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={handleCompleteOnboarding}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Start My Journey
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showSettings) {
    return (
      <div className={`min-h-screen ${themeClasses} transition-colors duration-300 p-4`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button 
              onClick={() => setShowSettings(false)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg mb-6`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Theme</h3>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button 
                  onClick={toggleTheme}
                  className="p-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Focus Categories</h3>
              <p className="text-sm opacity-75 mb-4">
                Your daily affirmations will come from these categories
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategories.includes(category.id)
                        ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{category.name}</h4>
                      {selectedCategories.includes(category.id) && (
                        <Check className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm opacity-75">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showHistory) {
    const favoriteAffirmations = affirmations.filter(a => favorites.includes(a.id))

    return (
      <div className={`min-h-screen ${themeClasses} transition-colors duration-300 p-4`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">History & Favorites</h2>
            <button 
              onClick={() => setShowHistory(false)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {favoriteAffirmations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Favorites</h3>
              <div className="space-y-4">
                {favoriteAffirmations.map(affirmation => (
                  <div key={affirmation.id} className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg p-6`}>
                    <p className="text-lg mb-2">{affirmation.text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-75">{affirmation.category}</span>
                      <button
                        onClick={() => toggleFavorite(affirmation.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
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
                {history.map((item, index) => (
                  <div key={index} className={`${cardBg} ${cardBorder} border rounded-lg shadow-lg p-6`}>
                    <p className="text-lg mb-2">{item.affirmation.text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm opacity-75">{item.affirmation.category}</span>
                      <span className="text-sm opacity-75">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">MantraMind</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
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
                <button
                  onClick={() => toggleFavorite(dailyAffirmation.id)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      favorites.includes(dailyAffirmation.id)
                        ? 'fill-red-500 text-red-500'
                        : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm opacity-75">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 text-center text-sm opacity-75">
        <p>Your daily dose of motivation. Come back tomorrow for a new affirmation.</p>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

// END OF FILE