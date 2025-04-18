"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Camera, Info } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"

export default function OutfitDescriptionPage() {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/waiting")
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <button onClick={() => router.back()} className="mb-6 flex items-center text-charcoal/70 hover:text-charcoal">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-charcoal">Describe Your Outfit</h1>
        <p className="mb-6 text-center text-charcoal/70">Tell us what you're wearing today</p>

        <AnimatedCard className="mb-6 bg-carolinaBlue/10 p-4">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-lapisLazuli" />
            <div>
              <h3 className="font-medium text-charcoal">Why This Matters</h3>
              <p className="text-sm text-charcoal/70">
                Your outfit description helps others identify you at the event and is part of the matching process. Be
                specific but concise.
              </p>
            </div>
          </div>
        </AnimatedCard>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="outfit-description">Describe what you're wearing</Label>
            <Textarea
              id="outfit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Blue jeans, white t-shirt with a red logo, and black sneakers."
              rows={5}
              required
              className="resize-none"
            />
          </div>

          <div className="flex justify-center">
            <AnimatedButton type="button" variant="outline" className="flex items-center gap-2 text-charcoal">
              <Camera className="h-4 w-4" />
              Add Photo (Optional)
            </AnimatedButton>
          </div>

          <AnimatedButton
            type="submit"
            className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
            disabled={!description.trim() || isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </AnimatedButton>
        </form>
      </motion.div>
    </main>
  )
}
