"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, User } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"

export default function FollowUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    interested: true,
    shareContact: false,
    phoneNumber: "",
    socialMedia: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
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
        <h1 className="mb-2 text-center text-3xl font-bold text-charcoal">Follow Up</h1>
        <p className="mb-6 text-center text-charcoal/70">Would you like to reconnect with your match?</p>

        <AnimatedCard className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lapisLazuli">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="font-medium text-charcoal">Alex</h2>
              <p className="text-sm text-charcoal/70">Your match</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="interested" className="font-medium">
                Interested in reconnecting?
              </Label>
              <Switch
                id="interested"
                checked={formData.interested}
                onCheckedChange={(checked) => setFormData({ ...formData, interested: checked })}
              />
            </div>

            {formData.interested && (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-contact" className="font-medium">
                    Share contact information?
                  </Label>
                  <Switch
                    id="share-contact"
                    checked={formData.shareContact}
                    onCheckedChange={(checked) => setFormData({ ...formData, shareContact: checked })}
                  />
                </div>

                {formData.shareContact && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number (Optional)</Label>
                      <Input
                        id="phone-number"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="(123) 456-7890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="social-media">Social Media Handle (Optional)</Label>
                      <Input
                        id="social-media"
                        value={formData.socialMedia}
                        onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                        placeholder="@username"
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}

            <AnimatedButton
              type="submit"
              className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </AnimatedButton>
          </form>
        </AnimatedCard>
      </motion.div>
    </main>
  )
}
