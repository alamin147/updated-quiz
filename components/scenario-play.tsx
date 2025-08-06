"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, RotateCcw, Home } from "lucide-react"
import type { AccessibilityOptions, ChildProfile, Scenario } from "@/app/page"

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

interface ScenarioPlayProps {
  scenario: Scenario | null
  child: ChildProfile | null
  onComplete: () => void
  onBack: () => void
  accessibilityOptions: AccessibilityOptions
}

type GameState = "intro" | "choices" | "feedback" | "outcome"
type EmotionDetection = "happy" | "neutral" | "sad" | "none"

export default function ScenarioPlay({ scenario, child, onComplete, onBack, accessibilityOptions }: ScenarioPlayProps) {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionDetection>("none")
  const [showFacialFeedback, setShowFacialFeedback] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  const speakText = (text: string) => {
    if (accessibilityOptions.textToSpeech && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = accessibilityOptions.narrationSpeed
      speechSynthesis.speak(utterance)
    }
  }

  // Simulate facial recognition
  const simulateFacialRecognition = () => {
    setCameraActive(true)
    setShowFacialFeedback(true)

    // Simulate emotion detection after a delay
    setTimeout(() => {
      const emotions: EmotionDetection[] = ["happy", "neutral", "sad"]
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      setDetectedEmotion(randomEmotion)

      // Provide feedback based on detected emotion
      if (randomEmotion === "happy") {
        speakText("I see a smile! Great job!")
      } else if (randomEmotion === "neutral") {
        speakText("I can see you're thinking carefully!")
      } else {
        speakText("How are you feeling about this choice?")
      }
    }, 2000)
  }

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId)
    simulateFacialRecognition()
    setGameState("feedback")
  }

  const handleContinue = () => {
    setGameState("outcome")
  }

  const handleRetry = () => {
    setSelectedChoice(null)
    setDetectedEmotion("none")
    setShowFacialFeedback(false)
    setCameraActive(false)
    setGameState("choices")
  }

  const handleComplete = () => {
    speakText("Great job completing this story!")
    onComplete()
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No scenario selected</p>
      </div>
    )
  }

  const selectedChoiceData = scenario.choices.find((c) => c.id === selectedChoice)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 relative">
      <FloatingStickers />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" size="lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>

          {child && (
            <div className="flex items-center gap-3">
              <div className="text-2xl">{child.avatar}</div>
              <span className="font-medium text-gray-700">{child.name}</span>
            </div>
          )}

          <Button onClick={onComplete} variant="ghost" size="icon">
            <Home className="h-6 w-6" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Scenario Introduction */}
          {gameState === "intro" && (
            <Card className="shadow-2xl">
              <CardContent className="p-12 text-center space-y-8">
                <div className="text-8xl mb-6">{scenario.icon}</div>

                <h1
                  className={`font-bold text-gray-900 mb-6 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-4xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-2xl"
                        : "text-3xl"
                  }`}
                >
                  {scenario.title}
                </h1>

                <div className="bg-blue-50 p-8 rounded-2xl">
                  <p
                    className={`text-gray-700 leading-relaxed ${
                      accessibilityOptions.textSize === "large"
                        ? "text-2xl"
                        : accessibilityOptions.textSize === "small"
                          ? "text-lg"
                          : "text-xl"
                    }`}
                    onClick={() => speakText(scenario.description)}
                  >
                    {scenario.description}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Camera className="h-6 w-6 text-yellow-600" />
                    <p className="font-medium text-yellow-800">Get Ready!</p>
                  </div>
                  <p
                    className="text-yellow-700"
                    onClick={() => speakText("Look at the camera so I can see your happy face!")}
                  >
                    Look at the camera so I can see your happy face! 📸
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setGameState("choices")
                    speakText("Now let's see what you would do!")
                  }}
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-12 py-6"
                >
                  Let's Begin! 🚀
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Choice Selection */}
          {gameState === "choices" && (
            <Card className="shadow-2xl">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{scenario.icon}</div>
                  <h2
                    className={`font-bold text-gray-900 mb-4 ${
                      accessibilityOptions.textSize === "large"
                        ? "text-3xl"
                        : accessibilityOptions.textSize === "small"
                          ? "text-xl"
                          : "text-2xl"
                    }`}
                  >
                    What would you do?
                  </h2>

                  {/* Camera Status Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div
                      className={`w-3 h-3 rounded-full ${cameraActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                    />
                    <span className="text-sm text-gray-600">
                      {cameraActive ? "Camera is watching 👀" : "Camera ready"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {scenario.choices.map((choice) => (
                    <Card
                      key={choice.id}
                      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-300"
                      onClick={() => {
                        speakText(choice.text)
                        setTimeout(() => handleChoiceSelect(choice.id), 1000)
                      }}
                    >
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="text-4xl">{choice.icon}</div>
                        <p
                          className={`font-medium text-gray-800 ${
                            accessibilityOptions.textSize === "large"
                              ? "text-xl"
                              : accessibilityOptions.textSize === "small"
                                ? "text-base"
                                : "text-lg"
                          }`}
                        >
                          {choice.text}
                        </p>
                        <Badge
                          variant={
                            choice.type === "positive"
                              ? "default"
                              : choice.type === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                          className="opacity-0"
                        >
                          {choice.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback Screen */}
          {gameState === "feedback" && selectedChoiceData && (
            <Card className="shadow-2xl">
              <CardContent className="p-12 text-center space-y-8">
                <div className="text-6xl mb-4">{selectedChoiceData.icon}</div>

                <h2
                  className={`font-bold text-gray-900 mb-4 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-3xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-xl"
                        : "text-2xl"
                  }`}
                >
                  You chose: "{selectedChoiceData.text}"
                </h2>

                {/* Facial Recognition Feedback */}
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-2xl">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Camera className={`h-8 w-8 ${cameraActive ? "text-green-500" : "text-gray-400"}`} />
                    <div className="text-4xl">
                      {detectedEmotion === "happy"
                        ? "😊"
                        : detectedEmotion === "neutral"
                          ? "😐"
                          : detectedEmotion === "sad"
                            ? "😢"
                            : "🤔"}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {detectedEmotion === "none" && (
                      <p className="text-gray-600 animate-pulse">Looking at your expression... 👀</p>
                    )}

                    {detectedEmotion === "happy" && selectedChoiceData.type === "positive" && (
                      <div className="bg-green-100 border border-green-300 p-4 rounded-lg">
                        <p className="text-green-800 font-medium text-lg">
                          🎉 Amazing! You smiled and made a great choice!
                        </p>
                      </div>
                    )}

                    {detectedEmotion === "neutral" && (
                      <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium">
                          That was a good choice! Try to show how you feel with your face next time! 😊
                        </p>
                      </div>
                    )}

                    {detectedEmotion === "sad" && selectedChoiceData.type === "negative" && (
                      <div className="bg-orange-100 border border-orange-300 p-4 rounded-lg">
                        <p className="text-orange-800 font-medium">
                          I can see you're not sure about this choice. What else could we do? 🤔
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Try Again
                  </Button>
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                  >
                    Continue Story 📖
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Outcome Screen */}
          {gameState === "outcome" && selectedChoiceData && (
            <Card className="shadow-2xl">
              <CardContent className="p-12 text-center space-y-8">
                <div className="text-8xl mb-6">
                  {selectedChoiceData.type === "positive" ? "🎉" : selectedChoiceData.type === "negative" ? "😔" : "🤔"}
                </div>

                <h2
                  className={`font-bold text-gray-900 mb-6 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-3xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-xl"
                        : "text-2xl"
                  }`}
                >
                  Here's what happened...
                </h2>

                {/* Animated Outcome */}
                <div className="bg-gray-50 p-8 rounded-2xl mb-6">
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="text-4xl">👥</div>
                    <div className="text-4xl">{selectedChoiceData.type === "positive" ? "😊" : "😢"}</div>
                  </div>

                  <p
                    className={`text-gray-700 leading-relaxed ${
                      accessibilityOptions.textSize === "large"
                        ? "text-xl"
                        : accessibilityOptions.textSize === "small"
                          ? "text-base"
                          : "text-lg"
                    }`}
                  >
                    {selectedChoiceData.type === "positive"
                      ? `Great choice! When you ${selectedChoiceData.text.toLowerCase()}, everyone felt happy and included! 🌟`
                      : selectedChoiceData.type === "negative"
                        ? `When you ${selectedChoiceData.text.toLowerCase()}, it made others feel sad. Let's think about what we could do differently next time.`
                        : `You ${selectedChoiceData.text.toLowerCase()}. That's one way to handle it!`}
                  </p>
                </div>

                {/* Lesson Summary */}
                <div
                  className={`p-6 rounded-xl ${
                    selectedChoiceData.type === "positive"
                      ? "bg-green-50 border border-green-200"
                      : selectedChoiceData.type === "negative"
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <h3 className="font-bold text-lg mb-2">
                    {selectedChoiceData.type === "positive"
                      ? "🌟 Great Lesson!"
                      : selectedChoiceData.type === "negative"
                        ? "💭 Learning Moment!"
                        : "🤔 Something to Think About!"}
                  </h3>
                  <p
                    className={`${
                      selectedChoiceData.type === "positive"
                        ? "text-green-700"
                        : selectedChoiceData.type === "negative"
                          ? "text-orange-700"
                          : "text-blue-700"
                    } ${accessibilityOptions.textSize === "large" ? "text-lg" : "text-base"}`}
                  >
                    {scenario.category === "sharing" &&
                      "Sharing makes everyone happy and builds strong friendships! 🤝"}
                    {scenario.category === "feelings" && "It's important to handle big feelings in healthy ways! 💪"}
                    {scenario.category === "friends" && "Being kind and inclusive helps us make great friends! 👫"}
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={onComplete}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 px-8"
                  >
                    Play Another Story 📚
                  </Button>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Try Different Choice
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
