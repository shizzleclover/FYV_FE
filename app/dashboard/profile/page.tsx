"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, getCurrentUser, getUserEvents, logout } from "@/lib/auth"
import { Event } from "@/lib/api"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LogOut, Plus, RefreshCw, Calendar } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<Event[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    // Check authentication and redirect if not logged in
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setLoading(false)
    
    // Fetch user's events
    loadUserEvents()
  }, [router])

  const loadUserEvents = async () => {
    setEventsLoading(true)
    try {
      const userEvents = await getUserEvents()
      if (userEvents) {
        setEvents(userEvents)
      } else {
        setEvents([])
      }
    } catch (error) {
      console.error("Error loading events:", error)
      toast.error("Failed to load your events")
    } finally {
      setEventsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("You've been logged out")
    router.push("/login")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const navigateToEvent = (eventCode: string) => {
    router.push(`/dashboard/events/${eventCode}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-lapisLazuli">Your Profile</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {user?.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-medium">Account created:</span> {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Events</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadUserEvents}
              disabled={eventsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${eventsLoading ? "animate-spin" : ""}`} />
            </Button>
            <AnimatedButton 
              className="flex items-center gap-2 bg-lapisLazuli text-white"
              onClick={() => router.push("/create-event")}
            >
              <Plus className="h-4 w-4" />
              Create Event
            </AnimatedButton>
          </div>
        </div>

        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <Card key={event.eventCode} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-lapisLazuli" />
                    Event {event.eventCode}
                  </CardTitle>
                  <CardDescription>
                    Created: {formatDate(event.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p><span className="font-medium">Host:</span> {event.hostName}</p>
                  <p><span className="font-medium">Participants:</span> {event.participantCount}</p>
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      event.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigateToEvent(event.eventCode)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="mb-4 text-center text-muted-foreground">You haven't created any events yet.</p>
              <AnimatedButton 
                className="bg-lapisLazuli text-white"
                onClick={() => router.push("/create-event")}
              >
                Create Your First Event
              </AnimatedButton>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}