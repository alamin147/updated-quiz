"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility } from 'lucide-react'

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300 relative overflow-hidden">
      {/* Accessibility Button */}
      <Button
        onClick={onAccessibilityClick}
        className="absolute top-6 right-6 bg-white/90 hover:bg-white text-sky-600 border-sky-200 shadow-lg"
        size="lg"
      >
        <Accessibility className="h-6 w-6 mr-2" />
        Accessibility Options
      </Button>

      {/* Main Logo and Characters */}
      <div className="text-center space-y-8">
        <div className="relative">
          <h1 className="text-6xl font-bold text-sky-700 mb-4 drop-shadow-lg">EmoStory</h1>

          {/* Animated Characters */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="animate-bounce" style={{ animationDelay: "0s" }}>
              <div className="text-6xl">🦝</div>
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              <div className="text-6xl">🐠</div>
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.4s" }}>
              <div className="text-6xl">🦋</div>
            </div>
            <div className="animate-bounce" style={{ animationDelay: "0.6s" }}>
              <div className="text-6xl">🐸</div>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="text-2xl animate-pulse">🌟</div>
            <p className="text-xl text-sky-700 font-medium">Loading EmoStory...</p>
            <div className="text-2xl animate-pulse">🌟</div>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-white/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-sky-600">{loadingProgress}%</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 text-4xl animate-pulse text-sky-200">⭐</div>
      <div className="absolute top-40 right-32 text-3xl animate-pulse text-sky-300" style={{ animationDelay: "1s" }}>
        🌈
      </div>
      <div className="absolute bottom-32 left-16 text-3xl animate-pulse text-sky-200" style={{ animationDelay: "2s" }}>
        💫
      </div>
      <div className="absolute bottom-20 right-20 text-4xl animate-pulse text-sky-300" style={{ animationDelay: "0.5s" }}>
        🎈
      </div>
    </div>
  )
}
