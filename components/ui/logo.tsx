import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "light" | "dark"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", variant = "dark", showText = true, className }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const variantClasses = {
    light: "bg-white text-lapisLazuli",
    dark: "bg-lapisLazuli text-white",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("flex items-center justify-center rounded-full", sizeClasses[size], variantClasses[variant])}>
        <Sparkles className={cn(size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : "h-7 w-7")} />
      </div>

      {showText && (
        <h3
          className={cn(
            "ml-2 font-montserrat font-bold",
            textSizeClasses[size],
            variant === "light" ? "text-white" : "text-charcoal",
          )}
        >
          FYV
        </h3>
      )}
    </div>
  )
}
