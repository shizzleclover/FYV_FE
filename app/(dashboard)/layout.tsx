"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/ui/sidebar"
import { isAuthenticated } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Check if user is authenticated
    const authenticated = isAuthenticated()
    
    if (!authenticated) {
      // Redirect to login if not authenticated
      router.push("/login")
    } else {
      // If authenticated, stop loading
      setIsLoading(false)
    }
  }, [router])
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-lapisLazuli" />
          <p className="text-lg font-medium text-charcoal">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      <main className="flex-1 p-6 md:ml-64">{children}</main>
    </div>
  )
}
