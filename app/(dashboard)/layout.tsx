"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AppSidebar } from "@/components/ui/sidebar"
import { isAuthenticated } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [eventCode, setEventCode] = useState<string | null>(null)
  
  useEffect(() => {
    const checkAuthentication = () => {
      // Check if user is authenticated
      const authenticated = isAuthenticated()
      
      if (!authenticated) {
        // Redirect to login if not authenticated
        toast.error("Please sign in to access the dashboard")
        router.push("/auth")
        return false
      }
      
      // Check if user is a host
      const isHost = localStorage.getItem("isHost") === "true"
      if (!isHost) {
        toast.error("Only hosts can access the dashboard")
        router.push("/join-event")
        return false
      }
      
      // Get active event code
      const activeEventCode = localStorage.getItem("eventCode")
      setEventCode(activeEventCode)
      
      // If on the dashboard and there's an active event, make sure the URL includes the event code
      if (pathname === "/(dashboard)/dashboard" && activeEventCode) {
        router.push(`/dashboard?eventCode=${activeEventCode}`)
      }
      
      setIsLoading(false)
      return true
    }
    
    checkAuthentication()
    
    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && !e.newValue) {
        // User logged out in another tab
        router.push("/auth")
      } else if (e.key === "eventCode") {
        // Event code changed in another tab
        setEventCode(e.newValue)
        if (pathname === "/(dashboard)/dashboard" && e.newValue) {
          router.push(`/dashboard?eventCode=${e.newValue}`)
        }
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [router, pathname])
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-lapisLazuli" />
          <p className="text-lg font-medium text-charcoal">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar activeEventCode={eventCode} />
      <main className="flex-1 p-6 md:ml-64">{children}</main>
    </div>
  )
}
