"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Check, Copy, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import EventQRCode from "@/components/EventQRCode"

export default function EventCreatedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [eventCode, setEventCode] = useState<string>("")
  
  useEffect(() => {
    // Get event code from URL parameters or localStorage
    const codeFromParams = searchParams.get("eventCode")
    const codeFromStorage = localStorage.getItem("eventCode")
    
    if (codeFromParams) {
      setEventCode(codeFromParams)
    } else if (codeFromStorage) {
      setEventCode(codeFromStorage)
    }
  }, [searchParams])

  const copyCode = () => {
    navigator.clipboard.writeText(eventCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const shareEvent = () => {
    // Create a shareable link or message with the event code
    if (navigator.share) {
      navigator.share({
        title: 'Join my FYV event!',
        text: `Join my event with code: ${eventCode}`,
        url: window.location.origin + '/join-event'
      }).catch(err => {
        console.log('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      copyCode()
      toast.success("Event code copied to clipboard!")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-lightGreen"
      >
        <Check className="h-12 w-12 text-charcoal" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-charcoal">Event Created!</h1>
        <p className="text-charcoal/70">Share the code or QR code below with your participants</p>
      </motion.div>

      <AnimatedCard className="mb-8 w-full max-w-md">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium text-charcoal/70">Event Code</p>
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="text-3xl font-bold tracking-widest text-lapisLazuli">{eventCode}</div>
            <button
              onClick={copyCode}
              className="rounded-full p-2 text-charcoal/70 hover:bg-carolinaBlue/10 hover:text-charcoal"
            >
              {copied ? <Check className="h-5 w-5 text-lightGreen" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <AnimatedButton 
            className="flex items-center gap-2 bg-carolinaBlue text-charcoal hover:bg-carolinaBlue/90"
            onClick={shareEvent}
          >
            <Share2 className="h-4 w-4" />
            Share Event
          </AnimatedButton>
        </div>
        
        {eventCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4"
          >
            <p className="mb-3 text-center text-sm font-medium text-charcoal/70">
              Or Share This QR Code
            </p>
            <EventQRCode eventCode={eventCode} showTitle={false} />
          </motion.div>
        )}
      </AnimatedCard>

      <div className="flex w-full max-w-md flex-col gap-4">
        <AnimatedButton
          className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </AnimatedButton>
      </div>
    </main>
  )
}
