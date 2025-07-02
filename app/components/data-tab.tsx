"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { apiService } from "../services/api"
import { useAuth } from "../contexts/auth-context"

interface Attendance {
  date: string
  periodNumber: number
  status: "PRESENT" | "ABSENT"
}

export function DataTab() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [records, setRecords] = useState<Attendance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadData = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const resp = await apiService.getAttendanceCalendar()
      if (resp?.success && Array.isArray(resp.data)) {
        setRecords(resp.data)
      } else {
        setRecords([])
      }
    } catch (e) {
      console.error(e)
      setRecords([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const renderDot = (date: Date) => {
    const iso = date.toISOString().split("T")[0]
    const hasPresent = records.some((r) => r.date === iso && r.status === "PRESENT")
    const hasAbsent = records.some((r) => r.date === iso && r.status === "ABSENT")
    if (!hasPresent && !hasAbsent) return null
    return (
      <div
        className={`mx-auto mt-0.5 h-1.5 w-1.5 rounded-full ${
          hasPresent ? "bg-green-500" : hasAbsent ? "bg-red-500" : "bg-gray-400"
        }`}
      />
    )
  }

  return (
    <div className="space-y-6 w-full">
      <Card className="glass-panel p-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 text-2xl font-bold">
            <CalendarIcon className="h-7 w-7 text-blue-500" />
            Attendance Calendar
          </CardTitle>
          <CardDescription className="text-blue-500">Select a date to view period-wise details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-2xl border border-blue-200 shadow bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4"
                modifiers={{ record: (date) => renderDot(date) !== null, today: (date) => {
                  const today = new Date();
                  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
                }}}
                modifiersClassNames={{
                  record: '',
                  today: 'border-2 border-blue-500 rounded-full',
                }}
                components={{
                  Day: (props) => (
                    <div className="relative group">
                      <span className="block w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-150 group-hover:bg-blue-100">
                        {props.date.getDate()}
                      </span>
                      {renderDot(props.date)}
                    </div>
                  ),
                }}
                footer={
                  selectedDate && (
                    <div className="flex items-center justify-center mt-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shadow">
                        {records.filter((r) => r.date === selectedDate.toISOString().split("T")[0]).length} period records
                      </span>
                    </div>
                  )
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DataTab
