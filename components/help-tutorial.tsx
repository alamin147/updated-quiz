"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface HelpTutorialProps {
  isOpen: boolean
  onClose: () => void
}

const tutorialSteps = [
  {
    id: 1,
    character: "🦋",
    characterName: "Luna",
    title: "Hi! I'm Luna!",
    content: "I'm here to help you understand your Parent Dashboard!",
    highlight: null,
  },
  {
    id: 2,
    character: "🦋",
    characterName: "Luna",
    title: "Select Your Child",
    content: "First, choose which child's progress you want to view. Click on their profile card to see their data!",
    highlight: "child-selection",
    icons: [
      { emoji: "🦝", label: "Is", color: "bg-blue-100" },
      { emoji: "🐠", label: "Po", color: "bg-green-100" },
    ],
  },
  {
    id: 3,
    character: "🦋",
    characterName: "Luna",
    title: "Navigate the Tabs",
    content: "Use these tabs to explore different aspects of your child's progress: Overview, Scenarios, and Emotions!",
    highlight: "tabs",
    icons: [
      { emoji: "📊", label: "Overview", color: "bg-purple-100" },
      { emoji: "⭐", label: "Scenarios", color: "bg-yellow-100" },
      { emoji: "😊", label: "Emotions", color: "bg-pink-100" },
    ],
  },
  {
    id: 4,
    character: "🦋",
    characterName: "Luna",
    title: "View Progress Charts",
    content:
      "The charts show your child's emotional growth and scenario performance. Hover over them for detailed information!",
    highlight: "charts",
    demo: "📈",
  },
  {
    id: 5,
    character: "🦋",
    characterName: "Luna",
    title: "Track Growth Over Time",
    content: "Monitor your child's emotional development and celebrate their progress with detailed insights and tips!",
    highlight: "insights",
    demo: "🎯",
  },
]

export default function HelpTutorial({ isOpen, onClose }: HelpTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = tutorialSteps[currentStep]

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-3xl p-8 max-w-2xl w-full relative">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-3 mb-8">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentStep ? "bg-blue-500 scale-125" : index < currentStep ? "bg-blue-300" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              {/* Character */}
              <div className="relative">
                <div className="text-8xl mb-4 animate-bounce">{step.character}</div>
                {step.characterName && <h2 className="text-2xl font-bold text-gray-800 mb-2">{step.characterName}</h2>}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-blue-600 mb-6">{step.title}</h1>

              {/* Content */}
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto mb-8">{step.content}</p>

              {/* Step-specific content */}
              {step.icons && (
                <div className="flex justify-center space-x-8 mt-8">
                  {step.icons.map((icon, index) => (
                    <div key={index} className={`${icon.color} p-6 rounded-2xl shadow-lg`}>
                      <div className="text-4xl mb-2">{icon.emoji}</div>
                      <p className="font-medium text-gray-700">{icon.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {step.demo && (
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-2xl mt-8">
                  <div className="text-6xl mb-4">{step.demo}</div>
                  <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full inline-block">
                    <p className="text-blue-800 font-medium">Interactive charts and insights!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="ghost"
            size="lg"
            className="flex items-center space-x-2 text-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </Button>

          <div className="text-gray-500 font-medium">
            {currentStep + 1} of {tutorialSteps.length}
          </div>

          <Button
            onClick={handleNext}
            size="lg"
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full"
          >
            <span>{currentStep === tutorialSteps.length - 1 ? "Let's Start!" : "Next"}</span>
            {currentStep === tutorialSteps.length - 1 ? (
              <span className="text-xl">✨</span>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
