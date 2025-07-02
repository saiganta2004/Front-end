"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "../contexts/auth-context"
import { RegisterForm } from "./register-form"
import { Brain, Shield, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login({ username, password }) // If no error, login is successful
      toast({
        title: "Login Successful",
        description: "Welcome to the Smart Attendance System",
      })
    } catch (err) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Centered Login Card with Glassmorphism */}
      <div className="relative z-10 w-full px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white drop-shadow">Smart Face Recognition</h1>
          </div>
          <p className="text-xl text-gray-200 drop-shadow">AI-Powered Attendance Management System</p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 w-full">
          <div className="text-center p-6 bg-white/20 backdrop-blur-md rounded-lg shadow-sm border border-white/30">
            <Brain className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-white">AI Face Recognition</h3>
            <p className="text-sm text-gray-100">Advanced facial recognition using OpenCV and FaceNet</p>
          </div>
          <div className="text-center p-6 bg-white/20 backdrop-blur-md rounded-lg shadow-sm border border-white/30">
            <Clock className="h-12 w-12 text-green-300 mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-white">Time-Based Attendance</h3>
            <p className="text-sm text-gray-100">Automated time windows with 15-minute marking periods</p>
          </div>
          <div className="text-center p-6 bg-white/20 backdrop-blur-md rounded-lg shadow-sm border border-white/30">
            <Shield className="h-12 w-12 text-purple-300 mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-white">Secure & Reliable</h3>
            <p className="text-sm text-gray-100">JWT authentication with encrypted face data storage</p>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="w-full">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Login to Your Account</CardTitle>
                  <CardDescription className="text-gray-200">Enter your credentials to access the attendance system</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username or Email</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username or email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="bg-white/40 text-gray-900 placeholder-gray-400 border border-white/30 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/40 text-gray-900 placeholder-gray-400 border border-white/30 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
