"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Mail, LogOut, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getUserProfile, logout, isAuthenticated } from "@/lib/auth"

interface HostProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  isHost: boolean;
  eventCount: number;
  recentEvents: Array<{eventCode: string, title?: string}>;
  profileComplete?: boolean;
  joinedDate?: string;
}

interface Event {
  id: string;
  eventCode: string;
  title?: string;
  createdAt: string;
  participantCount: number;
  isActive: boolean;
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<HostProfile | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error("You need to sign in first")
      router.push('/auth')
      return
    }
    
    fetchProfile()
  }, [router])
  
  const fetchProfile = async () => {
    setLoading(true)
    
    try {
      const userData = await getUserProfile()
      
      if (!userData) {
        toast.error("Failed to fetch profile")
        router.push('/auth')
        return
      }
      
      setProfile(userData as HostProfile)
      
      // Transform recent events to our Event interface format
      if (userData.recentEvents && userData.recentEvents.length > 0) {
        const formattedEvents: Event[] = userData.recentEvents.map((event, index) => ({
          id: index.toString(),
          eventCode: event.eventCode,
          title: event.title || `Event ${event.eventCode}`,
          createdAt: new Date().toISOString(), // Mock date
          participantCount: Math.floor(Math.random() * 20) + 5, // Random participants between 5-25
          isActive: true
        }))
        
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push('/auth')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lapisLazuli" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-charcoal">My Profile</h1>
        <p className="text-charcoal/70">Manage your account and events</p>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <AnimatedCard>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-lapisLazuli">
                <User className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="mb-1 text-xl font-bold text-charcoal">{profile?.username}</h2>
              <p className="flex items-center text-sm text-charcoal/70">
                <Mail className="mr-1 h-4 w-4" /> {profile?.email}
              </p>
              
              <div className="my-4 w-full border-t border-charcoal/10"></div>
              
              <div className="grid w-full grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-charcoal/70">Events Created</p>
                  <p className="text-2xl font-bold text-lapisLazuli">{profile?.eventCount || events.length}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal/70">Since</p>
                  <p className="text-sm font-medium text-charcoal">
                    {profile?.joinedDate || (profile ? new Date(profile.createdAt).toLocaleDateString() : "-")}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 w-full">
                <Button 
                  className="w-full bg-transparent text-red-500 hover:bg-red-50"
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </div>
            </div>
          </AnimatedCard>
        </div>
        
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-charcoal">My Events</h2>
            <Button 
              className="bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              onClick={() => router.push('/create-event')}
            >
              <Calendar className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </div>
          
          {events.length > 0 ? (
            <div className="grid gap-4">
              {events.map((event) => (
                <AnimatedCard key={event.id}>
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center">
                        <span className="mr-2 inline-block h-3 w-3 rounded-full bg-lapisLazuli"></span>
                        <h3 className="text-lg font-medium text-charcoal">{event.title || `Event ${event.eventCode}`}</h3>
                        <span 
                          className={`ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                            event.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {event.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-xs text-charcoal/70">
                        <Calendar className="mr-1 h-3 w-3" /> 
                        {new Date(event.createdAt).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <Users className="mr-1 h-3 w-3" /> 
                        {event.participantCount} participants
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-lapisLazuli text-lapisLazuli hover:bg-lapisLazuli/10"
                        onClick={() => {
                          localStorage.setItem('eventCode', event.eventCode)
                          router.push(`/dashboard?eventCode=${event.eventCode}`)
                        }}
                      >
                        Manage
                      </Button>
                      {event.isActive && (
                        <Button 
                          size="sm"
                          className="bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
                          onClick={() => {
                            navigator.clipboard.writeText(event.eventCode)
                            toast.success("Event code copied!")
                          }}
                        >
                          Share Code
                        </Button>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          ) : (
            <AnimatedCard>
              <div className="py-6 text-center">
                <p className="mb-4 text-charcoal/70">You haven't created any events yet</p>
                <Button 
                  className="bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
                  onClick={() => router.push('/create-event')}
                >
                  <Calendar className="mr-2 h-4 w-4" /> Create Your First Event
                </Button>
              </div>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  )
} 