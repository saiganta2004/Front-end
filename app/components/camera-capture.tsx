"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Loader2, AlertCircle } from "lucide-react"
import { useCamera } from "@/hooks/use-camera"

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void
  isCapturing?: boolean
  title?: string
  description?: string
}

export function CameraCapture({ onCapture, isCapturing = false, title, description }: CameraCaptureProps) {
  const { cameraState, videoRef, canvasRef, captureFrame } = useCamera()

  const handleCaptureClick = () => {
    const frame = captureFrame()
    if (frame) {
      onCapture(frame)
    }
  }

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200 bg-white transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Camera className="h-5 w-5" />
          {title || "Camera Capture"}
        </CardTitle>
        {description && <CardDescription className="text-gray-500">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              cameraState.isReady ? "opacity-100" : "opacity-0"
            }`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Loading State */}
          {!cameraState.isReady && !cameraState.error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-900 bg-white bg-opacity-80">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-2 text-sm">Starting camera...</p>
            </div>
          )}

          {/* Error State */}
          {cameraState.error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-white bg-red-900 bg-opacity-80 rounded-xl">
              <AlertCircle className="h-8 w-8" />
              <p className="mt-2 text-sm font-medium">{cameraState.error}</p>
            </div>
          )}

          {/* Face Guide Overlay */}
          {cameraState.isReady && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2/3 h-2/3 border-4 border-blue-400 face-guide-animate rounded-full opacity-70 shadow-lg transition-all duration-300" />
            </div>
          )}
        </div>

        <Button
          onClick={handleCaptureClick}
          disabled={!cameraState.isReady || isCapturing}
          className="w-full mt-6 py-3 text-lg font-semibold rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200"
        >
          {isCapturing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-5 w-5" />
              Capture
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
