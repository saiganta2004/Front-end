"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Camera } from "lucide-react"

interface AttendanceFormProps {
  onCheckIn?: (name: string, email: string) => void
}

export function AttendanceForm({ onCheckIn }: AttendanceFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckIn = () => {
    if (onCheckIn) {
      onCheckIn(name, email)
    }
    // Default behavior if no onCheckIn provided
    console.log('Check in:', { name, email })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    handleCheckIn()
    setName("")
    setEmail("")
    setIsSubmitting(false)
  }

  const handleFaceRecognition = () => {
    // Simulate face recognition
    const mockUsers = [
      { name: "Alice Johnson", email: "alice@example.com" },
      { name: "Bob Wilson", email: "bob@example.com" },
      { name: "Carol Davis", email: "carol@example.com" },
    ]

    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    setName(randomUser.name)
    setEmail(randomUser.email)
  }

  return (
    <div className="glass-panel w-full mt-10 p-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <UserPlus className="h-7 w-7 text-indigo-400" /> Register Attendance
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-lg text-gray-700">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-2 p-3 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-lg text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-2 p-3 rounded-xl border border-gray-300 bg-white/70 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="flex gap-4 items-center">
          <Button type="submit" className="fancy-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>
          <Button type="button" className="fancy-btn bg-gradient-to-tr from-blue-400 via-green-400 to-cyan-400" onClick={handleFaceRecognition}>
            <Camera className="h-5 w-5 mr-2" /> Use Face Recognition
          </Button>
        </div>
      </form>
    </div>
  )
}
