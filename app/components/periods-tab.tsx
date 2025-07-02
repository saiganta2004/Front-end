"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { apiService } from "../services/api"
import { useAuth } from "../contexts/auth-context"

interface Period {
  id: number
  periodNumber: number
  startTime: string
  endTime: string
  active: boolean
}

export function PeriodsTab() {
  const { user } = useAuth();
  const [periods, setPeriods] = useState<Period[]>([])
  const [markedPeriodNumbers, setMarkedPeriodNumbers] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [periodsRes, statsRes] = await Promise.all([
          apiService.getPeriods(),
          apiService.getAttendanceStats(),
        ])
        if (periodsRes.success && periodsRes.data) setPeriods(periodsRes.data as Period[])
        if (statsRes.success && statsRes.data) {
          const stats = statsRes.data
          const markedStatuses = ["PRESENT", "LATE", "ABSENT", "EXCUSED"];
          const markedPeriodNumbers = (stats.attendanceList || [])
            .filter((a: any) => markedStatuses.includes(a.status))
            .map((a: any) => a.periodNumber)
          setMarkedPeriodNumbers(markedPeriodNumbers)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // Listen for attendance-updated event to refresh periods and stats
    const handler = () => fetchData()
    window.addEventListener("attendance-updated", handler)
    return () => window.removeEventListener("attendance-updated", handler)
  }, [user])

  return (
    <div className="space-y-6 w-full">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Clock className="h-5 w-5 text-indigo-500" />
            Today&rsquo;s Periods
          </CardTitle>
          <CardDescription className="text-purple-600">Timetable for the current day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {periods.map((p, idx) => {
              const now = new Date()
              const currentTime = now.toTimeString().slice(0, 5)
              const isActive = currentTime >= p.startTime && currentTime <= p.endTime
              const isOver = currentTime > p.endTime
              const isMarked = markedPeriodNumbers.includes(p.periodNumber)
              let statusText = ""
              let badgeColor = ""
              let icon = null
              if (isMarked) {
                statusText = `Attendance marked${isActive ? ' (current period)' : ''}`
                badgeColor = "bg-green-100 text-green-700 border-green-300"
                icon = <CheckCircle className="h-5 w-5 text-green-500" />
              } else if (isActive) {
                statusText = "Attendance open"
                badgeColor = "bg-blue-100 text-blue-700 border-blue-300"
                icon = <Clock className="h-5 w-5 text-blue-500" />
              } else if (isOver) {
                statusText = "Period over, not marked"
                badgeColor = "bg-red-100 text-red-700 border-red-300"
                icon = <AlertCircle className="h-5 w-5 text-red-500" />
              } else {
                statusText = "Upcoming"
                badgeColor = "bg-gray-100 text-gray-700 border-gray-300"
                icon = <Clock className="h-5 w-5 text-gray-400" />
              }
              return (
                <div
                  key={p.id}
                  className={`relative flex items-center gap-4 p-4 rounded-xl border glass-panel transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg ${badgeColor}`}
                >
                  {/* Timeline dot/line */}
                  <div className="flex flex-col items-center">
                    <span className={`w-4 h-4 rounded-full ${isMarked ? 'bg-green-500' : isActive ? 'bg-blue-500' : isOver ? 'bg-red-500' : 'bg-gray-300'} border-2 border-white shadow`} />
                    {idx < periods.length - 1 && <span className="w-1 h-8 bg-gray-200 mt-1 mb-1 rounded" />}
                  </div>
                  {/* Period Info */}
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                    <span className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      {icon}
                      Period {p.periodNumber}
                    </span>
                    <span className="ml-2 text-gray-600 font-mono text-base">
                      {p.startTime} - {p.endTime}
                    </span>
                  </div>
                  {/* Status Badge */}
                  <span className={`ml-2 px-3 py-1 rounded-full border font-semibold text-xs ${badgeColor}`}>{statusText}</span>
                </div>
              )
            })}
            {periods.length === 0 && <p className="text-center text-gray-500">No periods configured.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
