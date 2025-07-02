"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Download } from "lucide-react"

interface Period {
  id: string
  name: string
  start: string
  end: string
}

interface AttendanceRecord {
  id: string
  userId: string
  date: string
  periods: {
    [key: string]: {
      marked: boolean
      time?: string
      status: "present" | "absent" | "late"
    }
  }
}

interface AttendanceReportsProps {
  attendanceRecords: AttendanceRecord[]
  periods: Period[]
  userId: string
}

export function AttendanceReports({ attendanceRecords, periods, userId }: AttendanceReportsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [reportType, setReportType] = useState("daily")

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const sampleData = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const record: AttendanceRecord = {
        id: `sample-${i}`,
        userId,
        date: date.toISOString().split("T")[0],
        periods: {},
      }

      periods
        .filter((p) => p.id !== "break")
        .forEach((period) => {
          const random = Math.random()
          if (random > 0.2) {
            // 80% attendance rate
            record.periods[period.id] = {
              marked: true,
              time: period.start,
              status: random > 0.9 ? "late" : "present",
            }
          } else {
            record.periods[period.id] = {
              marked: false,
              status: "absent",
            }
          }
        })

      sampleData.push(record)
    }

    return sampleData
  }

  const sampleData = generateSampleData()
  const allRecords = [...attendanceRecords, ...sampleData]

  const getAttendanceStats = (records: AttendanceRecord[]) => {
    const validPeriods = periods.filter((p) => p.id !== "break")
    let totalPeriods = 0
    let presentCount = 0
    let lateCount = 0
    let absentCount = 0

    records.forEach((record) => {
      validPeriods.forEach((period) => {
        totalPeriods++
        const attendance = record.periods[period.id]
        if (attendance?.marked) {
          if (attendance.status === "present") presentCount++
          else if (attendance.status === "late") lateCount++
        } else {
          absentCount++
        }
      })
    })

    return {
      total: totalPeriods,
      present: presentCount,
      late: lateCount,
      absent: absentCount,
      percentage: totalPeriods > 0 ? Math.round(((presentCount + lateCount) / totalPeriods) * 100) : 0,
    }
  }

  const getFilteredRecords = () => {
    const userRecords = allRecords.filter((r) => r.userId === userId)

    switch (reportType) {
      case "daily":
        return selectedDate ? userRecords.filter((r) => r.date === selectedDate.toISOString().split("T")[0]) : []
      case "weekly":
        const weekStart = new Date(selectedDate || new Date())
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        return userRecords.filter((r) => {
          const recordDate = new Date(r.date)
          return recordDate >= weekStart && recordDate <= weekEnd
        })
      case "monthly":
        const month = (selectedDate || new Date()).getMonth()
        const year = (selectedDate || new Date()).getFullYear()
        return userRecords.filter((r) => {
          const recordDate = new Date(r.date)
          return recordDate.getMonth() === month && recordDate.getFullYear() === year
        })
      default:
        return userRecords
    }
  }

  const filteredRecords = getFilteredRecords()
  const stats = getAttendanceStats(filteredRecords)

  const exportReport = () => {
    const csvContent = [
      ["Date", "Period", "Status", "Time"],
      ...filteredRecords.flatMap((record) =>
        periods
          .filter((p) => p.id !== "break")
          .map((period) => [
            record.date,
            period.name,
            record.periods[period.id]?.status || "absent",
            record.periods[period.id]?.time || "-",
          ]),
      ),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-report-${reportType}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Attendance Reports
          </CardTitle>
          <CardDescription>View and analyze your attendance patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <div className="border rounded-md p-2">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="w-auto" />
              </div>
            </div>

            <Button onClick={exportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Periods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.percentage}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Records */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Attendance Records</CardTitle>
          <CardDescription>
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} attendance breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No attendance records found for the selected period</div>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{new Date(record.date).toLocaleDateString()}</h4>
                    <Badge variant="outline">
                      {periods.filter((p) => p.id !== "break" && record.periods[p.id]?.marked).length} /{" "}
                      {periods.filter((p) => p.id !== "break").length} periods
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {periods
                      .filter((p) => p.id !== "break")
                      .map((period) => {
                        const attendance = record.periods[period.id]
                        return (
                          <div key={period.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{period.name}</span>
                            <div className="flex items-center gap-2">
                              {attendance?.marked ? (
                                <>
                                  <Badge
                                    variant={
                                      attendance.status === "present"
                                        ? "default"
                                        : attendance.status === "late"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {attendance.status}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{attendance.time}</span>
                                </>
                              ) : (
                                <Badge variant="destructive" className="text-xs">
                                  absent
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
