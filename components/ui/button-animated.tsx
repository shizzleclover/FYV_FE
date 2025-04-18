"use client"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { motion } from "framer-motion"
import { forwardRef } from "react"

export interface AnimatedButtonProps extends ButtonProps {
  animateOnHover?: boolean
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, animateOnHover = true, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          animateOnHover && "hover:shadow-lg",
          className,
        )}
        {...props}
      >
        <motion.span
          className="absolute inset-0 bg-white/10"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 1.5, opacity: 0.4 }}
          transition={{ duration: 0.5 }}
        />
        {children}
      </Button>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }
