"use client"

import React, { useRef, useState, useEffect } from "react"
import Webcam from "react-webcam"
import * as faceapi from "face-api.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "../contexts/auth-context"
import { Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RegisterRequest } from "../types"

export function RegisterForm() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    studentId: "",
  })
  const [faceData, setFaceData] = useState<string | null>(null)
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
      } catch (error) {
        console.error("Failed to load face-api models", error);
        toast({ title: "Initialization Error", description: "Could not load face models.", variant: "destructive" });
      }
    };
    loadModels();
  }, [toast]);

  // Draw face overlays (optimized for performance)
  useEffect(() => {
    if (!faceDetectionEnabled) return; // Only run when enabled
    
    let interval: ReturnType<typeof setInterval>;
    let isProcessing = false;
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    const draw = async () => {
      if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;
      const displaySize = { width: 320, height: 240 };
      faceapi.matchDimensions(canvas, displaySize);
      
      interval = setInterval(async () => {
        // Skip if already processing to prevent lag
        if (isProcessing || video.paused || video.ended) return;
        
        try {
          isProcessing = true;
          const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
          );
          const resized = faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resized);
          }
        } catch (error) {
          console.warn("Face detection error:", error);
        } finally {
          isProcessing = false;
        }
      }, 500); // Reduced frequency from 100ms to 500ms for better performance
    };
    
    if (video.readyState >= 2) {
      draw();
    } else {
      video?.addEventListener("loadeddata", draw);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      video?.removeEventListener("loadeddata", draw);
      // Clear canvas when disabling
      const ctx = canvas?.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [webcamRef.current, faceDetectionEnabled]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const capture = () => webcamRef.current?.getScreenshot()

  const handleFaceCapture = async () => {
    const imageSrc = capture()
    if (!imageSrc) {
      toast({ title: "Capture Error", description: "Could not capture image from webcam.", variant: "destructive" });
      return;
    }

    setIsCapturing(true)
    try {
      const imageElement = document.createElement('img');
      // Wait for image to load before passing to face-api
      await new Promise((resolve, reject) => {
        imageElement.onload = resolve;
        imageElement.onerror = reject;
        imageElement.src = imageSrc;
      });

      const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setFaceData(imageSrc); // Show the captured image
        setFaceDescriptor(detection.descriptor); // Store the descriptor
        toast({
          title: "Face Captured Successfully",
          description: "Your facial features have been encoded.",
        });
      } else {
        setFaceData(null);
        setFaceDescriptor(null);
        toast({
          title: "Face Capture Failed",
          description: "No face detected. Please make sure your face is clearly visible and within the frame.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Face capture error:", error);
      toast({
        title: "Face Capture Failed",
        description: "Could not process your face. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!faceDescriptor) {
      toast({
        title: "Face Data Required",
        description: "Please capture your face before registering.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const registrationData: RegisterRequest = {
      name: formData.name,
      studentId: formData.studentId,
      username: formData.email, // Using email as username for login
      email: formData.email,
      password: formData.password,
      faceEmbedding: Array.from(faceDescriptor), // Convert Float32Array to a plain array
    };

    try {
      await register(registrationData); // Call context's register function with the single object
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
      // Reset form
      setFormData({ name: "", email: "", password: "", role: "student", department: "", studentId: "" });
      setFaceData(null);
      setFaceDescriptor(null);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur rounded-xl shadow-xl border border-white/20">
      <CardHeader>
        <CardTitle>Create New Account</CardTitle>
        <CardDescription>Register with your details and face recognition.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required className="bg-white/40 text-gray-900 placeholder-gray-400 border border-white/30 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required className="bg-white/40 text-gray-900 placeholder-gray-400 border border-white/30 focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required className="bg-white/40 text-gray-900 placeholder-gray-400 border border-white/30 focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className="bg-white/40 text-gray-900 border border-white/30 focus:ring-2 focus:ring-blue-400"><SelectValue placeholder="Select your role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId" className="text-white">Student/Employee ID</Label>
              <Input
                id="studentId"
                placeholder="Enter your student or employee ID"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                required
                className="bg-white/40 text-gray-900 placeholder-gray-400 border border-white/30 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg bg-white/20 backdrop-blur-md border-white/30">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-white" />
              <Label className="text-base font-medium text-white">Face Recognition Setup</Label>
            </div>
            <div className="flex justify-center relative w-[320px] h-[240px] mx-auto">
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={320} height={240} videoConstraints={{ facingMode: "user" }} className="rounded-md" />
              {faceData && <img src={faceData} alt="Captured face" className="absolute inset-0 w-full h-full rounded-md" />}
            </div>
            <Button type="button" onClick={handleFaceCapture} className="w-full" disabled={isCapturing}>
              {isCapturing ? "Processing..." : "1. Capture Face"}
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !faceDescriptor}>
            {isLoading ? "Creating Account..." : "2. Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function RegisterAttendance() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);

  // Start camera
  const startCamera = async () => {
    setCaptured(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setStreaming(false);
    }
  };

  // Capture face
  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        setCaptured(canvasRef.current.toDataURL("image/png"));
      }
    }
    stopCamera();
  };

  // Send captured image to backend (implement this as needed)
  const submitAttendance = async () => {
    if (!captured) return;
    // Example: send to backend
    // await fetch("/api/attendance/mark", { method: "POST", body: JSON.stringify({ image: captured }) });
    alert("Attendance submitted (implement backend call)");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!streaming && !captured && (
        <button onClick={startCamera} className="bg-blue-600 text-white px-4 py-2 rounded">Start Camera</button>
      )}
      {streaming && (
        <div>
          <video ref={videoRef} width={320} height={240} autoPlay className="rounded border" />
          <div className="flex gap-2 mt-2">
            <button onClick={capture} className="bg-green-600 text-white px-4 py-2 rounded">Capture</button>
            <button onClick={stopCamera} className="bg-red-600 text-white px-4 py-2 rounded">Stop</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />
      {captured && (
        <div className="flex flex-col items-center gap-2">
          <img src={captured} alt="Captured face" className="rounded border" />
          <button onClick={submitAttendance} className="bg-blue-700 text-white px-4 py-2 rounded">Submit Attendance</button>
          <button onClick={() => setCaptured(null)} className="text-sm text-gray-500 underline">Retake</button>
        </div>
      )}
    </div>
  );
}
