"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../contexts/auth-context"
import { apiService } from "../services/api"
import { CheckCircle, Clock, User, AlertCircle, Calendar } from "lucide-react"

export function WelcomeTab() {
  const { user } = useAuth()
  const [currentPeriod, setCurrentPeriod] = useState<any>(null)
  const [periods, setPeriods] = useState<any[]>([])
  const [displayStats, setDisplayStats] = useState({
    present: 0,
    absent: 0,
    total: 0,
    percentage: 0,
  })
  const [markedPeriodNumbers, setMarkedPeriodNumbers] = useState<number[]>([])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 60000) // Update every minute
    // Listen for attendance-updated event to refresh stats instantly
    const handler = () => loadData()
    window.addEventListener("attendance-updated", handler)
    return () => {
      clearInterval(interval)
      window.removeEventListener("attendance-updated", handler)
    }
  }, [user])

  const loadData = async () => {
    try {
      // Load periods and stats in parallel
      const [periodsResponse, statsResponse] = await Promise.all([
        apiService.getPeriods(),
        apiService.getAttendanceStats(),
      ])

      // Process periods
      const loadedPeriods =
        periodsResponse.success && Array.isArray(periodsResponse.data) ? periodsResponse.data : []
      setPeriods(loadedPeriods)

      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5)

      const activePeriod = loadedPeriods.find(
        (p: any) => currentTime >= p.startTime && currentTime <= p.endTime
      )
      setCurrentPeriod(activePeriod || null)

      // Process stats
      if (statsResponse.success && statsResponse.data && loadedPeriods.length > 0) {
        const stats = statsResponse.data
        // Only count periods marked as PRESENT
        const presentPeriodNumbers = (stats.attendanceList || [])
          .filter((a: any) => a.status === "PRESENT")
          .map((a: any) => a.periodNumber)
        setMarkedPeriodNumbers(presentPeriodNumbers)

        // New logic: Only count periods as absent if their endTime has passed and not marked present
        const nowTime = now.toTimeString().slice(0, 5)
        const absentPeriodsCount = loadedPeriods.filter(
          (p: any) =>
            !presentPeriodNumbers.includes(p.periodNumber) &&
            nowTime > p.endTime
        ).length
        const presentPeriodsCount = presentPeriodNumbers.length
        const totalPeriodsCount = loadedPeriods.length
        const percentage =
          totalPeriodsCount > 0 ? (presentPeriodsCount / totalPeriodsCount) * 100 : 0

        setDisplayStats({
          present: presentPeriodsCount,
          absent: absentPeriodsCount,
          total: totalPeriodsCount,
          percentage: Math.round(percentage),
        })
      }
    } catch (error) {
      console.error("Failed to load welcome data:", error)
    }
  }

  const getStatusMessage = () => {
    if (!currentPeriod) {
      return "No active period at this time"
    }
    if (markedPeriodNumbers.includes(currentPeriod.periodNumber)) {
      return `Attendance already marked for Period ${currentPeriod.periodNumber}`
    }
    return `Attendance is open for Period ${currentPeriod.periodNumber}`
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-stretch justify-center bg-transparent">
      <div className="w-full py-8 flex flex-col gap-8 glass-panel">
        {/* User Welcome Card */}
        <Card className="glass-panel p-0">
          <CardHeader className="pb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-1 flex items-center gap-2">
              <User className="h-7 w-7 text-purple-500" />
              <span>Welcome,</span>
              <span className="text-indigo-900">{user?.name}</span>
            </h1>
            <p className="text-base md:text-lg text-purple-500 font-medium">Your attendance dashboard overview</p>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mt-2">
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-indigo-400 mb-1">ID Number</span>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 text-indigo-800 font-mono text-lg font-semibold shadow-sm">
                  {user?.studentId}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="border-t border-indigo-200" />

        {/* Current Status Card */}
        <Card className="glass-panel p-0">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-purple-800 text-xl font-bold">
              <Clock className="h-6 w-6 text-indigo-500" />
              <span>Current Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                {currentPeriod ? (
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium shadow-sm">
                      <Clock className="h-5 w-5 text-purple-400" />
                      {getStatusMessage()}
                    </div>
                    <div className="text-sm text-indigo-600 mt-1">
                      Period {currentPeriod.periodNumber}: {currentPeriod.startTime} - {currentPeriod.endTime}
                    </div>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-medium shadow-sm">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    No active period at this time
                  </div>
                )}
              </div>
              {currentPeriod && (
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-700 text-white text-xs font-semibold shadow">Active Period</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="border-t border-purple-200" />

        {/* Today's Stats */}
        {periods.length > 0 && (
          <Card className="glass-panel p-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-pink-700">
                <Calendar className="h-6 w-6 text-pink-500" />
                <span>Today's Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-5 bg-green-50 rounded-xl shadow-sm">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-3xl font-bold text-green-700">{displayStats.present}</div>
                  <p className="text-base text-green-800 font-medium">Present</p>
                </div>
                <div className="flex flex-col items-center justify-center p-5 bg-red-50 rounded-xl shadow-sm">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                  <div className="text-3xl font-bold text-red-700">{displayStats.absent}</div>
                  <p className="text-base text-red-800 font-medium">Absent</p>
                </div>
                <div className="flex flex-col items-center justify-center p-5 bg-indigo-50 rounded-xl shadow-sm">
                  <Clock className="h-8 w-8 text-indigo-600 mb-2" />
                  <div className="text-3xl font-bold text-indigo-800">{displayStats.total}</div>
                  <p className="text-base text-indigo-800 font-medium">Total Periods</p>
                </div>
                <div className="flex flex-col items-center justify-center p-5 bg-purple-50 rounded-xl shadow-sm">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-200 mb-2">
                    <span className="text-2xl font-bold text-purple-700">%</span>
                  </span>
                  <div className="text-3xl font-bold text-purple-800">{displayStats.percentage}%</div>
                  <p className="text-base text-purple-800 font-medium">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
