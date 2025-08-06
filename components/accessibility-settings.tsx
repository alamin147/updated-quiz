"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Volume2, Eye, Rabbit, Turtle, Type } from "lucide-react"
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

interface AccessibilitySettingsProps {
  options: AccessibilityOptions
  onUpdate: (options: AccessibilityOptions) => void
  onComplete: () => void
}

export default function AccessibilitySettings({ options, onUpdate, onComplete }: AccessibilitySettingsProps) {
  const [localOptions, setLocalOptions] = useState<AccessibilityOptions>(options)

  const handleToggle = (key: keyof AccessibilityOptions, value: boolean) => {
    const updated = { ...localOptions, [key]: value }
    setLocalOptions(updated)
    onUpdate(updated)
  }

  const handleSliderChange = (key: keyof AccessibilityOptions, value: number[]) => {
    const updated = { ...localOptions, [key]: value[0] }
    setLocalOptions(updated)
    onUpdate(updated)
  }

  const handleTextSizeChange = (size: "small" | "medium" | "large") => {
    const updated = { ...localOptions, textSize: size }
    setLocalOptions(updated)
    onUpdate(updated)
  }

  const testTextToSpeech = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("Hello! This is how text-to-speech sounds.")
      utterance.rate = localOptions.narrationSpeed
      speechSynthesis.speak(utterance)
    }
  }

  const testEnhancedNarration = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Enhanced narration provides detailed descriptions of what's happening on screen. A friendly purple character with big eyes appears, holding a colorful ball.",
      )
      utterance.rate = localOptions.narrationSpeed
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <FloatingStickers />
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Eye className="h-8 w-8 text-blue-500" />
            Accessibility Settings
          </CardTitle>
          <p className="text-gray-600 mt-2">Make EmoStory work best for you!</p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Basic Accessibility */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Basic Accessibility
            </h3>

            {/* Text-to-Speech */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label className="text-base font-medium">Text-to-Speech</Label>
                <p className="text-sm text-gray-600">Read all text aloud</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={localOptions.textToSpeech}
                  onCheckedChange={(checked) => handleToggle("textToSpeech", checked)}
                />
                <Button
                  onClick={testTextToSpeech}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Volume2 className="h-4 w-4" />
                  Test
                </Button>
              </div>
            </div>

            {/* Enhanced Narration */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <Label className="text-base font-medium">Enhanced Narration</Label>
                <p className="text-sm text-gray-600">Describe visuals and actions for blind users</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={localOptions.enhancedNarration}
                  onCheckedChange={(checked) => handleToggle("enhancedNarration", checked)}
                />
                <Button
                  onClick={testEnhancedNarration}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Eye className="h-4 w-4" />
                  Test
                </Button>
              </div>
            </div>

            {/* Narration Speed */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-base font-medium mb-4 block">Narration Speed</Label>
              <div className="flex items-center gap-4">
                <Turtle className="h-5 w-5 text-gray-500" />
                <Slider
                  value={[localOptions.narrationSpeed]}
                  onValueChange={(value) => handleSliderChange("narrationSpeed", value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <Rabbit className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Current speed: {localOptions.narrationSpeed}x</p>
            </div>

            {/* Text Size */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-base font-medium mb-4 block flex items-center gap-2">
                <Type className="h-5 w-5" />
                Text Size
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {(["small", "medium", "large"] as const).map((size) => (
                  <Button
                    key={size}
                    onClick={() => handleTextSizeChange(size)}
                    variant={localOptions.textSize === size ? "default" : "outline"}
                    className="capitalize"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio Settings
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-base font-medium">Background Music</Label>
                  <p className="text-sm text-gray-600">Play ambient music during scenarios</p>
                </div>
                <Switch
                  checked={localOptions.backgroundMusic}
                  onCheckedChange={(checked) => handleToggle("backgroundMusic", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-base font-medium">Sound Effects</Label>
                  <p className="text-sm text-gray-600">Play interactive sound effects</p>
                </div>
                <Switch
                  checked={localOptions.soundEffects}
                  onCheckedChange={(checked) => handleToggle("soundEffects", checked)}
                />
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <div className="pt-6">
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6"
            >
              Done! Let's Go! 🚀
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
