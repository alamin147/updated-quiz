"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/splash-screen"
import OnboardingFlow from "@/components/onboarding-flow"
import AccessibilitySettings from "@/components/accessibility-settings"
import ProfileSelection from "@/components/profile-selection"
import CreateChildProfile from "@/components/create-child-profile"
import ParentLogin from "@/components/parent-login"
import ParentDashboard from "@/components/parent-dashboard"
import ScenarioSelection from "@/components/scenario-selection"
import ScenarioPlay from "@/components/scenario-play"
import Settings from "@/components/settings"

export type AppScreen =
  | "splash"
  | "onboarding"
  | "accessibility"
  | "profile-selection"
  | "create-profile"
  | "parent-login"
  | "parent-dashboard"
  | "scenario-selection"
  | "scenario-play"
  | "settings"

export type AccessibilityOptions = {
  textToSpeech: boolean
  enhancedNarration: boolean
  narrationSpeed: number
  textSize: "small" | "medium" | "large"
  backgroundMusic: boolean
  soundEffects: boolean
}

export type ChildProfile = {
  id: string
  name: string
  avatar: string
  scenariosCompleted: number
  totalScenarios: number
  avgPositiveExpression: number
  goodChoicePercentage: number
  timeSpent: number
  recentActivity: Array<{
    scenario: string
    choice: string
    outcome: "positive" | "neutral" | "negative"
    timestamp: string
  }>
}

export type Scenario = {
  id: string
  title: string
  category: string
  description: string
  icon: string
  completed: boolean
  choices: Array<{
    id: string
    text: string
    type: "positive" | "neutral" | "negative"
    icon: string
  }>
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("splash")
  const [accessibilityOptions, setAccessibilityOptions] = useState<AccessibilityOptions>({
    textToSpeech: false,
    enhancedNarration: false,
    narrationSpeed: 1,
    textSize: "medium",
    backgroundMusic: true,
    soundEffects: true,
  })
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [isFirstTime, setIsFirstTime] = useState(true)

  // Auto-advance from splash screen
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => {
        setCurrentScreen(isFirstTime ? "onboarding" : "profile-selection")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentScreen, isFirstTime])

  const handleScreenChange = (screen: AppScreen) => {
    setCurrentScreen(screen)
  }

  const handleAccessibilityUpdate = (options: AccessibilityOptions) => {
    setAccessibilityOptions(options)
  }

  const handleChildSelect = (child: ChildProfile) => {
    setSelectedChild(child)
    setCurrentScreen("scenario-selection")
  }

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario)
    setCurrentScreen("scenario-play")
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onAccessibilityClick={() => setCurrentScreen("accessibility")} />

      case "onboarding":
        return (
          <OnboardingFlow
            onComplete={() => setCurrentScreen("accessibility")}
            accessibilityOptions={accessibilityOptions}
          />
        )

      case "accessibility":
        return (
          <AccessibilitySettings
            options={accessibilityOptions}
            onUpdate={handleAccessibilityUpdate}
            onComplete={() => setCurrentScreen("profile-selection")}
          />
        )

      case "profile-selection":
        return (
          <ProfileSelection
            onChildSelect={handleChildSelect}
            onCreateProfile={() => setCurrentScreen("create-profile")}
            onParentLogin={() => setCurrentScreen("parent-login")}
            accessibilityOptions={accessibilityOptions}
          />
        )

      case "create-profile":
        return (
          <CreateChildProfile
            onComplete={(child) => {
              setSelectedChild(child)
              setCurrentScreen("scenario-selection")
            }}
            onBack={() => setCurrentScreen("profile-selection")}
            accessibilityOptions={accessibilityOptions}
          />
        )

      case "parent-login":
        return (
          <ParentLogin
            onLogin={() => setCurrentScreen("parent-dashboard")}
            onBack={() => setCurrentScreen("profile-selection")}
          />
        )

      case "parent-dashboard":
        return (
          <ParentDashboard
            onBack={() => setCurrentScreen("profile-selection")}
            onSettings={() => setCurrentScreen("settings")}
          />
        )

      case "scenario-selection":
        return (
          <ScenarioSelection
            selectedChild={selectedChild}
            onScenarioSelect={handleScenarioSelect}
            onBack={() => setCurrentScreen("profile-selection")}
            onSettings={() => setCurrentScreen("settings")}
            accessibilityOptions={accessibilityOptions}
          />
        )

      case "scenario-play":
        return (
          <ScenarioPlay
            scenario={selectedScenario}
            child={selectedChild}
            onComplete={() => setCurrentScreen("scenario-selection")}
            onBack={() => setCurrentScreen("scenario-selection")}
            accessibilityOptions={accessibilityOptions}
          />
        )

      case "settings":
        return (
          <Settings
            accessibilityOptions={accessibilityOptions}
            onUpdate={handleAccessibilityUpdate}
            onBack={() => setCurrentScreen(selectedChild ? "scenario-selection" : "parent-dashboard")}
          />
        )

      default:
        return <SplashScreen onAccessibilityClick={() => setCurrentScreen("accessibility")} />
    }
  }

  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">{renderCurrentScreen()}</div>
}
