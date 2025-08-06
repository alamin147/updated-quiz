"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility } from 'lucide-react'

// Floating Stickers Background Component
const FloatingStickers = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const stickers = [
    "🌟",
    "⭐",
    "💫",
    "🌈",
    "🎈",
    "🦋",
    "🌸",
    "🍀",
    "💎",
    "🎀",
    "🧸",
    "🎨",
    "🎪",
    "🎭",
    "🎯",
    "🎲",
    "🎵",
    "🎶",
    "🌺",
    "🌻",
  ]

  // Don't render anything on server to avoid hydration mismatch
  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          <div
            className="animate-bounce"
            style={{
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          >
            {stickers[Math.floor(Math.random() * stickers.length)]}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SplashScreenProps {
  onAccessibilityClick: () => void
}

export default function SplashScreen({ onAccessibilityClick }: SplashScreenProps) {
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <FloatingStickers />

      {/* Accessibility Button */}
      <Button
        onClick={onAccessibilityClick}
        className="absolute top-6 right-6 bg-white/80 hover:bg-white/90 text-blue-600 border-blue-200 shadow-lg z-10"
        size="lg"
      >
        <Accessibility className="h-6 w-6 mr-2" />
        Accessibility Options
      </Button>

      {/* Main Content */}
      <div className="text-center space-y-8 z-10 relative">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to</h1>
          <h1 className="text-6xl font-bold text-blue-600 mb-4 drop-shadow-lg">EmoStory</h1>
          <p className="text-xl text-gray-700 font-medium">Learning about feelings and friends!</p>
        </div>

        {/* Animated Characters */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="animate-bounce bg-white/60 backdrop-blur-sm rounded-full p-4 shadow-lg" style={{ animationDelay: "0s" }}>
            <div className="text-6xl">🦝</div>
          </div>
          <div className="animate-bounce bg-white/60 backdrop-blur-sm rounded-full p-4 shadow-lg" style={{ animationDelay: "0.2s" }}>
            <div className="text-6xl">🐠</div>
          </div>
          <div className="animate-bounce bg-white/60 backdrop-blur-sm rounded-full p-4 shadow-lg" style={{ animationDelay: "0.4s" }}>
            <div className="text-6xl">🦋</div>
          </div>
          <div className="animate-bounce bg-white/60 backdrop-blur-sm rounded-full p-4 shadow-lg" style={{ animationDelay: "0.6s" }}>
            <div className="text-6xl">🐸</div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6 bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="text-3xl animate-spin">🌟</div>
            <p className="text-2xl text-gray-800 font-semibold">Loading your adventure...</p>
            <div className="text-3xl animate-spin" style={{ animationDelay: "0.5s" }}>✨</div>
          </div>

          {/* Progress Bar */}
          <div className="w-80 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out rounded-full shadow-sm"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-600 font-medium">{loadingProgress}% Complete</p>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>

        {/* Fun Loading Messages */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <p className="text-gray-700 font-medium">
            {loadingProgress < 25 && "🎭 Preparing your emotional adventure..."}
            {loadingProgress >= 25 && loadingProgress < 50 && "🧸 Setting up sharing scenarios..."}
            {loadingProgress >= 50 && loadingProgress < 75 && "😊 Loading friendship stories..."}
            {loadingProgress >= 75 && loadingProgress < 100 && "🌟 Almost ready to play..."}
            {loadingProgress >= 100 && "🎉 Welcome to EmoStory!"}
          </p>
        </div>
      </div>
    </div>
  )
}
