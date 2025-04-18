"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProgressSteps } from "@/components/ui/progress-steps"
import { ArrowLeft, Info } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventCode = searchParams.get("code") || ""

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState({
    displayName: "",
    agreeToTerms: false,
  })

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        router.push("/questionnaire")
      }, 1000)
    }
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
        <h1 className="mb-2 text-center text-3xl font-bold text-charcoal">Join Event</h1>
        <p className="mb-6 text-center text-charcoal/70">
          {eventCode ? `Event Code: ${eventCode}` : "Complete your profile"}
        </p>

        <ProgressSteps steps={2} currentStep={step} className="mb-8" />

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={userData.displayName}
                onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                placeholder="How others will see you"
                required
              />
            </div>

            <AnimatedButton
              onClick={handleNext}
              className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              disabled={!userData.displayName}
            >
              Next
            </AnimatedButton>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <AnimatedCard className="bg-carolinaBlue/10 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 text-lapisLazuli" />
                <div>
                  <h3 className="font-medium text-charcoal">About Anonymity</h3>
                  <p className="text-sm text-charcoal/70">
                    Your identity will remain anonymous until you choose to reveal it to your matches. Your responses
                    and outfit descriptions will be used for matching purposes only.
                  </p>
                </div>
              </div>
            </AnimatedCard>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-lapisLazuli focus:ring-lapisLazuli"
                checked={userData.agreeToTerms}
                onChange={(e) => setUserData({ ...userData, agreeToTerms: e.target.checked })}
              />
              <Label htmlFor="terms" className="text-sm">
                I understand that my responses will be used for matching and I agree to the terms of service and privacy
                policy.
              </Label>
            </div>

            <AnimatedButton
              onClick={handleNext}
              className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              disabled={!userData.agreeToTerms || isLoading}
            >
              {isLoading ? "Processing..." : "Continue to Questionnaire"}
            </AnimatedButton>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
