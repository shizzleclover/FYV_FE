"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Users, Loader2, Copy, Check } from "lucide-react"
import { getEventDetails } from "@/lib/api"
import { connectToSocket } from "@/lib/socket"
import { toast } from "sonner"

export default function WaitingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [eventDetails, setEventDetails] = useState<any>(null)
  const [targetTime, setTargetTime] = useState<Date | null>(null)
  const [participants, setParticipants] = useState(0)
  const [anonymousId, setAnonymousId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Get event code and participant ID from query params or localStorage
    const eventCode = searchParams.get("eventCode") || localStorage.getItem("eventCode")
    const storedAnonymousId = localStorage.getItem("anonymousId")
    const storedDisplayName = localStorage.getItem("displayName")
    
    if (!eventCode) {
      toast.error("No event code found")
      router.push("/join-event")
      return
    }
    
    if (storedAnonymousId) {
      setAnonymousId(storedAnonymousId)
    }
    
    if (storedDisplayName) {
      setDisplayName(storedDisplayName)
    }
    
    // Fetch event details
    fetchEventDetails(eventCode)
    
    // Connect to socket for real-time updates
    connectToSocket(
      eventCode, 
      storedAnonymousId || undefined,
      storedDisplayName || undefined
    )
    
    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchEventDetails(eventCode)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [router, searchParams])
  
  const fetchEventDetails = async (eventCode: string) => {
    try {
      const event = await getEventDetails(eventCode)
      if (event) {
        setEventDetails(event)
        setParticipants(event.participantCount)
        
        // If the event has started, set the target time
        if (event.startTime) {
          const startTimestamp = new Date(event.startTime).getTime()
          const endTimestamp = startTimestamp + (event.countdownDuration * 1000)
          setTargetTime(new Date(endTimestamp))
        }
        
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching event details:", error)
      if (loading) {
        toast.error("Failed to load event details")
        setLoading(false)
      }
    }
  }

  const handleCountdownComplete = () => {
    // Navigate to voting page when countdown completes
    const eventCode = eventDetails?.eventCode
    if (eventCode && anonymousId) {
      router.push(`/voting?eventCode=${eventCode}&anonymousId=${anonymousId}`)
    } else {
      router.push("/voting")
    }
  }

  const copyEventCode = () => {
    if (eventDetails?.eventCode) {
      navigator.clipboard.writeText(eventDetails.eventCode)
      setCopied(true)
      toast.success("Event code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lapisLazuli" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-charcoal">Event Starting Soon</h1>
        <p className="text-charcoal/70">
          {targetTime 
            ? "The matching process will begin when the timer ends" 
            : "Waiting for the host to start the event"}
        </p>
      </motion.div>
      
      {eventDetails && (
        <AnimatedCard className="mb-8 w-full max-w-md">
          <div className="text-center">
            <p className="mb-2 text-sm font-medium text-charcoal/70">Event Code</p>
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="text-3xl font-bold tracking-widest text-lapisLazuli">{eventDetails.eventCode}</div>
              <button
                onClick={copyEventCode}
                className="rounded-full p-2 text-charcoal/70 hover:bg-carolinaBlue/10 hover:text-charcoal"
              >
                {copied ? <Check className="h-5 w-5 text-lightGreen" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-sm text-charcoal/70">Share this code with others who want to join</p>
          </div>
        </AnimatedCard>
      )}

      {targetTime ? (
        <AnimatedCard className="mb-8 w-full max-w-md">
          <CountdownTimer targetTime={targetTime} onComplete={handleCountdownComplete} />
        </AnimatedCard>
      ) : (
        <AnimatedCard className="mb-8 w-full max-w-md p-8 text-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="text-lg font-medium text-charcoal"
          >
            Waiting for host to start the event...
          </motion.div>
        </AnimatedCard>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2 text-charcoal/70"
      >
        <Users className="h-5 w-5" />
        <span>
          <span className="font-medium text-lapisLazuli">{participants}</span> participants have joined
        </span>
      </motion.div>

      <div className="mt-12 flex w-full max-w-md justify-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="h-32 w-32 rounded-full bg-carolinaBlue/30"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.5,
            }}
            className="flex h-full w-full items-center justify-center rounded-full bg-carolinaBlue/50"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
              }}
              className="flex h-3/4 w-3/4 items-center justify-center rounded-full bg-lapisLazuli text-white"
            >
              <span className="text-lg font-bold">Ready</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
