"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { AccessibilityOptions } from "@/app/page"

// Floating Stickers Background Component
const FloatingStickers = () => {
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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-30 animate-pulse"
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

interface OnboardingFlowProps {
  onComplete: () => void
  accessibilityOptions: AccessibilityOptions
}

const onboardingSteps = [
  {
    id: 1,
    character: "🦝",
    characterName: "Riley",
    title: "Welcome to EmoStory!",
    content: "Hi! I'm Riley! I'm here to help you learn about feelings and friends!",
    animation: "wave",
    icons: [
      { emoji: "🧸", label: "Sharing", color: "bg-yellow-100" },
      { emoji: "😊", label: "Feelings", color: "bg-pink-100" },
      { emoji: "💎", label: "Friends", color: "bg-blue-100" },
    ],
  },
  {
    id: 2,
    character: "🐠",
    characterName: "Finn",
    title: "Choose Your Adventure",
    content: "In EmoStory, you'll meet new friends and decide what to do in different situations!",
    animation: "swim",
    demonstration: "choice-making",
  },
  {
    id: 3,
    character: "🦋",
    characterName: "Bella",
    title: "Show Your Feelings",
    content: "The app can see if you're smiling and tell you 'Great job!' when you show kind expressions!",
    animation: "flutter",
    demonstration: "facial-recognition",
  },
  {
    id: 4,
    character: "🐸",
    characterName: "Freddy",
    title: "Grown-ups Help Too",
    content: "Grown-ups can see your progress to help you grow!",
    animation: "hop",
    demonstration: "progress-tracking",
  },
]

export default function OnboardingFlow({ onComplete, accessibilityOptions }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = onboardingSteps[currentStep]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const speakText = (text: string) => {
    if (accessibilityOptions.textToSpeech && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = accessibilityOptions.narrationSpeed
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <FloatingStickers />
      {/* Progress Indicators */}
      <div className="flex space-x-3 mb-8">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentStep ? "bg-blue-500 scale-125" : index < currentStep ? "bg-blue-300" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Main Content Card */}
      <Card className="w-full max-w-4xl mx-auto shadow-2xl">
        <CardContent className="p-12">
          <div className="text-center space-y-8">
            {/* Character */}
            <div className="relative">
              <div
                className={`text-8xl mb-4 ${step.animation === "wave" ? "animate-bounce" : step.animation === "swim" ? "animate-pulse" : step.animation === "flutter" ? "animate-ping" : "animate-bounce"}`}
              >
                {step.character}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{step.characterName}</h2>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{step.title}</h1>

            {/* Content */}
            <p
              className={`text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto ${
                accessibilityOptions.textSize === "large"
                  ? "text-2xl"
                  : accessibilityOptions.textSize === "small"
                    ? "text-lg"
                    : "text-xl"
              }`}
              onClick={() => speakText(step.content)}
            >
              {step.content}
            </p>

            {/* Step-specific content */}
            {step.id === 1 && step.icons && (
              <div className="flex justify-center space-x-8 mt-8">
                {step.icons.map((icon, index) => (
                  <div key={index} className={`${icon.color} p-6 rounded-2xl shadow-lg`}>
                    <div className="text-4xl mb-2">{icon.emoji}</div>
                    <p className="font-medium text-gray-700">{icon.label}</p>
                  </div>
                ))}
              </div>
            )}

            {step.id === 2 && (
              <div className="bg-gray-50 p-6 rounded-xl mt-8">
                <div className="flex justify-center space-x-4">
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg">
                    Share the toy
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg">Ask for turns</Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">Try tapping a choice!</p>
              </div>
            )}

            {step.id === 3 && (
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl mt-8">
                <div className="text-6xl mb-4">😊</div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-full inline-block">
                  Great job! I see a happy face!
                </div>
              </div>
            )}

            {step.id === 4 && (
              <div className="bg-purple-50 p-6 rounded-xl mt-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-4xl">👨‍👩‍👧‍👦</div>
                  <div className="text-4xl">📊</div>
                  <div className="text-4xl">📈</div>
                </div>
                <p className="text-gray-600 mt-4">Parents and therapists can track your amazing progress!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center w-full max-w-4xl mt-8">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2 bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </Button>

        <div className="text-gray-500 font-medium">
          {currentStep + 1} of {onboardingSteps.length}
        </div>

        <Button onClick={handleNext} size="lg" className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600">
          <span>{currentStep === onboardingSteps.length - 1 ? "Let's Begin!" : "Next"}</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
