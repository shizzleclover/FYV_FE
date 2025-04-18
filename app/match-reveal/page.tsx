"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Heart, MessageCircle, User } from "lucide-react"

// Sample match data
const matchData = {
  name: "Alex",
  compatibility: 85,
  outfit:
    "Black jeans with a white graphic t-shirt featuring a mountain design. Brown leather jacket and white sneakers.",
  interests: ["Hiking", "Photography", "Music"],
}

export default function MatchRevealPage() {
  const router = useRouter()
  const [revealed, setRevealed] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Simulate reveal animation
    const timer = setTimeout(() => {
      setRevealed(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (revealed) {
      // Show details after reveal
      const timer = setTimeout(() => {
        setShowDetails(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [revealed])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-charcoal">
          {revealed ? "It's a Match!" : "Finding Your Match..."}
        </h1>
        <p className="text-charcoal/70">
          {revealed ? "You and your match rated each other highly" : "Our algorithm is working its magic"}
        </p>
      </motion.div>

      <div className="relative mb-8 flex justify-center">
        {!revealed ? (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
            className="flex h-32 w-32 items-center justify-center rounded-full bg-lapisLazuli"
          >
            <Heart className="h-16 w-16 text-white" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="flex h-40 w-40 items-center justify-center rounded-full bg-lightGreen"
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white">
              <User className="h-20 w-20 text-lapisLazuli" />
            </div>
          </motion.div>
        )}

        {revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-lapisLazuli text-white"
          >
            <span className="text-sm font-bold">{matchData.compatibility}%</span>
          </motion.div>
        )}
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <AnimatedCard className="mb-6">
            <h2 className="mb-4 text-xl font-semibold text-lapisLazuli">{matchData.name}</h2>

            <div className="mb-4">
              <h3 className="mb-1 text-sm font-medium text-charcoal/70">Outfit</h3>
              <p className="text-charcoal">{matchData.outfit}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-charcoal/70">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {matchData.interests.map((interest, index) => (
                  <span key={index} className="rounded-full bg-carolinaBlue/20 px-3 py-1 text-xs text-charcoal">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedCard>

          <div className="flex gap-4">
            <AnimatedButton
              className="flex-1 bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              onClick={() => router.push("/chat")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat Now
            </AnimatedButton>

            <AnimatedButton
              className="flex-1 bg-carolinaBlue text-charcoal hover:bg-carolinaBlue/90"
              onClick={() => router.push("/dashboard")}
            >
              See All Matches
            </AnimatedButton>
          </div>
        </motion.div>
      )}
    </main>
  )
}
