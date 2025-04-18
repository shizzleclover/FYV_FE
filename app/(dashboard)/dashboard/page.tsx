"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Heart, MessageCircle, Star, ArrowRight, Loader2, Copy } from "lucide-react"
import { getEventDetails, getFollowupStats, triggerMatchmaking, startEventCountdown } from "@/lib/api"
import { startCountdown, triggerMatchReveal } from "@/lib/socket"
import { toast } from "sonner"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [eventCode, setEventCode] = useState<string | null>(null)
  const [eventDetails, setEventDetails] = useState<any>(null)
  const [followupStats, setFollowupStats] = useState<any>(null)
  
  useEffect(() => {
    // Check localStorage for the event code
    const storedEventCode = localStorage.getItem("eventCode")
    const isHost = localStorage.getItem("isHost") === "true"
    
    if (!storedEventCode || !isHost) {
      setLoading(false)
      return
    }
    
    setEventCode(storedEventCode)
    fetchEventDetails(storedEventCode)
  }, [])
  
  const fetchEventDetails = async (code: string) => {
    setLoading(true)
    try {
      const event = await getEventDetails(code)
      if (event) {
        setEventDetails(event)
        
        // Get follow-up stats if available
        const stats = await getFollowupStats(code)
        if (stats) {
          setFollowupStats(stats)
        }
      }
    } catch (error) {
      console.error("Error fetching event details:", error)
      toast.error("Failed to load event details")
    } finally {
      setLoading(false)
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
    router.push("/create-event")
  }
  
  const handleJoinEvent = () => {
    router.push("/join-event")
  }
  
  const handleViewLeaderboard = () => {
    if (eventCode) {
      router.push(`/voting?eventCode=${eventCode}`)
    } else {
      toast.error("No active event found")
    }
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
        <Loader2 className="h-8 w-8 animate-spin text-lapisLazuli" />
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
            <p className="mt-1 flex items-center text-sm text-charcoal/70">
              <span>Share this code with participants</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(eventDetails.eventCode);
                  toast.success("Event code copied to clipboard!");
                }}
                className="ml-2 rounded-full p-1 hover:bg-carolinaBlue/10"
              >
                <Copy className="h-4 w-4" />
              </button>
            </p>
          </div>
        ) : (
          <p className="text-charcoal/70">Create or join an event to get started</p>
        )}
      </div>

      {/* Stats */}
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
          </div>
        </div>
      </div>
          </AnimatedCard>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-charcoal">Quick Actions</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-lapisLazuli p-4 text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-charcoal">Create Event</h3>
            <p className="mb-4 text-sm text-charcoal/70">Set up a new event with custom questions</p>
            <Button 
              className="mt-auto bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              onClick={handleCreateEvent}
            >
              Create Now
            </Button>
          </AnimatedCard>

          <AnimatedCard className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-carolinaBlue p-4 text-white">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-charcoal">Join Event</h3>
            <p className="mb-4 text-sm text-charcoal/70">Join an existing event with a code</p>
            <Button 
              className="mt-auto bg-carolinaBlue text-white hover:bg-carolinaBlue/90"
              onClick={handleJoinEvent}
            >
              Join Now
            </Button>
          </AnimatedCard>

          <AnimatedCard className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-charcoal p-4 text-white">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-charcoal">View Leaderboard</h3>
            <p className="mb-4 text-sm text-charcoal/70">See top-rated outfits and matches</p>
            <Button 
              className="mt-auto bg-charcoal text-white hover:bg-charcoal/90"
              onClick={handleViewLeaderboard}
            >
              View Now
            </Button>
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}
