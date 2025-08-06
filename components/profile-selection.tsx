"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Lock, Trash2, Settings, HelpCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AccessibilityOptions, ChildProfile } from "@/app/page"

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

interface ProfileSelectionProps {
  profiles: ChildProfile[]
  onChildSelect: (child: ChildProfile) => void
  onCreateProfile: () => void
  onDeleteProfile: (childId: string) => void
  onParentLogin: () => void
  onSettings: () => void
  accessibilityOptions: AccessibilityOptions
}

export default function ProfileSelection({
  profiles,
  onChildSelect,
  onCreateProfile,
  onDeleteProfile,
  onParentLogin,
  onSettings,
  accessibilityOptions,
}: ProfileSelectionProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileToDelete, setProfileToDelete] = useState<ChildProfile | null>(null)

  const speakText = (text: string) => {
    if (accessibilityOptions.textToSpeech && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = accessibilityOptions.narrationSpeed
      speechSynthesis.speak(utterance)
    }
  }

  const handleChildSelect = (child: ChildProfile) => {
    setSelectedProfile(child.id)
    speakText(`Selected ${child.name}. ${child.scenariosCompleted} scenarios completed.`)
    setTimeout(() => onChildSelect(child), 500)
  }

  const handleDeleteClick = (child: ChildProfile, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card click
    setProfileToDelete(child)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (profileToDelete) {
      onDeleteProfile(profileToDelete.id)
      speakText(`${profileToDelete.name}'s profile has been deleted.`)
      setProfileToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <FloatingStickers />
      <div className="relative z-10">
        {/* Header with Settings and Help */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">EmoStory</h2>
          </div>
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

        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            {/* Title */}
        <div className="text-center mb-12">
          <h1
            className={`font-bold text-gray-900 mb-4 ${
              accessibilityOptions.textSize === "large"
                ? "text-5xl"
                : accessibilityOptions.textSize === "small"
                  ? "text-3xl"
                  : "text-4xl"
            }`}
            onClick={() => speakText("Who is playing today?")}
          >
            Who is Playing? 🎮
          </h1>
          <p
            className={`text-gray-600 ${
              accessibilityOptions.textSize === "large"
                ? "text-xl"
                : accessibilityOptions.textSize === "small"
                  ? "text-base"
                  : "text-lg"
            }`}
            onClick={() => speakText("Choose your profile to start playing EmoStory!")}
          >
            Choose your profile to start playing EmoStory!
          </p>
        </div>

        {/* Child Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {profiles.map((child) => (
            <Card
              key={child.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative ${
                selectedProfile === child.id ? "ring-4 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleChildSelect(child)}
            >
              {/* Delete Button */}
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-red-100 hover:bg-red-200 text-red-600 shadow-sm"
                  onClick={(e) => handleDeleteClick(child, e)}
                  title="Delete Profile"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">{child.avatar}</div>
                <h3
                  className={`font-bold text-gray-900 mb-2 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-2xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-lg"
                        : "text-xl"
                  }`}
                >
                  {child.name}
                </h3>
                <p className="text-gray-600 mb-4">{child.scenariosCompleted} scenarios completed</p>

                {/* Progress Indicators */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((child.scenariosCompleted / child.totalScenarios) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(child.scenariosCompleted / child.totalScenarios) * 100}%` }}
                    />
                  </div>
                </div>

                {child.scenariosCompleted > 0 && (
                  <div className="mt-4 flex justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-500">😊</span>
                      <span className="ml-1">{child.avgPositiveExpression}%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-500">⭐</span>
                      <span className="ml-1">{child.goodChoicePercentage}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add New Profile Card */}
          <Card
            className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-dashed border-gray-300 hover:border-blue-400"
            onClick={onCreateProfile}
          >
            <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-blue-500" />
              </div>
              <h3
                className={`font-bold text-gray-700 mb-2 ${
                  accessibilityOptions.textSize === "large"
                    ? "text-2xl"
                    : accessibilityOptions.textSize === "small"
                      ? "text-lg"
                      : "text-xl"
                }`}
              >
                Add New Child
              </h3>
              <p className="text-gray-500">Create a new profile</p>
            </CardContent>
          </Card>
        </div>

        {/* Parent/Therapist Login */}
        <div className="text-center">
          <Button
            onClick={onParentLogin}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2 mx-auto bg-transparent"
          >
            <Lock className="h-5 w-5" />
            <span>Parent/Therapist Login</span>
          </Button>
        </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {profileToDelete?.name}'s profile? This will permanently remove all their progress and data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
