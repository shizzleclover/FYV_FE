"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

export interface AnimatedCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  delay?: number
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, delay = 0, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: "easeOut",
        }}
        className={cn("rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg", className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }
