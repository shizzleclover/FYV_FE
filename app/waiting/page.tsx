"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CountdownTimer } from "@/components/ui/countdown-timer"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Button } from "@/components/ui/button"
import { Users, Loader2, Check, Clock, Calendar, UserIcon, LogOut } from "lucide-react"
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
  const [isHost, setIsHost] = useState(false)
  const [participantList, setParticipantList] = useState<string[]>([])

  useEffect(() => {
    // Get event code and participant ID from query params or localStorage
    const eventCode = searchParams.get("eventCode") || localStorage.getItem("eventCode")
    const storedAnonymousId = localStorage.getItem("anonymousId")
    const storedDisplayName = localStorage.getItem("displayName")
    const userIsHost = localStorage.getItem("isHost") === "true"
    
    setIsHost(userIsHost)
    
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
    const socket = connectToSocket(
      eventCode, 
      storedAnonymousId || undefined,
      storedDisplayName || undefined
    )
    
    // Handle participant updates
    socket.on('participants', (data: { participants: string[] }) => {
      setParticipantList(data.participants)
      setParticipants(data.participants.length)
    })
    
    // Handle countdown start
    socket.on('countdown:start', (data: { duration: number }) => {
      const now = new Date()
      const endTime = new Date(now.getTime() + data.duration * 1000)
      setTargetTime(endTime)
      
      // Refresh event details to get the latest
      fetchEventDetails(eventCode)
    })
    
    // Handle event timer update
    socket.on('event:timerUpdate', (data: { targetTime: string }) => {
      setTargetTime(new Date(data.targetTime))
    })
    
    // Redirect for match reveal
    socket.on('event:matchReveal', () => {
      router.push(`/voting?eventCode=${eventCode}`)
    })
    
    // Poll for updates every 15 seconds
    const interval = setInterval(() => {
      fetchEventDetails(eventCode)
    }, 15000)
    
    // Cleanup
    return () => {
      clearInterval(interval)
      socket.off('participants')
      socket.off('countdown:start')
      socket.off('event:timerUpdate')
      socket.off('event:matchReveal')
    }
  }, [router, searchParams])
  
  const fetchEventDetails = async (eventCode: string) => {
    try {
      const event = await getEventDetails(eventCode)
      if (event) {
        setEventDetails(event)
        setParticipants(event.participantCount)
        
        // Set mock participant list if not available from socket
        if (participantList.length === 0 && event.participants) {
          setParticipantList(event.participants.map((p: any) => p.name || "Anonymous"))
        }
        
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

  const handleLeaveEvent = () => {
    // Clear local storage and redirect to home
    localStorage.removeItem("eventCode")
    localStorage.removeItem("anonymousId")
    localStorage.removeItem("displayName")
    
    toast.success("You have left the event")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lapisLazuli" />
      </div>
    )
  }

  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-charcoal">Welcome to the Event</h1>
        <p className="text-charcoal/70">
          {targetTime 
            ? "Get ready! The matching process will begin when the timer ends" 
            : "Please wait for the host to start the event"}
        </p>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column - Event info */}
        <div className="md:col-span-1">
          <AnimatedCard className="mb-6">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-lapisLazuli/10">
                <Calendar className="h-8 w-8 text-lapisLazuli" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-charcoal">Event Details</h2>
              
              <div className="mt-4 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/70">Event Code:</span>
                  <span className="font-medium text-charcoal">{eventDetails.eventCode}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/70">Your Name:</span>
                  <span className="font-medium text-charcoal">{displayName || "Anonymous"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/70">Status:</span>
                  <span className={`font-medium ${targetTime ? "text-lightGreen" : "text-amber-500"}`}>
                    {targetTime ? "Event in progress" : "Waiting to start"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-charcoal/70">Participants:</span>
                  <span className="font-medium text-lapisLazuli">{participants}</span>
                </div>
              </div>
              
              <div className="mt-6 flex w-full">
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-500 hover:bg-red-50"
                  onClick={handleLeaveEvent}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Leave Event
                </Button>
              </div>
            </div>
          </AnimatedCard>
          
          {!targetTime && (
            <AnimatedCard>
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-charcoal">Waiting for Host</h3>
                <p className="mb-4 text-sm text-charcoal/70">
                  The host hasn't started the event countdown yet. Please wait patiently.
                </p>
                
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="w-full rounded-lg bg-amber-50 p-2 text-sm text-amber-700"
                >
                  Get ready to mingle!
                </motion.div>
              </div>
            </AnimatedCard>
          )}
        </div>
        
        {/* Middle column - Timer or animation */}
        <div className="md:col-span-1">
          {targetTime ? (
            <AnimatedCard>
              <div className="p-4 text-center">
                <h2 className="mb-4 text-xl font-semibold text-charcoal">Event Starting In</h2>
                <CountdownTimer targetTime={targetTime} onComplete={handleCountdownComplete} />
              </div>
            </AnimatedCard>
          ) : (
            <AnimatedCard>
              <div className="flex items-center justify-center p-8">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="h-40 w-40 rounded-full bg-carolinaBlue/30"
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
                        <span className="text-xl font-bold">Ready!</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </AnimatedCard>
          )}
        </div>
        
        {/* Right column - Participants */}
        <div className="md:col-span-1">
          <AnimatedCard>
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-charcoal">Participants</h2>
                <div className="flex items-center rounded-full bg-lapisLazuli/10 px-3 py-1">
                  <Users className="mr-1 h-4 w-4 text-lapisLazuli" />
                  <span className="text-sm font-medium text-lapisLazuli">{participants}</span>
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {participantList.length > 0 ? (
                  <ul className="space-y-2">
                    {participantList.map((name, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center rounded-lg bg-gray-50 px-3 py-2"
                      >
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-lapisLazuli/20">
                          <UserIcon className="h-4 w-4 text-lapisLazuli" />
                        </div>
                        <span className="text-sm font-medium text-charcoal">
                          {name}
                          {displayName === name && " (You)"}
                        </span>
                        {index === 0 && (
                          <span className="ml-auto rounded-full bg-lapisLazuli/10 px-2 py-0.5 text-xs font-medium text-lapisLazuli">
                            Host
                          </span>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-charcoal/50">
                    <Users className="mx-auto mb-2 h-8 w-8" />
                    <p>No participants yet</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-center text-xs text-charcoal/50">
                More participants may join before the event starts
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </main>
  )
}
