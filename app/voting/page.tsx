"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { ProgressSteps } from "@/components/ui/progress-steps"
import { StarRating } from "@/components/ui/star-rating"
import { AnimatedCard } from "@/components/ui/animated-card"
import { ArrowLeft, ArrowRight } from "lucide-react"

// Sample outfits data
const outfitsData = [
  {
    id: "1",
    description:
      "Black jeans with a white graphic t-shirt featuring a mountain design. Brown leather jacket and white sneakers.",
  },
  {
    id: "2",
    description: "Navy blue dress with white polka dots, paired with a light denim jacket and tan ankle boots.",
  },
  {
    id: "3",
    description: "Gray suit with a light blue shirt, no tie. Brown leather shoes and a matching belt.",
  },
  {
    id: "4",
    description: "Red and black plaid flannel shirt with black jeans and combat boots. Silver chain necklace.",
  },
  {
    id: "5",
    description: "Yellow sundress with white sandals and a straw hat. Gold hoop earrings and bracelet.",
  },
]

export default function VotingPage() {
  const router = useRouter()
  const [currentOutfit, setCurrentOutfit] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleRating = (rating: number) => {
    setRatings({
      ...ratings,
      [outfitsData[currentOutfit].id]: rating,
    })
  }

  const handleNext = () => {
    if (currentOutfit < outfitsData.length - 1) {
      setCurrentOutfit(currentOutfit + 1)
    } else {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        router.push("/match-reveal")
      }, 1500)
    }
  }

  const handleBack = () => {
    if (currentOutfit > 0) {
      setCurrentOutfit(currentOutfit - 1)
    }
  }

  const currentOutfitRated = ratings[outfitsData[currentOutfit].id] !== undefined

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center text-charcoal/70 hover:text-charcoal disabled:opacity-50"
          disabled={currentOutfit === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <span className="text-sm font-medium text-charcoal/70">
          {currentOutfit + 1} of {outfitsData.length}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-charcoal">Rate Outfits</h1>
        <p className="mb-6 text-center text-charcoal/70">Rate each outfit to help us find your matches</p>

        <ProgressSteps steps={outfitsData.length} currentStep={currentOutfit + 1} className="mb-8" />

        <AnimatedCard
          key={currentOutfit}
          className="mb-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <div className="mb-6 rounded-lg bg-carolinaBlue/10 p-6">
            <p className="text-center text-charcoal">{outfitsData[currentOutfit].description}</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-charcoal/70">How would you rate this outfit?</p>
            <StarRating size="lg" onRatingChange={handleRating} className="mb-2" />
            {ratings[outfitsData[currentOutfit].id] && (
              <p className="text-lapisLazuli">You rated this outfit {ratings[outfitsData[currentOutfit].id]}/5</p>
            )}
          </div>
        </AnimatedCard>

        <AnimatedButton
          onClick={handleNext}
          className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
          disabled={!currentOutfitRated || isLoading}
        >
          {isLoading ? (
            "Processing..."
          ) : currentOutfit < outfitsData.length - 1 ? (
            <span className="flex items-center">
              Next Outfit <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          ) : (
            "See Your Matches"
          )}
        </AnimatedButton>
      </motion.div>
    </main>
  )
}
