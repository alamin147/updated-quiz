"use client"

import { useLocalStorage } from "./use-local-storage"
import type { ChildProfile, AccessibilityOptions } from "@/app/page"

// Default accessibility options
const defaultAccessibilityOptions: AccessibilityOptions = {
  textToSpeech: false,
  enhancedNarration: false,
  narrationSpeed: 1,
  textSize: "medium",
  backgroundMusic: true,
  soundEffects: true,
}

// Default child profiles for first-time users
const defaultChildProfiles: ChildProfile[] = [
  {
    id: "demo-is",
    name: "Is",
    avatar: "🦝",
    scenariosCompleted: 8,
    totalScenarios: 12,
    avgPositiveExpression: 85,
    goodChoicePercentage: 78,
    timeSpent: 45,
    recentActivity: [
      { scenario: "Sharing Toy", choice: "Share with friend", outcome: "positive", timestamp: "2024-01-05" },
      { scenario: "Feeling Frustrated", choice: "Take deep breaths", outcome: "positive", timestamp: "2024-01-04" },
    ],
  },
  {
    id: "demo-po",
    name: "Po",
    avatar: "🐠",
    scenariosCompleted: 3,
    totalScenarios: 12,
    avgPositiveExpression: 65,
    goodChoicePercentage: 55,
    timeSpent: 20,
    recentActivity: [
      { scenario: "Making Friends", choice: "Say hello nicely", outcome: "positive", timestamp: "2024-01-03" },
    ],
  },
]

export function useProfiles() {
  const [profiles, setProfiles, profilesLoaded] = useLocalStorage<ChildProfile[]>("emostory_profiles", defaultChildProfiles)

  const addProfile = (profile: ChildProfile) => {
    setProfiles(prevProfiles => [...prevProfiles, profile])
  }

  const updateProfile = (profileId: string, updates: Partial<ChildProfile>) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(profile =>
        profile.id === profileId ? { ...profile, ...updates } : profile
      )
    )
  }

  const deleteProfile = (profileId: string) => {
    setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== profileId))
  }

  const getProfile = (profileId: string): ChildProfile | undefined => {
    return profiles.find(profile => profile.id === profileId)
  }

  return {
    profiles,
    addProfile,
    updateProfile,
    deleteProfile,
    getProfile,
    profilesLoaded,
  }
}

export function useAccessibilitySettings() {
  const [accessibilityOptions, setAccessibilityOptions, accessibilityLoaded] = useLocalStorage<AccessibilityOptions>(
    "emostory_accessibility",
    defaultAccessibilityOptions
  )

  const updateAccessibilityOption = <K extends keyof AccessibilityOptions>(
    key: K,
    value: AccessibilityOptions[K]
  ) => {
    setAccessibilityOptions(prev => ({ ...prev, [key]: value }))
  }

  const resetAccessibilitySettings = () => {
    setAccessibilityOptions(defaultAccessibilityOptions)
  }

  return {
    accessibilityOptions,
    setAccessibilityOptions,
    updateAccessibilityOption,
    resetAccessibilitySettings,
    accessibilityLoaded,
  }
}

export function useAppState() {
  const [isFirstTime, setIsFirstTime, firstTimeLoaded] = useLocalStorage<boolean>("emostory_first_time", true)
  const [selectedChildId, setSelectedChildId, selectedChildLoaded] = useLocalStorage<string | null>("emostory_selected_child", null)

  const markAsReturningUser = () => {
    setIsFirstTime(false)
  }

  const selectChild = (childId: string) => {
    setSelectedChildId(childId)
  }

  const clearSelectedChild = () => {
    setSelectedChildId(null)
  }

  return {
    isFirstTime,
    selectedChildId,
    markAsReturningUser,
    selectChild,
    clearSelectedChild,
    appStateLoaded: firstTimeLoaded && selectedChildLoaded,
  }
}
