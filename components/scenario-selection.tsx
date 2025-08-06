"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, Star, Play, Clock } from "lucide-react"
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

interface ScenarioSelectionProps {
  selectedChild: ChildProfile | null
  onScenarioSelect: (scenario: Scenario) => void
  onBack: () => void
  onSettings: () => void
  accessibilityOptions: AccessibilityOptions
}

const mockScenarios: Scenario[] = [
  {
    id: "sharing-toy",
    title: "The Toy Tug-of-War",
    category: "sharing",
    description: "Two friends both want to play with the same toy. What should you do?",
    icon: "🧸",
    completed: true,
    choices: [
      { id: "share", text: "Share the toy", type: "positive", icon: "🤝" },
      { id: "take", text: "Take the toy", type: "negative", icon: "😠" },
      { id: "ask", text: "Ask for turns", type: "neutral", icon: "🗣️" },
    ],
  },
  {
    id: "feeling-frustrated",
    title: "Feeling Frustrated",
    category: "feelings",
    description: "When things don't go your way, how do you handle big feelings?",
    icon: "😤",
    completed: true,
    choices: [
      { id: "breathe", text: "Take deep breaths", type: "positive", icon: "🌬️" },
      { id: "yell", text: "Yell loudly", type: "negative", icon: "😡" },
      { id: "count", text: "Count to ten", type: "positive", icon: "🔢" },
    ],
  },
  {
    id: "making-friends",
    title: "Making New Friends",
    category: "friends",
    description: "You see someone playing alone. How do you make a new friend?",
    icon: "👋",
    completed: false,
    choices: [
      { id: "hello", text: "Say hello nicely", type: "positive", icon: "😊" },
      { id: "ignore", text: "Ignore them", type: "negative", icon: "😐" },
      { id: "ask-play", text: "Ask to play together", type: "positive", icon: "🎮" },
    ],
  },
  {
    id: "helping-others",
    title: "Helping a Friend",
    category: "friends",
    description: "Your friend dropped their books. What do you do?",
    icon: "📚",
    completed: false,
    choices: [
      { id: "help", text: "Help pick them up", type: "positive", icon: "🤲" },
      { id: "walk-away", text: "Walk away", type: "negative", icon: "🚶" },
      { id: "laugh", text: "Laugh at them", type: "negative", icon: "😂" },
    ],
  },
  {
    id: "being-kind",
    title: "Being Kind",
    category: "feelings",
    description: "Someone is feeling sad. How can you be kind?",
    icon: "💝",
    completed: false,
    choices: [
      { id: "comfort", text: "Give a hug", type: "positive", icon: "🤗" },
      { id: "ignore-sad", text: "Ignore them", type: "negative", icon: "😑" },
      { id: "ask-help", text: "Ask what's wrong", type: "positive", icon: "❓" },
    ],
  },
  {
    id: "school-adventure",
    title: "School Adventure",
    category: "sharing",
    description: "It's snack time and you have extra cookies. What do you do?",
    icon: "🍪",
    completed: false,
    choices: [
      { id: "share-cookies", text: "Share with friends", type: "positive", icon: "🍪" },
      { id: "keep-all", text: "Keep them all", type: "negative", icon: "🙅" },
      { id: "save-some", text: "Share some, save some", type: "positive", icon: "⚖️" },
    ],
  },
]

const categories = [
  { id: "all", name: "All Stories", icon: "📖", color: "bg-purple-100 text-purple-700" },
  { id: "sharing", name: "Sharing", icon: "🧸", color: "bg-yellow-100 text-yellow-700" },
  { id: "feelings", name: "Feelings", icon: "😊", color: "bg-pink-100 text-pink-700" },
  { id: "friends", name: "Friends", icon: "💎", color: "bg-blue-100 text-blue-700" },
]

export default function ScenarioSelection({
  selectedChild,
  onScenarioSelect,
  onBack,
  onSettings,
  accessibilityOptions,
}: ScenarioSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const speakText = (text: string) => {
    if (accessibilityOptions.textToSpeech && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = accessibilityOptions.narrationSpeed
      speechSynthesis.speak(utterance)
    }
  }

  const filteredScenarios =
    selectedCategory === "all"
      ? mockScenarios
      : mockScenarios.filter((scenario) => scenario.category === selectedCategory)

  const handleScenarioClick = (scenario: Scenario) => {
    speakText(`Starting ${scenario.title}. ${scenario.description}`)
    onScenarioSelect(scenario)
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
            {selectedChild && (
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedChild.avatar}</div>
                <div>
                  <h2
                    className={`font-bold text-gray-900 ${
                      accessibilityOptions.textSize === "large"
                        ? "text-2xl"
                        : accessibilityOptions.textSize === "small"
                          ? "text-lg"
                          : "text-xl"
                    }`}
                  >
                    {selectedChild.name}'s Adventures
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {selectedChild.scenariosCompleted} of {selectedChild.totalScenarios} completed
                  </p>
                </div>
              </div>
            )}
          </div>
          <Button onClick={onSettings} variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  speakText(`Selected ${category.name} category`)
                }}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="lg"
                className={`flex items-center gap-2 ${selectedCategory === category.id ? category.color : ""}`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className={accessibilityOptions.textSize === "large" ? "text-lg" : "text-base"}>
                  {category.name}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredScenarios?.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                scenario.completed ? "hover:bg-blue-50" : "hover:bg-blue-50"
              }`}
              onClick={() => handleScenarioClick(scenario)}
            >
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <div className="text-6xl mb-4">{scenario.icon}</div>

                </div>
                <CardTitle
                  className={`text-gray-900 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-xl"
                      : accessibilityOptions.textSize === "small"
                        ? "text-base"
                        : "text-lg"
                  }`}
                >
                  {scenario.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center space-y-4">
                <p
                  className={`text-gray-600 ${
                    accessibilityOptions.textSize === "large"
                      ? "text-base"
                      : accessibilityOptions.textSize === "small"
                        ? "text-sm"
                        : "text-sm"
                  }`}
                  onClick={() => speakText(scenario.description)}
                >
                  {scenario.description}
                </p>

                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant={scenario.completed ? "default" : "secondary"}>
                    {scenario.completed ? "Completed" : "New"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {scenario.category}
                  </Badge>
                </div>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                  size="lg"
                >
                  <Play className="h-5 w-5" />
                  <span>{scenario.completed ? "Play Again" : "Start Story"}</span>
                </Button>

                {scenario.completed && (
                  <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>5 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Great job!</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredScenarios.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  )
}
