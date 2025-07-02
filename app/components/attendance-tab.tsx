"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CameraCapture } from "./camera-capture"
import { apiService } from "../services/api"
import { Camera, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function AttendanceTab() {
  const [isMarking, setIsMarking] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const [currentPeriod, setCurrentPeriod] = useState<any>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<string>("")
  const [todayAttendance, setTodayAttendance] = useState<any[]>([])
  const { toast } = useToast()

  // Move fetchPeriods outside useEffect so it can be reused
  const fetchPeriodsAndAttendance = async () => {
    try {
      const [periodsResponse, todayAttendanceResponse] = await Promise.all([
        apiService.getPeriods(),
        apiService.getTodayAttendance(),
      ])
      if (periodsResponse.success && Array.isArray(periodsResponse.data)) {
        const now = new Date()
        const currentTime = now.toTimeString().slice(0, 5)
        const activePeriod = periodsResponse.data.find(
          (p: any) => currentTime >= p.startTime && currentTime <= p.endTime
        )
        setCurrentPeriod(activePeriod || null)
      }
      if (todayAttendanceResponse.success && Array.isArray(todayAttendanceResponse.data)) {
        setTodayAttendance(todayAttendanceResponse.data)
        console.log("[DEBUG] todayAttendanceResponse:", todayAttendanceResponse.data)
      }
    } catch (error) {
      console.error("Failed to fetch periods or attendance", error)
    }
  }

  useEffect(() => {
    fetchPeriodsAndAttendance()
    const interval = setInterval(fetchPeriodsAndAttendance, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!currentPeriod) {
      setAttendanceStatus("No active period for attendance.")
      return
    }
    // Check if attendance is already marked for this period
    const alreadyMarked = todayAttendance.some((a: any) => a.periodId === currentPeriod.id)
    if (alreadyMarked) {
      setAttendanceStatus(`Attendance already marked for Period ${currentPeriod.periodNumber}.`)
      return
    }
    setAttendanceStatus(`You can mark attendance for Period ${currentPeriod.periodNumber}.`)
  }, [currentPeriod, todayAttendance])


  const handleFaceCapture = async (imageBase64: string) => {
    if (!currentPeriod || !currentPeriod.id) {
      toast({
        title: "No Active Period",
        description: "There is no active period to mark attendance for.",
        variant: "destructive",
      })
      return
    }

    if (!imageBase64 || imageBase64.length < 100 || !imageBase64.startsWith("data:image/")) {
      toast({
        title: "No Image Captured",
        description: "Please capture a clear image before submitting.",
        variant: "destructive",
      })
      return
    }

    const periodId = Number(currentPeriod.id)
    if (isNaN(periodId)) {
      toast({
        title: "Invalid Period",
        description: "The current period ID is invalid.",
        variant: "destructive",
      })
      return
    }

    // Remove data:image/...;base64, prefix if present
    let cleanBase64 = imageBase64
    const commaIdx = imageBase64.indexOf(',')
    if (commaIdx !== -1) {
      cleanBase64 = imageBase64.slice(commaIdx + 1)
    }

    const payload = { image: cleanBase64, periodId }

    setIsMarking(true)
    setLastResult(null)

    try {
      const response = await apiService.markAttendance(payload)
      setLastResult(response)

      if (response.success) {
        toast({
          title: "Attendance Marked Successfully",
          description: response.message || `Your attendance has been recorded for Period ${response.data?.period?.periodNumber}.`,
        })
        setTodayAttendance((prev) => [
          ...prev,
          { periodId: currentPeriod.id },
        ])
        fetchPeriodsAndAttendance()
        window.dispatchEvent(new Event("attendance-updated"))
      } else if (
        response.message &&
        response.message.toLowerCase().includes("already marked")
      ) {
        toast({
          title: "Attendance Already Marked",
          description: `Attendance already marked for Period ${currentPeriod.periodNumber}.`,
          variant: "destructive",
        })
        setAttendanceStatus(`Attendance already marked for Period ${currentPeriod.periodNumber}.`)
        setTodayAttendance((prev) => [
          ...prev,
          { periodId: currentPeriod.id },
        ])
        setLastResult({ success: false, message: `Attendance already marked for Period ${currentPeriod.periodNumber}.` })
      } else {
        toast({
          title: "Attendance Failed",
          description: "Could not mark attendance. Please try again.",
          variant: "destructive",
        })
        setLastResult({ success: false, message: "Could not mark attendance. Please try again." })
      }
    } catch (error: any) {
      let errorMessage = error?.response?.data?.message || error?.message || "Could not mark attendance. Please try again."
      if (errorMessage.toLowerCase().includes("already marked")) {
        errorMessage = `Attendance already marked for Period ${currentPeriod?.periodNumber}.`
        setAttendanceStatus(errorMessage)
        setTodayAttendance((prev) => [
          ...prev,
          { periodId: currentPeriod?.id },
        ])
      } else if (errorMessage.toLowerCase().includes("face recognized does not match")) {
        errorMessage = "Face does not match the logged-in user. Please try again."
        setAttendanceStatus(errorMessage)
      }
      setLastResult({ success: false, message: errorMessage })
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <div className="py-6 px-2 md:px-8">
      <Card className="shadow-xl rounded-2xl border border-gray-200 glass-panel">
        <CardHeader className="glass-panel rounded-t-2xl border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Camera className="h-5 w-5" />
            Register Attendance
          </CardTitle>
          <CardDescription className="text-gray-500">Use face recognition to mark your attendance for the current period.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col md:flex-row gap-8 md:gap-10 items-stretch md:items-start transition-all duration-300"
            style={{ minHeight: 420 }}
          >
            {/* Left: Face Recognition Section */}
            <div className="flex-1 flex flex-col items-center justify-center w-full glass-panel">
              <div className="w-full">
                <CameraCapture
                  onCapture={handleFaceCapture}
                  isCapturing={isMarking}
                  title="Face Recognition Scanner"
                  description="Position your face in the camera's view and click capture."
                />
              </div>
            </div>

            {/* Right: Status + How it Works + Best Results */}
            <div className="flex-1 flex flex-col gap-4 w-full glass-panel">
              {/* Status Badge */}
              <div className="flex items-center gap-3 mb-2">
                {isMarking ? (
                  <Badge className="bg-yellow-400 text-yellow-900 animate-pulse">Active</Badge>
                ) : lastResult && lastResult.success ? (
                  <Badge className="bg-green-500 text-white">Success</Badge>
                ) : lastResult && !lastResult.success &&
                  lastResult.message &&
                  !lastResult.message.toLowerCase().includes("already marked") ? (
                  <Badge className="bg-red-500 text-white">Error</Badge>
                ) : (
                  <Badge className="bg-gray-300 text-gray-700">Inactive</Badge>
                )}
                <span className="text-sm text-gray-600 font-medium">
                  {isMarking
                    ? "Processing..."
                    : lastResult && lastResult.success
                    ? "Attendance marked"
                    : lastResult && !lastResult.success &&
                      lastResult.message &&
                      !lastResult.message.toLowerCase().includes("already marked")
                    ? "Error"
                    : "Ready"}
                </span>
              </div>

              {/* Current Status */}
              <Card className="bg-gray-50 border border-gray-200 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPeriod ? (
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      <p className="text-sm text-gray-700">{attendanceStatus}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-yellow-500" />
                      <p className="text-sm text-gray-700">No active period for attendance.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* How it Works */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm transition-all duration-300">
                <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Face recognition uses AI to verify your identity.</li>
                  <li>Attendance can only be marked within the period time.</li>
                  <li>Your face data is encrypted and stored securely.</li>
                  <li>Each period can only be marked once.</li>
                </ul>
              </div>

              {/* Best Results */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 shadow-sm transition-all duration-300">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">For Best Results:</h4>
                    <ul className="text-sm text-yellow-800 mt-1 space-y-1 list-disc list-inside">
                      <li>Ensure good lighting on your face.</li>
                      <li>Look directly at the camera.</li>
                      <li>Remove glasses or masks if possible.</li>
                      <li>Keep your face within the guide circle.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <style jsx global>{`
        .face-guide-animate {
          animation: faceGuidePulse 2s infinite;
        }
        @keyframes faceGuidePulse {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.2); }
          70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
      `}</style>
    </div>
  )
}
