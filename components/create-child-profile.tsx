"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, Settings, HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [helpType, setHelpType] = useState<"parent" | "child" | null>(null)

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

  const handleHelpClick = () => {
    setHelpModalOpen(true)
    setHelpType(null)
  }

  const handleHelpTypeSelect = (type: "parent" | "child") => {
    setHelpType(type)
    speakText(`Showing ${type} help guide`)
  }

  const getHelpSteps = () => {
    if (helpType === "parent") {
      return [
        {
          title: "Creating a Child Profile",
          content: "Help your child create their unique profile with a name and fun avatar character."
        },
        {
          title: "Choosing a Name",
          content: "Enter your child's name or a nickname they'd like to use in the app."
        },
        {
          title: "Selecting an Avatar",
          content: "Let your child pick their favorite character that will represent them in the stories."
        },
        {
          title: "Profile Completion",
          content: "Review the profile details and complete the setup to start their emotional learning journey."
        },
        {
          title: "Multiple Profiles",
          content: "You can create multiple profiles for different children in your family."
        }
      ]
    } else if (helpType === "child") {
      return [
        {
          title: "Let's Make Your Profile! ✨",
          content: "We're going to create your very own special character for EmoStory!"
        },
        {
          title: "What's Your Name?",
          content: "Type your name or what you'd like to be called in the stories. Make it special!"
        },
        {
          title: "Pick Your Character",
          content: "Choose your favorite animal friend! This will be YOU in all the fun stories."
        },
        {
          title: "All Done!",
          content: "Look at your awesome profile! Now you're ready to start learning about emotions."
        },
        {
          title: "Ready to Play",
          content: "Click 'Create Profile' and let's start your adventure with feelings and friendship!"
        }
      ]
    }
    return []
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
            onClick={handleHelpClick}
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

      {/* Help Modal */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              {helpType ? (helpType === "parent" ? "Parent Guide 👨‍👩‍👧‍👦" : "Child Guide 🌟") : "Help & Tutorial 📚"}
            </DialogTitle>
          </DialogHeader>

          {!helpType ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">
                Need help creating a profile? Choose your guide!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleHelpTypeSelect("parent")}
                  className="h-32 flex flex-col items-center justify-center space-y-2 bg-blue-500 hover:bg-blue-600"
                >
                  <div className="text-4xl">👨‍👩‍👧‍👦</div>
                  <div className="text-lg font-semibold">Parent Guide</div>
                  <div className="text-sm opacity-90">Profile setup steps</div>
                </Button>

                <Button
                  onClick={() => handleHelpTypeSelect("child")}
                  className="h-32 flex flex-col items-center justify-center space-y-2 bg-purple-500 hover:bg-purple-600"
                >
                  <div className="text-4xl">🌟</div>
                  <div className="text-lg font-semibold">Child Guide</div>
                  <div className="text-sm opacity-90">Fun character creation</div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Button
                onClick={() => setHelpType(null)}
                variant="outline"
                className="mb-4"
              >
                ← Back to Help Options
              </Button>

              <div className="space-y-4">
                {getHelpSteps().map((step, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-gray-700">{step.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-purple-800 mb-2">✨ Tip</h4>
                <p className="text-purple-700 text-sm">
                  {helpType === "parent"
                    ? "Let your child choose their own name and avatar to make the experience more personal and engaging."
                    : "Pick a character that makes you feel happy - you'll see them in all your stories!"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
