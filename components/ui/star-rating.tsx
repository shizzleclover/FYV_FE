"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  maxRating?: number
  size?: "sm" | "md" | "lg"
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({ maxRating = 5, size = "md", onRatingChange, className }: StarRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    if (onRatingChange) {
      onRatingChange(newRating)
    }
  }

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= (hoverRating || rating)

        return (
          <motion.button
            key={index}
            type="button"
            whileTap={{ scale: 0.8 }}
            className="focus:outline-none"
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRatingChange(starValue)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-all duration-200",
                isFilled ? "fill-lapisLazuli text-lapisLazuli" : "text-carolinaBlue",
              )}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
