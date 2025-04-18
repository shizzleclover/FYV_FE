"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, ScanLine } from "lucide-react"
import { joinEvent, getEventDetails } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { toast } from "sonner"
import QRCodeScanner from "@/components/QRCodeScanner"

export default function JoinEventPage() {
  const router = useRouter()
  const [eventCode, setEventCode] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [initialCheck, setInitialCheck] = useState(true)
  const [showScanner, setShowScanner] = useState(false)

  // Check if user is already in an event and check authentication
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error("Please log in to join an event")
      router.push('/auth?redirectTo=/join-event')
      return
    }
    
    const storedEventCode = localStorage.getItem("eventCode")
    const storedDisplayName = localStorage.getItem("displayName")
    const isHost = localStorage.getItem("isHost") === "true"
    
    // If user is already in an event as a participant, redirect to waiting room
    if (storedEventCode && storedDisplayName && !isHost) {
      router.push(`/waiting?eventCode=${storedEventCode}`)
      return
    }
    
    // If user is a host, redirect to dashboard
    if (storedEventCode && isHost) {
      router.push(`/dashboard?eventCode=${storedEventCode}`)
      return
    }
    
    setInitialCheck(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!eventCode.trim() || !displayName.trim()) {
      toast.error("Please enter both event code and your display name")
      return
    }
    
    setIsLoading(true)
    
    try {
      // First check if the event exists
      const eventDetails = await getEventDetails(eventCode)
      
      if (!eventDetails) {
        setIsLoading(false)
        return // Error toast already shown by API function
      }
      
      if (!eventDetails.isActive) {
        toast.error("This event is not active")
        setIsLoading(false)
        return
      }
      
      // Join the event
      const response = await joinEvent(eventCode, displayName)
      
      if (response) {
        // Store participant info in localStorage
        localStorage.setItem("eventCode", eventCode)
        localStorage.setItem("anonymousId", response.anonymousId)
        localStorage.setItem("displayName", displayName)
        localStorage.setItem("isHost", "false")
        
        // Navigate to waiting room
        router.push(`/waiting?eventCode=${eventCode}`)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error joining event:", error)
      toast.error("Failed to join event. Please try again.")
      setIsLoading(false)
    }
  }

  const handleQRCodeScanned = (scannedCode: string) => {
    setShowScanner(false)
    setEventCode(scannedCode)
    toast.success(`Event code scanned: ${scannedCode}`)
  }

  if (initialCheck) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lapisLazuli" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <button onClick={() => router.back()} className="mb-6 flex items-center text-charcoal/70 hover:text-charcoal">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-charcoal">Join an Event</h1>
        <p className="mb-6 text-center text-charcoal/70">Enter the event code or scan a QR code to join</p>

        {showScanner ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <QRCodeScanner 
              onScan={handleQRCodeScanned} 
              onClose={() => setShowScanner(false)}
            />
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="event-code">Event Code</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowScanner(true)}
                  className="flex items-center gap-1 text-xs"
                >
                  <ScanLine className="h-4 w-4" />
                  Scan QR
                </Button>
              </div>
              <Input
                id="event-code"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                placeholder="Enter event code"
                className="text-center text-xl"
                maxLength={8}
                required
              />
              <p className="text-xs text-charcoal/50">
                The event code should be provided by the event host
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="display-name">Your Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                maxLength={30}
                required
              />
              <p className="text-xs text-charcoal/50">
                This is the name other participants will see
              </p>
            </div>

            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              <p className="mb-1 font-medium">Important:</p>
              <ul className="list-inside list-disc space-y-1 text-xs">
                <li>Don't share event codes with others</li>
                <li>Each participant should join individually</li>
                <li>Be respectful to other participants</li>
              </ul>
            </div>

            <AnimatedButton
              type="submit"
              className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              disabled={isLoading || !eventCode.trim() || !displayName.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Joining...
                </div>
              ) : (
                "Join Event"
              )}
            </AnimatedButton>
          </form>
        )}
      </motion.div>
    </main>
  )
}
