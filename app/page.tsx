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
import { useProfiles, useAccessibilitySettings, useAppState } from "@/hooks/use-profile-storage"

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
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  // Use localStorage hooks for persistent data
  const {
    profiles,
    addProfile,
    updateProfile,
    deleteProfile,
    getProfile,
    profilesLoaded
  } = useProfiles()

  const {
    accessibilityOptions,
    setAccessibilityOptions,
    accessibilityLoaded
  } = useAccessibilitySettings()

  const {
    isFirstTime,
    selectedChildId,
    markAsReturningUser,
    selectChild,
    clearSelectedChild,
    appStateLoaded
  } = useAppState()

  // Get selected child from stored ID, ensuring it's not undefined
  const selectedChild: ChildProfile | null = selectedChildId ? getProfile(selectedChildId) || null : null

  // Auto-advance from splash screen when data is loaded
  useEffect(() => {
    if (currentScreen === "splash" && appStateLoaded && profilesLoaded && accessibilityLoaded) {
      const timer = setTimeout(() => {
        setCurrentScreen(isFirstTime ? "onboarding" : "profile-selection")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentScreen, isFirstTime, appStateLoaded, profilesLoaded, accessibilityLoaded])

  // Don't render anything until data is loaded
  if (!appStateLoaded || !profilesLoaded || !accessibilityLoaded) {
    return <SplashScreen onAccessibilityClick={() => {}} />
  }

  const handleScreenChange = (screen: AppScreen) => {
    setCurrentScreen(screen)
  }

  const handleAccessibilityUpdate = (options: AccessibilityOptions) => {
    setAccessibilityOptions(options)
  }

  const handleChildSelect = (child: ChildProfile) => {
    selectChild(child.id)
    setCurrentScreen("scenario-selection")
  }

  const handleChildCreate = (child: ChildProfile) => {
    addProfile(child)
    selectChild(child.id)
    setCurrentScreen("scenario-selection")
    markAsReturningUser()
  }

  const handleChildDelete = (childId: string) => {
    // If we're deleting the currently selected child, clear selection
    if (selectedChildId === childId) {
      clearSelectedChild()
    }
    deleteProfile(childId)
  }

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario)
    setCurrentScreen("scenario-play")
  }

  const handleProgressUpdate = (childId: string, progressData: {
    scenario: string
    choice: string
    outcome: "positive" | "neutral" | "negative"
    timeSpent: number
    facialExpression?: number
  }) => {
    const child = getProfile(childId)
    if (child) {
      // Update child's progress
      const newActivity = {
        scenario: progressData.scenario,
        choice: progressData.choice,
        outcome: progressData.outcome,
        timestamp: new Date().toISOString().split('T')[0]
      }

      const updatedChild: Partial<ChildProfile> = {
        scenariosCompleted: child.scenariosCompleted + 1,
        timeSpent: child.timeSpent + progressData.timeSpent,
        recentActivity: [newActivity, ...child.recentActivity.slice(0, 9)], // Keep last 10 activities
        goodChoicePercentage: Math.round(
          ((child.goodChoicePercentage * child.scenariosCompleted) +
           (progressData.outcome === "positive" ? 100 : progressData.outcome === "neutral" ? 50 : 0)) /
          (child.scenariosCompleted + 1)
        ),
        avgPositiveExpression: progressData.facialExpression
          ? Math.round(
              ((child.avgPositiveExpression * child.scenariosCompleted) + progressData.facialExpression) /
              (child.scenariosCompleted + 1)
            )
          : child.avgPositiveExpression
      }

      updateProfile(childId, updatedChild)
    }
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
            profiles={profiles}
            onChildSelect={handleChildSelect}
            onCreateProfile={() => setCurrentScreen("create-profile")}
            onDeleteProfile={handleChildDelete}
            onParentLogin={() => setCurrentScreen("parent-login")}
            onSettings={() => setCurrentScreen("settings")}
            accessibilityOptions={accessibilityOptions}
          />
        )

      case "create-profile":
        return (
          <CreateChildProfile
            onComplete={handleChildCreate}
            onBack={() => setCurrentScreen("profile-selection")}
            onSettings={() => setCurrentScreen("settings")}
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
            profiles={profiles}
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
            onUpdateProgress={handleProgressUpdate}
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
