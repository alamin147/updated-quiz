"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, Settings, HelpCircle } from "lucide-react"
import type { AccessibilityOptions, ChildProfile } from "@/app/page"

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

interface CreateChildProfileProps {
  onComplete: (child: ChildProfile) => void
  onBack: () => void
  onSettings: () => void
  accessibilityOptions: AccessibilityOptions
}

const avatarOptions = ["🦝", "🐠", "🦋", "🐸", "🐱", "🐶", "🐰", "🦊", "🐼", "🐨", "🦁", "🐯", "🐸", "🐙", "🦄", "🐲"]

export default function CreateChildProfile({ onComplete, onBack, onSettings, accessibilityOptions }: CreateChildProfileProps) {
  const [step, setStep] = useState<"name" | "avatar" | "confirm">("name")
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")

  const speakText = (text: string) => {
    if (accessibilityOptions.textToSpeech && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = accessibilityOptions.narrationSpeed
      speechSynthesis.speak(utterance)
    }
  }

  const handleNameSubmit = () => {
    if (name.trim()) {
      setStep("avatar")
      speakText("Great! Now choose your character.")
    }
  }

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
    setStep("confirm")
    speakText(`You chose ${avatar}. Looking great!`)
  }

  const handleComplete = () => {
    const newChild: ChildProfile = {
      id: Date.now().toString(),
      name: name.trim(),
      avatar: selectedAvatar,
      scenariosCompleted: 0,
      totalScenarios: 12,
      avgPositiveExpression: 0,
      goodChoicePercentage: 0,
      timeSpent: 0,
      recentActivity: [],
    }
    onComplete(newChild)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <FloatingStickers />

      {/* Header with Navigation */}
      <div className="flex justify-between items-center p-6">
        <Button onClick={onBack} variant="ghost" size="lg">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={onSettings}
            variant="ghost"
            size="icon"
            className="hover:bg-white/20 transition-colors"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/20 transition-colors"
            title="Help & Tutorial"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle
            className={`text-gray-900 ${
              accessibilityOptions.textSize === "large"
                ? "text-4xl"
                : accessibilityOptions.textSize === "small"
                  ? "text-2xl"
                  : "text-3xl"
            }`}
          >
            Create Your Profile! ✨
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          {/* Name Input Step */}
          {step === "name" && (
            <div className="text-center space-y-8">
              <div className="text-6xl animate-bounce mb-6">🌟</div>
              <div>
                <h2
                  className={`font-bold text-gray-800 mb-4 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-3xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-xl"
                        : "text-2xl"
                  }`}
                  onClick={() => speakText("What's your name, superstar?")}
                >
                  What's your name, superstar? 🌟
                </h2>
                <div className="space-y-4">
                  <Label htmlFor="name" className="sr-only">
                    Your name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Type your name here..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`text-center text-2xl py-6 ${
                      accessibilityOptions.textSize === "large"
                        ? "text-3xl py-8"
                        : accessibilityOptions.textSize === "small"
                          ? "text-xl py-4"
                          : "text-2xl py-6"
                    }`}
                    onKeyPress={(e) => e.key === "Enter" && handleNameSubmit()}
                    autoFocus
                  />
                  <Button
                    onClick={handleNameSubmit}
                    disabled={!name.trim()}
                    size="lg"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl py-6"
                  >
                    Next! 🚀
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Avatar Selection Step */}
          {step === "avatar" && (
            <div className="text-center space-y-8">
              <div>
                <h2
                  className={`font-bold text-gray-800 mb-4 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-3xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-xl"
                        : "text-2xl"
                  }`}
                  onClick={() => speakText(`Hi ${name}! Choose your character!`)}
                >
                  Hi {name}! Choose your character! 🎭
                </h2>
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  {avatarOptions.map((avatar, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAvatarSelect(avatar)}
                      className="aspect-square text-4xl p-4 bg-white hover:bg-blue-50 border-2 hover:border-blue-300 transition-all duration-200 hover:scale-110"
                      variant="outline"
                    >
                      {avatar}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {step === "confirm" && (
            <div className="text-center space-y-8">
              <div className="text-8xl animate-bounce mb-6">{selectedAvatar}</div>
              <div>
                <h2
                  className={`font-bold text-gray-800 mb-4 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-3xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-xl"
                        : "text-2xl"
                  }`}
                  onClick={() => speakText(`Perfect! You're ${name} and you look amazing!`)}
                >
                  Perfect! You're {name} and you look amazing! 🎉
                </h2>
                <p
                  className={`text-gray-600 mb-8 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-base"
                        : "text-lg"
                  }`}
                  onClick={() => speakText("Ready to start your EmoStory adventure?")}
                >
                  Ready to start your EmoStory adventure?
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={handleComplete}
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-xl py-6 flex items-center justify-center space-x-2"
                  >
                    <Check className="h-6 w-6" />
                    <span>Start Playing! 🎮</span>
                  </Button>
                  <Button onClick={() => setStep("avatar")} variant="outline" size="lg" className="w-full">
                    Choose Different Character
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
