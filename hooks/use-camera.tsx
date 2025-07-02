"use client"

import { useState, useEffect, useRef } from "react"

export interface CameraState {
  stream: MediaStream | null
  error: string | null
  isReady: boolean
}

export const useCamera = () => {
  const [cameraState, setCameraState] = useState<CameraState>({
    stream: null,
    error: null,
    isReady: false,
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const enableCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          })
          setCameraState({ stream, error: null, isReady: true })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err: any) {
          let errorMessage = "Unable to access camera. Please check permissions."
          if (err.name === "NotAllowedError") {
            errorMessage = "Camera access was denied. Please allow camera access in your browser settings."
          } else if (err.name === "NotFoundError") {
            errorMessage = "No camera found. Please ensure a camera is connected."
          }
          setCameraState({ stream: null, error: errorMessage, isReady: false })
        }
      } else {
        setCameraState({
          stream: null,
          error: "Your browser does not support camera access.",
          isReady: false,
        })
      }
    }

    enableCamera()

    return () => {
      cameraState.stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      return null
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return null

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get the image data from the canvas
    return canvas.toDataURL("image/jpeg")
  }

  return { cameraState, videoRef, canvasRef, captureFrame }
}
