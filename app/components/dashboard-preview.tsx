"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { LogOut, Clock, User, CalendarIcon, Camera, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react"

// Mock data for preview
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  userType: "STUDENT",
  uniqueId: "STU2024001",
  faceRegistered: true,
}

const mockPeriods = [
  { id: 1, periodNumber: 1, startTime: "09:30", endTime: "10:20", active: true },
  { id: 2, periodNumber: 2, startTime: "10:20", endTime: "11:10", active: true },
  { id: 3, periodNumber: 3, startTime: "11:10", endTime: "12:00", active: true },
  { id: 4, periodNumber: 4, startTime: "12:00", endTime: "12:50", active: true },
  { id: 5, periodNumber: 5, startTime: "13:40", endTime: "14:30", active: true },
  { id: 6, periodNumber: 6, startTime: "14:30", endTime: "15:20", active: true },
  { id: 7, periodNumber: 7, startTime: "15:20", endTime: "16:10", active: true },
]

const mockTodayAttendance = {
  1: { marked: true, status: "PRESENT", time: "09:32" },
  2: { marked: true, status: "PRESENT", time: "10:22" },
  3: { marked: true, status: "LATE", time: "11:18" },
  4: { marked: false, status: "ABSENT" },
  5: { marked: false, status: "ABSENT" },
  6: { marked: false, status: "ABSENT" },
  7: { marked: false, status: "ABSENT" },
}

const mockStats = {
  totalPeriods: 21, // 7 periods × 3 days
  presentPeriods: 15,
  absentPeriods: 6,
  attendancePercentage: 71.4,
}

export default function DashboardPreview() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentPeriod, setCurrentPeriod] = useState(3) // Mock current period
  const [isCapturing, setIsCapturing] = useState(false)
  const [lastScanResult, setLastScanResult] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMockCapture = () => {
    setIsCapturing(true)
    setTimeout(() => {
      setIsCapturing(false)
      setLastScanResult("success")
      setTimeout(() => setLastScanResult(null), 3000)
    }, 2000)
  }

  const getCurrentPeriodStatus = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMin = now.getMinutes()
    // Simplified: just show if period 3 is active
    if (currentHour === 11 && currentMin >= 10 && currentMin <= 59) {
      return "Can mark attendance for Period 3"
    } else {
      return "No active period at this time"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Attendance System</h1>
                <p className="text-gray-600">AI-Powered Face Recognition</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Current Time</div>
                <div className="font-mono text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div className="text-right">
                  <div className="font-medium">{mockUser.name}</div>
                  <div className="text-sm text-gray-500">
                    {mockUser.userType} • {mockUser.uniqueId}
                  </div>
                </div>
              </div>

              <Button variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="welcome" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="welcome" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Welcome
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Register Attendance
            </TabsTrigger>
            <TabsTrigger value="periods" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Periods
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Your Data
            </TabsTrigger>
          </TabsList>

          {/* Welcome Tab */}
          <TabsContent value="welcome" className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Welcome, {mockUser.name}!
                </CardTitle>
                <CardDescription>Your attendance dashboard overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">User Type</p>
                    <Badge variant="outline" className="text-sm">
                      {mockUser.userType}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">ID Number</p>
                    <p className="font-mono text-sm">{mockUser.uniqueId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Face Registration</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Registered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">{getCurrentPeriodStatus()}</p>
                    <p className="text-sm text-blue-700">Period 3: 11:10 - 12:00</p>
                  </div>
                  <Badge variant="default">Active Period</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Today's Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <p className="text-sm text-green-700">Present</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">4</div>
                    <p className="text-sm text-red-700">Absent</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <p className="text-sm text-blue-700">Total Periods</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">43%</div>
                    <p className="text-sm text-purple-700">Attendance Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Register Attendance
                </CardTitle>
                <CardDescription>Use face recognition to mark your attendance for the current period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Mock Camera Feed */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              <Camera className="h-12 w-12 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-500">Camera feed would appear here</p>
                            </div>
                          </div>

                          {/* Face detection overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="w-48 h-48 border-2 border-blue-500 rounded-full opacity-50"></div>
                            </div>
                            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                              Position your face in the circle
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button onClick={handleMockCapture} disabled={isCapturing} className="w-full">
                            {isCapturing ? "Processing..." : "Capture & Mark Attendance"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Result Display */}
                    {lastScanResult && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          ✅ Face recognized! Attendance marked for Period 3 as PRESENT (Confidence: 94%)
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Instructions */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Face recognition uses AI to verify your identity</li>
                        <li>• Your face data is encrypted and stored securely</li>
                        <li>• Each period can only be marked once</li>
                      </ul>
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">For Best Results:</h4>
                          <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                            <li>• Ensure good lighting on your face</li>
                            <li>• Look directly at the camera</li>
                            <li>• Remove glasses or masks if possible</li>
                            <li>• Keep your face within the guide circle</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Periods Tab */}
          <TabsContent value="periods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Periods
                </CardTitle>
                <CardDescription>Period-wise attendance status for {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {mockPeriods.map((period) => {
                    const attendance = mockTodayAttendance[period.periodNumber as keyof typeof mockTodayAttendance]
                    const isActive = currentPeriod === period.periodNumber

                    return (
                      <div
                        key={period.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isActive ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"}`} />
                          <div>
                            <p className="font-medium">Period {period.periodNumber}</p>
                            <p className="text-sm text-gray-600">
                              {period.startTime} - {period.endTime}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {attendance?.marked ? (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  attendance.status === "PRESENT"
                                    ? "default"
                                    : attendance.status === "LATE"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {attendance.status} {"time" in attendance && attendance.time ? `at ${attendance.time}` : ""}
                              </Badge>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          ) : isActive ? (
                            <Badge variant="outline" className="text-blue-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Can Mark
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Started</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Your Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Attendance Calendar
                  </CardTitle>
                  <CardDescription>Select a date to view period-wise details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Late</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Attendance Statistics
                  </CardTitle>
                  <CardDescription>Your attendance summary (Last 30 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{mockStats.presentPeriods}</div>
                        <p className="text-xs text-green-700">Present</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xl font-bold text-red-600">{mockStats.absentPeriods}</div>
                        <p className="text-xs text-red-700">Absent</p>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{mockStats.attendancePercentage}%</div>
                      <p className="text-sm text-blue-700">Overall Attendance Rate</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Periods:</span>
                        <span className="font-medium">{mockStats.totalPeriods}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${mockStats.attendancePercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
