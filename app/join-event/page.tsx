"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { joinEvent, getEventDetails } from "@/lib/api"
import { toast } from "sonner"

export default function JoinEventPage() {
  const router = useRouter()
  const [eventCode, setEventCode] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      
      console.log("Joining event:", eventCode, "as", displayName);
      
      // Join the event
      const response = await joinEvent(eventCode, displayName)
      
      if (response) {
        console.log("Join response:", response);
        
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
        <p className="mb-6 text-center text-charcoal/70">Enter the event code provided by the host</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="event-code">Event Code</Label>
            <Input
              id="event-code"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value.toUpperCase())}
              placeholder="Enter event code"
              className="text-center text-xl"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="display-name">Your Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <AnimatedButton
            type="submit"
            className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
            disabled={isLoading || !eventCode.trim() || !displayName.trim()}
          >
            {isLoading ? "Joining..." : "Join Event"}
          </AnimatedButton>
        </form>
      </motion.div>
    </main>
  )
}
