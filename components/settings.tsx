"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Volume2, Eye, Type, Shield, User, HelpCircle } from "lucide-react"
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

interface SettingsProps {
  accessibilityOptions: AccessibilityOptions
  onUpdate: (options: AccessibilityOptions) => void
  onBack: () => void
}

export default function Settings({ accessibilityOptions, onUpdate, onBack }: SettingsProps) {
  const [localOptions, setLocalOptions] = useState<AccessibilityOptions>(accessibilityOptions)
  const [facialRecognitionSensitivity, setFacialRecognitionSensitivity] = useState(50)
  const [facialRecognitionEnabled, setFacialRecognitionEnabled] = useState(true)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 relative">
      <FloatingStickers />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="accessibility" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Accessibility
              </TabsTrigger>
              <TabsTrigger value="profiles" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profiles
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility" className="space-y-6">
              {/* Basic Accessibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Basic Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Text-to-Speech */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-base font-medium">Text-to-Speech</Label>
                      <p className="text-sm text-gray-600">Read all text aloud</p>
                    </div>
                    <Switch
                      checked={localOptions.textToSpeech}
                      onCheckedChange={(checked) => handleToggle("textToSpeech", checked)}
                    />
                  </div>

                  {/* Enhanced Narration */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-base font-medium">Enhanced Narration</Label>
                      <p className="text-sm text-gray-600">Describe visuals and actions for blind users</p>
                    </div>
                    <Switch
                      checked={localOptions.enhancedNarration}
                      onCheckedChange={(checked) => handleToggle("enhancedNarration", checked)}
                    />
                  </div>

                  {/* Narration Speed */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-base font-medium mb-4 block">Narration Speed</Label>
                    <Slider
                      value={[localOptions.narrationSpeed]}
                      onValueChange={(value) => handleSliderChange("narrationSpeed", value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
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
                </CardContent>
              </Card>

              {/* Audio Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Advanced Accessibility (Parent/Therapist Only) */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Accessibility (Parent/Therapist Only)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Facial Recognition Sensitivity */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-base font-medium mb-4 block">Facial Recognition Sensitivity</Label>
                    <Slider
                      value={[facialRecognitionSensitivity]}
                      onValueChange={(value) => setFacialRecognitionSensitivity(value[0])}
                      min={0}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Less Sensitive</span>
                      <span>Current: {facialRecognitionSensitivity}%</span>
                      <span>More Sensitive</span>
                    </div>
                  </div>

                  {/* Facial Recognition Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Enable Facial Recognition</Label>
                      <p className="text-sm text-gray-600">Turn off facial recognition entirely</p>
                    </div>
                    <Switch checked={facialRecognitionEnabled} onCheckedChange={setFacialRecognitionEnabled} />
                  </div>

                  {/* Visual Descriptions */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Detailed Visual Descriptions</Label>
                      <p className="text-sm text-gray-600">Describe character appearances and scene details</p>
                    </div>
                    <Switch
                      checked={localOptions.enhancedNarration}
                      onCheckedChange={(checked) => handleToggle("enhancedNarration", checked)}
                    />
                  </div>

                  {/* Future Features */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Future Updates</h4>
                    <p className="text-sm text-blue-700">
                      Coming soon: Connect external switches or assistive devices for alternative input methods.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profiles Tab */}
            <TabsContent value="profiles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Child Profile Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🦝</div>
                        <div>
                          <h4 className="font-medium">Is</h4>
                          <p className="text-sm text-gray-600">8 scenarios completed</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🐠</div>
                        <div>
                          <h4 className="font-medium">Po</h4>
                          <p className="text-sm text-gray-600">0 scenarios completed</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      Add New Child Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-base font-medium">Subscription Status</Label>
                    <p className="text-sm text-gray-600">Premium Plan - Active until March 2024</p>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Your Privacy Matters</h4>
                    <p className="text-sm text-blue-700">
                      EmoStory is committed to protecting your child's privacy. All facial recognition processing
                      happens locally on your device and is never stored or transmitted.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Data Collection</Label>
                        <p className="text-sm text-gray-600">Allow anonymous usage analytics to improve the app</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-base font-medium">Progress Sharing</Label>
                        <p className="text-sm text-gray-600">Share progress with therapists or educators</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Privacy Policy
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 bg-transparent">
                      Delete All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Help & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    View Help Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Report a Problem
                  </Button>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>App Version:</strong> 1.0.0
                      <br />
                      <strong>Last Updated:</strong> January 2024
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
