"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressStepsProps {
  steps: number
  currentStep: number
  className?: string
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn("flex w-full items-center justify-between gap-2", className)}>
      {Array.from({ length: steps }).map((_, i) => (
        <div key={i} className="flex-1">
          <div
            className={cn(
              "relative h-2 w-full rounded-full",
              i < currentStep ? "bg-lapisLazuli" : "bg-carolinaBlue/30",
            )}
          >
            {i < currentStep && (
              <motion.div
                className="absolute inset-0 rounded-full bg-lapisLazuli"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
