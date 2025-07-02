"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Scan } from "lucide-react"

interface QRScannerProps {
  onScan: (name: string, email: string) => void
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [lastScanned, setLastScanned] = useState<string | null>(null)

  const simulateQRScan = () => {
    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      const mockQRData = [
        { name: "David Brown", email: "david@example.com" },
        { name: "Emma Wilson", email: "emma@example.com" },
        { name: "Frank Miller", email: "frank@example.com" },
      ]

      const randomData = mockQRData[Math.floor(Math.random() * mockQRData.length)]
      setLastScanned(`${randomData.name} (${randomData.email})`)
      onScan(randomData.name, randomData.email)
      setIsScanning(false)
    }, 2000)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>Scan QR codes for quick attendance marking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            {isScanning ? (
              <div className="text-center space-y-2">
                <div className="animate-pulse">
                  <Scan className="h-12 w-12 mx-auto text-blue-500" />
                </div>
                <p className="text-sm text-gray-600">Scanning...</p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <QrCode className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">Point camera at QR code</p>
              </div>
            )}
          </div>

          <Button onClick={simulateQRScan} className="w-full" disabled={isScanning}>
            {isScanning ? "Scanning..." : "Simulate QR Scan"}
          </Button>

          {lastScanned && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Last scanned:</strong> {lastScanned}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate QR Code</CardTitle>
          <CardDescription>Create QR codes for users to scan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-square bg-white border rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-8 gap-1 p-4">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
              ))}
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Sample QR Code</p>
            <p className="text-xs text-gray-500">This would contain user identification data</p>
          </div>

          <Button variant="outline" className="w-full">
            Generate New QR Code
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
