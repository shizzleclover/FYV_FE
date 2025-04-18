"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Heart, MessageCircle, Star, ArrowRight, Loader2, Copy, QrCode } from "lucide-react"
import { getEventDetails, getFollowupStats, triggerMatchmaking, startEventCountdown } from "@/lib/api"
import { startCountdown, triggerMatchReveal, connectToSocket } from "@/lib/socket"
import { toast } from "sonner"
import EventQRCode from "@/components/EventQRCode"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [eventCode, setEventCode] = useState<string | null>(null)
  const [eventDetails, setEventDetails] = useState<any>(null)
  const [followupStats, setFollowupStats] = useState<any>(null)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)
  
  useEffect(() => {
    const checkAndLoadEvent = () => {
      // First check URL params
      const urlEventCode = searchParams.get("eventCode")
      
      // Then check localStorage
      const storedEventCode = localStorage.getItem("eventCode")
      const isHost = localStorage.getItem("isHost") === "true"
      
      if (!isHost) {
        // Redirect non-hosts to join page
        toast.error("Only hosts can access the dashboard")
        router.push("/join-event")
        return false
      }
      
      // Determine which event code to use (URL param takes precedence)
      const codeToUse = urlEventCode || storedEventCode
      
      if (!codeToUse) {
        // No event code found, but user is a host, so they can create an event
        setLoading(false)
        return false
      }
      
      // If URL doesn't have the event code but localStorage does, update URL
      if (!urlEventCode && storedEventCode) {
        router.push(`/dashboard?eventCode=${storedEventCode}`)
      }
      
      // Store event code in state and localStorage
      setEventCode(codeToUse)
      if (codeToUse !== storedEventCode) {
        localStorage.setItem("eventCode", codeToUse)
      }
      
      // Fetch event details
      fetchEventDetails(codeToUse)
      
      // Connect to socket for real-time updates
      const socket = connectToSocket(codeToUse)
      
      // Handle participant updates
      socket.on('participants', (data) => {
        // Refresh event details to get the latest participant count
        fetchEventDetails(codeToUse, false)
      })
      
      // Handle socket reconnection
      socket.on('connect', () => {
        if (isReconnecting) {
          toast.success("Reconnected to event server")
          setIsReconnecting(false)
          fetchEventDetails(codeToUse, false)
        }
      })
      
      socket.on('disconnect', () => {
        setIsReconnecting(true)
        toast.error("Connection to event server lost. Reconnecting...")
      })
      
      return true
    }
    
    checkAndLoadEvent()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      if (eventCode) {
        fetchEventDetails(eventCode, false)
      }
    }, 30000)
    
    return () => {
      clearInterval(interval)
    }
  }, [searchParams, router])
  
  const fetchEventDetails = async (code: string, showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }
    
    try {
      const event = await getEventDetails(code)
      if (event) {
        setEventDetails(event)
        
        // Get follow-up stats if available
        const stats = await getFollowupStats(code)
        if (stats) {
          setFollowupStats(stats)
        }
      } else {
        // Event not found, clear localStorage
        if (code === localStorage.getItem("eventCode")) {
          localStorage.removeItem("eventCode")
        }
        
        toast.error("Event not found or has been deleted")
        router.push("/create-event")
      }
    } catch (error) {
      console.error("Error fetching event details:", error)
      if (showLoading) {
        toast.error("Failed to load event details")
      }
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }
  
  const handleStartCountdown = async () => {
    if (!eventCode) return
    
    try {
      const success = await startEventCountdown(eventCode)
      if (success) {
        toast.success("Event countdown started!")
        
        // Start countdown on socket as well
        startCountdown(eventCode, eventDetails?.countdownDuration || 300);
        
        // Refresh event details
        fetchEventDetails(eventCode)
      }
    } catch (error) {
      console.error("Error starting countdown:", error)
      toast.error("Failed to start countdown")
    }
  }
  
  const handleRevealMatches = async () => {
    if (!eventCode) return
    
    try {
      const result = await triggerMatchmaking(eventCode)
      if (result) {
        toast.success(`Matchmaking completed! ${result.matchCount} matches created.`)
        
        // Trigger match reveal on socket as well
        triggerMatchReveal(eventCode);
        
        // Refresh event details
        fetchEventDetails(eventCode)
      }
    } catch (error) {
      console.error("Error triggering matchmaking:", error)
      toast.error("Failed to trigger matchmaking")
    }
  }
  
  const handleCreateEvent = () => {
    // Clear any existing event code
    localStorage.removeItem("eventCode")
    router.push("/create-event")
  }
  
  const handleViewLeaderboard = () => {
    if (eventCode) {
      router.push(`/voting?eventCode=${eventCode}`)
    } else {
      toast.error("No active event found")
    }
  }

  const toggleQrCode = () => {
    setShowQrCode(!showQrCode)
  }

  const stats = [
    {
      title: "Active Event",
      value: eventDetails ? (eventDetails.isActive ? "Yes" : "No") : "-",
      icon: <Calendar className="h-5 w-5 text-lapisLazuli" />,
    },
    {
      title: "Participants",
      value: eventDetails ? eventDetails.participantCount.toString() : "0",
      icon: <Users className="h-5 w-5 text-lapisLazuli" />,
    },
    {
      title: "Matches Made",
      value: followupStats ? followupStats.totalMatches.toString() : "0",
      icon: <Heart className="h-5 w-5 text-lapisLazuli" />,
    },
    {
      title: "Follow-ups",
      value: followupStats ? followupStats.totalFollowUps.toString() : "0",
      icon: <MessageCircle className="h-5 w-5 text-lapisLazuli" />,
    },
  ]

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-lapisLazuli" />
          <p className="text-charcoal/70">Loading event details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-charcoal">Host Dashboard</h1>
        {eventDetails ? (
          <div>
            <p className="text-charcoal/70">
              Managing event: <span className="ml-1 font-bold text-lapisLazuli">{eventDetails.eventCode}</span>
            </p>
            <div className="mt-1 flex items-center text-sm text-charcoal/70">
              <span>Share this code with participants</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(eventDetails.eventCode);
                  toast.success("Event code copied to clipboard!");
                }}
                className="ml-2 rounded-full p-1 hover:bg-carolinaBlue/10"
                title="Copy event code"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={toggleQrCode}
                className="ml-2 rounded-full p-1 hover:bg-carolinaBlue/10"
                title="Show QR code"
              >
                <QrCode className="h-4 w-4" />
              </button>
            </div>
            
            {showQrCode && eventCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 w-full max-w-md"
              >
                <AnimatedCard>
                  <EventQRCode eventCode={eventCode} />
                </AnimatedCard>
              </motion.div>
            )}
            
            {isReconnecting && (
              <div className="mt-2 flex items-center rounded-md bg-amber-50 p-2 text-sm text-amber-800">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reconnecting to event server...
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-4 text-charcoal/70">You don't have any active events</p>
            <Button 
              className="bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              onClick={handleCreateEvent}
            >
              <Calendar className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      {eventDetails && (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AnimatedCard className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">{stat.title}</p>
                  <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
                </div>
                <div className="rounded-full bg-carolinaBlue/10 p-3">{stat.icon}</div>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Event Details */}
      {eventDetails && (
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-charcoal">Event Details</h2>
        </div>

          <AnimatedCard>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-medium text-lapisLazuli">Event Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-charcoal">Event Code:</span>{" "}
                    <span className="text-charcoal/70">{eventDetails.eventCode}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-charcoal">Host Name:</span>{" "}
                    <span className="text-charcoal/70">{eventDetails.hostName}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-charcoal">Created:</span>{" "}
                    <span className="text-charcoal/70">
                      {new Date(eventDetails.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-charcoal">Status:</span>{" "}
                    <span className={`${eventDetails.isActive ? "text-green-500" : "text-red-500"}`}>
                      {eventDetails.isActive ? "Active" : "Inactive"}
                        </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-charcoal">Countdown Duration:</span>{" "}
                    <span className="text-charcoal/70">{eventDetails.countdownDuration} seconds</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-medium text-lapisLazuli">Actions</h3>
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full justify-start bg-lapisLazuli text-white hover:bg-lapisLazuli/90" 
                    onClick={handleStartCountdown}
                    disabled={!eventDetails.isActive}
                  >
                    <Calendar className="mr-2 h-4 w-4" /> Start Event Countdown
                  </Button>
                  
                  <Button 
                    className="w-full justify-start bg-carolinaBlue text-white hover:bg-carolinaBlue/90"
                    onClick={handleRevealMatches}
                    disabled={!eventDetails.isActive}
                  >
                    <Heart className="mr-2 h-4 w-4" /> Reveal Matches
                  </Button>
                  
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => router.push(`/follow-up?eventCode=${eventDetails.eventCode}`)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> View Follow-ups
                  </Button>
                  
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    onClick={handleViewLeaderboard}
                  >
                    <Star className="mr-2 h-4 w-4" /> View Leaderboard
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedCard>
      </div>
      )}

      {/* Getting Started */}
      {!eventDetails && (
        <AnimatedCard className="p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-xl font-semibold text-charcoal">Get Started</h2>
            <p className="mb-6 text-charcoal/70">
              Create a new event to start matching participants
            </p>
            <Button 
              className="bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              onClick={handleCreateEvent}
            >
              <Calendar className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </motion.div>
        </AnimatedCard>
      )}
    </div>
  )
}
