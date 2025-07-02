"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Clock } from "lucide-react"

interface AttendanceRecord {
  id: string
  name: string
  email: string
  checkIn: Date
  checkOut?: Date
  status: "present" | "absent" | "late"
}

interface AttendanceListProps {
  records: AttendanceRecord[]
  onCheckOut: (id: string) => void
}

export function AttendanceList({ records, onCheckOut }: AttendanceListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "absent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (checkIn: Date, checkOut?: Date) => {
    const end = checkOut || new Date()
    const diff = end.getTime() - checkIn.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
        <CardDescription>Real-time attendance tracking for {new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No attendance records for today</div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {record.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium">{record.name}</h3>
                    <p className="text-sm text-gray-500">{record.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>In: {formatTime(record.checkIn)}</span>
                    </div>
                    {record.checkOut && <div className="text-sm text-gray-500">Out: {formatTime(record.checkOut)}</div>}
                    <div className="text-xs text-gray-400">
                      Duration: {calculateDuration(record.checkIn, record.checkOut)}
                    </div>
                  </div>

                  <Badge className={getStatusColor(record.status)}>{record.status}</Badge>

                  {!record.checkOut && (
                    <Button size="sm" variant="outline" onClick={() => onCheckOut(record.id)}>
                      <LogOut className="h-4 w-4 mr-1" />
                      Check Out
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
