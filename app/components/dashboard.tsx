"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "../contexts/auth-context"
import { WelcomeTab } from "./welcome-tab"
import { AttendanceTab } from "./attendance-tab"
import { PeriodsTab } from "./periods-tab"
import { DataTab } from "./data-tab"
import { LogOut, Clock, User, Calendar, Camera } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Top Bar */}
      <div className="w-full glass-panel border-b shadow-sm">
        <div className="w-full flex justify-between items-center p-4">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <User className="h-7 w-7 text-neutral-700" />
            <div>
              <div className="text-2xl font-semibold text-neutral-900 leading-tight">Welcome, {user?.name}</div>
              <div className="text-sm text-muted-foreground">Smart Attendance System</div>
            </div>
            <span className="ml-4"><span className="inline-block bg-neutral-100 border border-neutral-200 rounded px-3 py-1 font-mono text-xs text-neutral-700">ID: {user?.studentId}</span></span>
          </div>
          {/* Clock & Logout */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-neutral-500" />
              <span className="font-mono text-base text-neutral-700">{currentTime.toLocaleTimeString()}</span>
            </div>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-2 md:px-4 py-8">
        <Card className="rounded-2xl shadow-sm p-6 glass-panel">
          <Tabs defaultValue="welcome" className="w-full">
            <TabsList className="flex w-full justify-between gap-2 glass-panel p-2 mb-6">
              <TabsTrigger value="welcome" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-neutral-700 data-[state=active]:glass-panel data-[state=active]:shadow data-[state=active]:text-neutral-900">
                <User className="h-5 w-5" /> Welcome
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-neutral-700 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-neutral-900">
                <Camera className="h-5 w-5" /> Register Attendance
              </TabsTrigger>
              <TabsTrigger value="periods" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-neutral-700 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-neutral-900">
                <Clock className="h-5 w-5" /> Periods
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-neutral-700 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-neutral-900">
                <Calendar className="h-5 w-5" /> Your Data
              </TabsTrigger>
            </TabsList>
            <div className="space-y-6">
              <TabsContent value="welcome">
                <WelcomeTab />
              </TabsContent>
              <TabsContent value="attendance">
                <AttendanceTab />
              </TabsContent>
              <TabsContent value="periods">
                <PeriodsTab />
              </TabsContent>
              <TabsContent value="data">
                <DataTab />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </main>
    </div>
  )
}
