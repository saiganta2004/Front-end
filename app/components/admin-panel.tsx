"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Users, Clock, Database, Shield, Plus, Edit, Trash2, Download } from "lucide-react"

export function AdminPanel() {
  const [users] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", role: "student", status: "active" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "employee", status: "active" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "student", status: "inactive" },
  ])

  const [periods, setPeriods] = useState([
    { id: "period1", name: "Period 1", start: "09:30", end: "10:20" },
    { id: "period2", name: "Period 2", start: "10:20", end: "11:10" },
    { id: "period3", name: "Period 3", start: "11:10", end: "12:00" },
  ])

  return (
    <div className="space-y-6">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Dashboard
          </CardTitle>
          <CardDescription>Manage users, settings, and system configuration</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="glass-panel flex gap-2 p-2">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Settings</TabsTrigger>
          <TabsTrigger value="reports">System Reports</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage students and employees</CardDescription>
                </div>
                <Button className="fancy-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg glass-panel">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{user.role}</Badge>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="fancy-btn">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="fancy-btn">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Schedule Configuration
                  </CardTitle>
                  <CardDescription>Manage class timings and periods</CardDescription>
                </div>
                <Button className="fancy-btn">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Period
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {periods.map((period) => (
                  <div key={period.id} className="flex items-center justify-between p-4 border rounded-lg glass-panel">
                    <div>
                      <h4 className="font-medium">{period.name}</h4>
                      <p className="text-sm text-gray-600">
                        {period.start} - {period.end}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="fancy-btn">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="fancy-btn">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Reports
              </CardTitle>
              <CardDescription>Generate comprehensive attendance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2 fancy-btn">
                  <Download className="h-6 w-6" />
                  Daily Reports
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 fancy-btn">
                  <Download className="h-6 w-6" />
                  Weekly Reports
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 fancy-btn">
                  <Download className="h-6 w-6" />
                  Monthly Reports
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 fancy-btn">
                  <Users className="h-6 w-6" />
                  User Analytics
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 fancy-btn">
                  <Clock className="h-6 w-6" />
                  Period Analytics
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2 fancy-btn">
                  <Database className="h-6 w-6" />
                  System Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system parameters and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Face Recognition Settings</h4>
                  <div className="space-y-2">
                    <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
                    <Input id="confidence-threshold" type="number" defaultValue="85" className="glass-panel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Max Recognition Attempts</Label>
                    <Input id="max-attempts" type="number" defaultValue="3" className="glass-panel" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="fancy-btn">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
