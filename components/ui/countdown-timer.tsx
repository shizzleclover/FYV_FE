"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  targetTime: Date
  onComplete?: () => void
}

export function CountdownTimer({ targetTime, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetTime - +new Date()

      if (difference <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0 })
        if (onComplete) onComplete()
        return
      }

      setTimeLeft({
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetTime, onComplete])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-2 text-sm font-medium text-charcoal/70">Time Remaining</div>
        <div className="flex items-center justify-center gap-2">
          <TimeUnit value={timeLeft.minutes} label="MIN" />
          <span className="text-2xl font-bold text-charcoal">:</span>
          <TimeUnit value={timeLeft.seconds} label="SEC" />
        </div>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex h-16 w-16 items-center justify-center rounded-xl bg-lapisLazuli text-3xl font-bold text-white"
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
      <div className="mt-1 text-xs font-medium text-charcoal/70">{label}</div>
    </div>
  )
}
