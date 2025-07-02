"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw, Server } from "lucide-react"
import { faceRecognitionAPI } from "../services/face-recognition-api"

export function ServiceStatus() {
  const [serviceStatus, setServiceStatus] = useState<{
    isOnline: boolean
    lastCheck: Date | null
    knownFaces: number
    error?: string
  }>({
    isOnline: false,
    lastCheck: null,
    knownFaces: 0,
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkServiceStatus = async () => {
    setIsChecking(true)

    try {
      const response = await faceRecognitionAPI.healthCheck()
      setServiceStatus({
        isOnline: true,
        lastCheck: new Date(),
        knownFaces: response.known_faces || 0,
      })
    } catch (error) {
      setServiceStatus({
        isOnline: false,
        lastCheck: new Date(),
        knownFaces: 0,
        error: error instanceof Error ? error.message : "Service unavailable",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkServiceStatus()

    // Check service status every 30 seconds
    const interval = setInterval(checkServiceStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Face Recognition Service Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {serviceStatus.isOnline ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}

            <div>
              <div className="flex items-center gap-2">
                <Badge variant={serviceStatus.isOnline ? "default" : "destructive"}>
                  {serviceStatus.isOnline ? "Online" : "Offline"}
                </Badge>
                <span className="text-sm text-gray-600">{serviceStatus.knownFaces} registered faces</span>
              </div>

              {serviceStatus.lastCheck && (
                <p className="text-xs text-gray-500 mt-1">
                  Last checked: {serviceStatus.lastCheck.toLocaleTimeString()}
                </p>
              )}

              {serviceStatus.error && <p className="text-xs text-red-600 mt-1">Error: {serviceStatus.error}</p>}
            </div>
          </div>

          <Button onClick={checkServiceStatus} disabled={isChecking} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {!serviceStatus.isOnline && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Face Recognition Service is offline.</strong>
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              To start the service, run: <code>python scripts/face_recognition_service.py</code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
