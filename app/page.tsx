"use client"
import { useAuth } from "./contexts/auth-context"
import { LoginForm } from "./components/login-form"
import { Dashboard } from "./components/dashboard"
import { Loader2 } from "lucide-react"

export default function SmartAttendance() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading Smart Attendance System...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <Dashboard />
}
