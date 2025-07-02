"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CameraCapture } from "./camera-capture"

interface Period {
  id: string
  name: string
  start: string
  end: string
}

interface AttendanceRecord {
  periods: {
    [key: string]: {
      marked: boolean
      time?: string
      status: "present" | "absent" | "late"
    }
  }
}

interface AttendanceMarkerProps {
  periods: Period[]
  currentPeriod: string | null
  todayAttendance: AttendanceRecord | undefined
  onAttendanceMarked: (periodId: string, time: string, status: "present" | "late") => void
}

export function AttendanceMarker({
  periods,
  currentPeriod,
  todayAttendance,
  onAttendanceMarked,
}: AttendanceMarkerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const { toast } = useToast()

  const canMarkAttendance = (periodId: string) => {
    // Allow marking attendance at any time except for breaks
    return periodId !== "break"
  }

  const getAttendanceStatus = (periodId: string): "present" | "late" => {
    // Always return 'present' since late logic is removed
    return "present"
  }

  // Replace the simulateFaceRecognition function with:
  const handleFaceRecognition = async (imageBase64: string, periodId: string | number) => {
    setIsScanning(true)
    setScanResult(null)

    try {
      const payload = { image: imageBase64, periodId: Number(periodId) }
      console.log("[DEBUG] Sending attendance payload:", payload)
      // Send both image and periodId to the backend, ensure periodId is a number
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (response.ok && data && data.status !== 'error') {
        const currentTime = new Date().toTimeString().slice(0, 5)
        const status = getAttendanceStatus(String(periodId))

        setScanResult("success")
        onAttendanceMarked(String(periodId), currentTime, status)

        toast({
          title: "Attendance Marked Successfully",
          description: `Your attendance for ${periods.find((p) => p.id === periodId)?.name} has been recorded as ${status}`,
        })
      } else {
        setScanResult("failed")
        toast({
          title: "Face Recognition Failed",
          description: data.error || data.message || "Face not recognized. Please ensure you are registered in the system.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setScanResult("failed")
      console.error("Face recognition error:", error)
      toast({
        title: "Recognition Error",
        description: "Could not connect to face recognition service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
      setTimeout(() => setScanResult(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Face Recognition Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Face Recognition Scanner
          </CardTitle>
          <CardDescription>Use face recognition to mark your attendance for the current period</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Replace the face recognition scanner section in the JSX with: */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <CameraCapture
                onCapture={(imageBase64) => {
                  if (!currentPeriod || currentPeriod === "break") {
                    console.error("[AttendanceMarker] Invalid or null currentPeriod:", currentPeriod)
                    toast({
                      title: "Cannot Mark Attendance",
                      description: "No valid period is active. Please wait for a valid period.",
                      variant: "destructive",
                    })
                    return
                  }
                  console.log("[AttendanceMarker] Marking attendance for periodId:", currentPeriod)
                  handleFaceRecognition(imageBase64, currentPeriod)
                }}
                isCapturing={isScanning}
                title="Face Recognition Scanner"
                description="Position your face in the camera and click capture to mark attendance"
              />

              {scanResult === "success" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-green-800 font-medium">Face recognized successfully!</p>
                  </div>
                </div>
              )}

              {scanResult === "failed" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-800 font-medium">Face recognition failed</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Real-time Face Recognition:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Uses OpenCV and FaceNet for accurate recognition</li>
                  <li>• Confidence threshold: 85% for security</li>
                  <li>• Face encodings are encrypted and stored securely</li>
                  <li>• Works in various lighting conditions</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">For Best Results:</h4>
                    <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                      <li>• Ensure good lighting on your face</li>
                      <li>• Look directly at the camera</li>
                      <li>• Remove glasses or masks if possible</li>
                      <li>• Keep your face within the circle guide</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Period-wise attendance status for {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {periods.map((period) => {
              const attendance = todayAttendance?.periods[period.id]
              const isActive = currentPeriod === period.id
              const canMark = canMarkAttendance(period.id)

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
                      <p className="font-medium">{period.name}</p>
                      <p className="text-sm text-gray-600">
                        {period.start} - {period.end}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {period.id === "break" ? (
                      <Badge variant="secondary">Break</Badge>
                    ) : attendance?.marked ? (
                      <div className="flex items-center gap-2">
                        <Badge variant={attendance.status === "present" ? "default" : "destructive"}>
                          {attendance.status} at {attendance.time}
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    ) : isActive && canMark ? (
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
    </div>
  )
}
