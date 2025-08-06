"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, ArrowLeft, TrendingUp, Star, Clock, Target, HelpCircle } from "lucide-react"
import HelpTutorial from "./help-tutorial"
import type { ChildProfile } from "@/app/page"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ParentDashboardProps {
  profiles?: ChildProfile[]
  onBack: () => void
  onSettings: () => void
}

// Mock data for demonstration - now with dynamic updates
const childrenData = [
  {
    id: "is",
    name: "Is",
    avatar: "🦝",
    scenariosCompleted: 8,
    totalScenarios: 12,
    avgPositiveExpression: 85,
    goodChoicePercentage: 78,
    timeSpent: 45, // minutes this week
    recentActivity: [
      { scenario: "Sharing Toy", choice: "Share with friend", outcome: "positive", timestamp: "2024-01-05" },
      { scenario: "Feeling Frustrated", choice: "Take deep breaths", outcome: "positive", timestamp: "2024-01-04" },
      { scenario: "Making Friends", choice: "Say hello nicely", outcome: "positive", timestamp: "2024-01-03" },
    ],
  },
  {
    id: "po",
    name: "Po",
    avatar: "🐠",
    scenariosCompleted: 3,
    totalScenarios: 12,
    avgPositiveExpression: 65,
    goodChoicePercentage: 55,
    timeSpent: 20,
    recentActivity: [
      { scenario: "Making Friends", choice: "Say hello nicely", outcome: "positive", timestamp: "2024-01-03" },
      { scenario: "Helping Others", choice: "Help pick them up", outcome: "positive", timestamp: "2024-01-02" },
    ],
  },
]

// Dynamic emotion trend data that updates
const getEmotionTrendData = (selectedChild: any) => {
  const baseData = [
    { date: "2024-01-01", Happy: 75, Neutral: 20, Frustrated: 5 },
    { date: "2024-01-02", Happy: 80, Neutral: 15, Frustrated: 5 },
    { date: "2024-01-03", Happy: 72, Neutral: 25, Frustrated: 3 },
    { date: "2024-01-04", Happy: 85, Neutral: 12, Frustrated: 3 },
    { date: "2024-01-05", Happy: 90, Neutral: 8, Frustrated: 2 },
    { date: "2024-01-06", Happy: 92, Neutral: 6, Frustrated: 2 },
    { date: "2024-01-07", Happy: 95, Neutral: 4, Frustrated: 1 },
  ]

  // Adjust data based on selected child
  if (selectedChild.id === "po") {
    return baseData.map((day) => ({
      ...day,
      Happy: Math.max(day.Happy - 15, 50),
      Neutral: Math.min(day.Neutral + 10, 40),
      Frustrated: Math.min(day.Frustrated + 5, 15),
    }))
  }
  return baseData
}

// Dynamic scenario performance data
const getScenarioPerformanceData = (selectedChild: any) => {
  const baseData = [
    { name: "Sharing Toy", percentage: 85, timesPlayed: 12, goodChoices: 10 },
    { name: "Feeling Frustrated", percentage: 70, timesPlayed: 8, goodChoices: 6 },
    { name: "Making Friends", percentage: 95, timesPlayed: 6, goodChoices: 6 },
    { name: "Helping Others", percentage: 78, timesPlayed: 9, goodChoices: 7 },
  ]

  if (selectedChild.id === "po") {
    return baseData.map((scenario) => ({
      ...scenario,
      percentage: Math.max(scenario.percentage - 20, 40),
      timesPlayed: Math.max(scenario.timesPlayed - 4, 2),
      goodChoices: Math.max(scenario.goodChoices - 3, 1),
    }))
  }
  return baseData
}

const getEmotionDistributionData = (selectedChild: any) => {
  if (selectedChild.id === "po") {
    return [
      { name: "Happy", value: 60, color: "#22c55e" },
      { name: "Neutral", value: 30, color: "#6b7280" },
      { name: "Frustrated", value: 10, color: "#ef4444" },
    ]
  }
  return [
    { name: "Happy", value: 78, color: "#22c55e" },
    { name: "Neutral", value: 17, color: "#6b7280" },
    { name: "Frustrated", value: 5, color: "#ef4444" },
  ]
}

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
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-xl opacity-10 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 6}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            filter: "blur(0.5px)",
          }}
        >
          <div
            className="animate-bounce"
            style={{
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {stickers[Math.floor(Math.random() * stickers.length)]}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ParentDashboard({ profiles = [], onBack, onSettings }: ParentDashboardProps) {
  // Use real profiles or fallback to empty array
  const childrenData = profiles.length > 0 ? profiles : []

  const [selectedChild, setSelectedChild] = useState(childrenData[0] || null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showHelpTutorial, setShowHelpTutorial] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  // Dynamic data based on selected child
  const emotionTrendData = getEmotionTrendData(selectedChild)
  const scenarioPerformanceData = getScenarioPerformanceData(selectedChild)
  const emotionDistributionData = getEmotionDistributionData(selectedChild)

  // Trigger animation when child changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [selectedChild])

  // Don't render anything until data is loaded and there are profiles
  if (!selectedChild || childrenData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative flex items-center justify-center">
        <FloatingStickers />
        <div className="max-w-md mx-auto relative z-10 bg-white/90 backdrop-blur-sm rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Child Profiles Found</h2>
          <p className="text-gray-600 mb-6">
            Create child profiles first to view their progress and insights.
          </p>
          <Button onClick={onBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile Selection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
      <FloatingStickers />
      <div className="max-w-7xl mx-auto relative z-10 bg-white/80 backdrop-blur-sm rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowHelpTutorial(true)}
              variant="ghost"
              size="icon"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
            <Button onClick={onSettings} variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Child Selection */}
        <Card className="mb-6" id="child-selection">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>
              Select Child
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {childrenData.map((child) => (
                <Card
                  key={child.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-105 ${
                    selectedChild.id === child.id ? "ring-2 ring-blue-500 bg-blue-50 scale-105" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedChild(child)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2 animate-bounce">{child.avatar}</div>
                    <h3 className="font-semibold text-lg mb-1">{child.name}</h3>
                    <p className="text-sm text-gray-600">{child.scenariosCompleted} scenarios completed</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" id="tabs">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="emotions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Emotions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="transform transition-all duration-500 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Scenarios Completed</p>
                      <p className="text-2xl font-bold animate-pulse">{selectedChild.scenariosCompleted}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-500 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Positive Expressions</p>
                      <p className="text-2xl font-bold animate-pulse">{selectedChild.avgPositiveExpression}%</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-xl">😊</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-500 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Good Choices</p>
                      <p className="text-2xl font-bold animate-pulse">{selectedChild.goodChoicePercentage}%</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center animate-bounce">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-500 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time This Week</p>
                      <p className="text-2xl font-bold animate-pulse">{selectedChild.timeSpent}m</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center animate-bounce">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="transform transition-all duration-500 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedChild && selectedChild.recentActivity && selectedChild.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {selectedChild.recentActivity.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <h4 className="font-medium">{activity.scenario}</h4>
                          <p className="text-sm text-gray-600">Choice: {activity.choice}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={activity.outcome === "positive" ? "default" : "secondary"}>
                            {activity.outcome}
                          </Badge>
                          <span className="text-sm text-gray-500">{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No activity yet. Start playing scenarios!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6" id="charts">
            <Card className="transform transition-all duration-500 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Scenario Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%" key={`bar-${animationKey}`}>
                    <BarChart data={scenarioPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          padding: "12px",
                        }}
                        formatter={(value) => [`${value}%`, "Success Rate"]}
                      />
                      <Bar dataKey="percentage" fill="#5e94eb" radius={[4, 4, 0, 0]} stroke="#1ea34d" strokeWidth={1} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scenario List */}
            <Card className="transform transition-all duration-500 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Detailed Scenario Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarioPerformanceData.map((scenario, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{scenario.name}</h4>
                        <p className="text-sm text-gray-600">{scenario.timesPlayed} times played</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-lg text-green-600">{scenario.percentage}%</p>
                          <p className="text-sm text-gray-500">Good choices</p>
                        </div>
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emotions Tab */}
          <TabsContent value="emotions" className="space-y-6">
            <Card className="transform transition-all duration-500 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Emotion Trends (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%" key={`line-${animationKey}`}>
                    <LineChart data={emotionTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.slice(5)} // Show MM-DD format
                      />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          padding: "12px",
                        }}
                        formatter={(value, name) => [
                          `${value}`,
                          name === "Happy" ? "Happy" : name === "Neutral" ? "Neutral" : "Frustrated",
                        ]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="Happy"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#22c55e" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Neutral"
                        stroke="#6b7280"
                        strokeWidth={3}
                        dot={{ fill: "#6b7280", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#6b7280" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Frustrated"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#ef4444" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="insights">
              {/* Overall Emotion Distribution */}
              <Card className="transform transition-all duration-500 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Overall Emotion Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%" key={`pie-${animationKey}`}>
                      <PieChart>
                        <Pie
                          data={emotionDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {emotionDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {emotionDistributionData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm">
                          {entry.name}: {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insights & Tips */}
              <Card className="transform transition-all duration-500 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Insights & Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                    <h4 className="font-medium text-green-800 mb-2">Great Progress! 🎉</h4>
                    <p className="text-sm text-green-700">
                      {selectedChild.name} shows consistently positive expressions when sharing. Consider more scenarios
                      about teamwork and collaboration.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <h4 className="font-medium text-blue-800 mb-2">Recommendation 💡</h4>
                    <p className="text-sm text-blue-700">
                      Try practicing "Feeling Frustrated" scenarios more often. This will help build emotional
                      regulation skills.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                    <h4 className="font-medium text-purple-800 mb-2">Weekly Goal 🎯</h4>
                    <p className="text-sm text-purple-700">
                      Aim for 3 more scenarios this week to reach the weekly target of 15 scenarios.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Help Tutorial Modal */}
      <HelpTutorial isOpen={showHelpTutorial} onClose={() => setShowHelpTutorial(false)} />
    </div>
  )
}
