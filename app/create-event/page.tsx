"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ProgressSteps } from "@/components/ui/progress-steps"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { createEvent, Question } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { toast } from "sonner"

const DEFAULT_QUESTIONS: Question[] = [
  {
    text: "What is your gender?",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"]
  },
  {
    text: "Which gender(s) are you attracted to?",
    options: ["Men", "Women", "Everyone", "Non-binary individuals", "Not looking for romance"]
  },
  {
    text: "What are you looking for at this event?",
    options: ["Friendship", "Casual dating", "Long-term relationship", "Networking", "Just having fun"]
  },
  {
    text: "How would you describe your personality?",
    options: ["Introverted", "Extroverted", "Ambivert", "It depends on the situation"]
  },
  {
    text: "How do you feel about dancing?",
    options: ["Love it", "Only with the right partner", "Only after a few drinks", "Not my thing"]
  },
  {
    text: "What's your favorite conversation topic?",
    options: ["Arts & Culture", "Sports", "Travel", "Food & Dining", "Technology", "Current Events"]
  },
  {
    text: "What's your idea of a perfect date?",
    options: ["Outdoor adventure", "Dinner and drinks", "Cultural event", "Cozy night in", "Something spontaneous"]
  }
]

export default function CreateEventPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventData, setEventData] = useState({
    hostName: "",
    countdownDuration: 300, // 5 minutes in seconds
    useDefaultQuestions: true,
    customQuestions: [{ text: "", options: ["", "", ""] }],
  })
  
  // Check authentication on component mount
  useEffect(() => {
    // Redirect to auth page if user is not authenticated
    if (!isAuthenticated()) {
      toast.error("Please log in to create an event")
      router.push('/auth?redirectTo=/create-event')
    }
  }, [router])

  const handleNext = () => {
    if (!eventData.hostName.trim()) {
      toast.error("Please enter your name")
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // Prepare questions based on selection
      const questions = eventData.useDefaultQuestions 
        ? [] // Let the backend use default questions
        : eventData.customQuestions.filter(q => q.text.trim() !== "" && q.options.some(opt => opt.trim() !== ""))
      
      // Validate questions
      if (!eventData.useDefaultQuestions && questions.length === 0) {
        toast.error("Please add at least one valid question with options")
        setIsLoading(false)
        return
      }
      
      // Create event - pass empty array for questions if using default questions
      const response = await createEvent(
        eventData.hostName,
        eventData.useDefaultQuestions ? undefined : questions,
        eventData.countdownDuration
      )
      
      if (response) {
        console.log("Event created:", response);
        
        // Store event code and mark as host in localStorage
        localStorage.setItem("eventCode", response.eventCode)
        localStorage.setItem("isHost", "true")
        localStorage.setItem("hostName", eventData.hostName)
        
        // Navigate to success page with event details
        router.push(`/event-created?eventCode=${response.eventCode}`)
      } else {
        setError("Failed to create event. Please try again.")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error creating event:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      setIsLoading(false)
    }
  }

  const addQuestion = () => {
    setEventData({
      ...eventData,
      customQuestions: [...eventData.customQuestions, { text: "", options: ["", "", ""] }],
    })
  }

  const removeQuestion = (index: number) => {
    if (eventData.customQuestions.length <= 1) {
      toast.error("You need at least one question")
      return
    }
    
    const updatedQuestions = [...eventData.customQuestions]
    updatedQuestions.splice(index, 1)
    setEventData({
      ...eventData,
      customQuestions: updatedQuestions,
    })
  }

  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...eventData.customQuestions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      text: value,
    }
    setEventData({
      ...eventData,
      customQuestions: updatedQuestions,
    })
  }
  
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...eventData.customQuestions]
    const currentOptions = [...updatedQuestions[questionIndex].options]
    currentOptions[optionIndex] = value
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: currentOptions,
    }
    
    setEventData({
      ...eventData,
      customQuestions: updatedQuestions,
    })
  }
  
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...eventData.customQuestions]
    const currentOptions = [...updatedQuestions[questionIndex].options]
    currentOptions.push("")
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: currentOptions,
    }
    
    setEventData({
      ...eventData,
      customQuestions: updatedQuestions,
    })
  }
  
  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (eventData.customQuestions[questionIndex].options.length <= 2) {
      toast.error("Questions need at least two options")
      return
    }
    
    const updatedQuestions = [...eventData.customQuestions]
    const currentOptions = [...updatedQuestions[questionIndex].options]
    currentOptions.splice(optionIndex, 1)
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: currentOptions,
    }
    
    setEventData({
      ...eventData,
      customQuestions: updatedQuestions,
    })
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <button onClick={handleBack} className="mb-6 flex items-center text-charcoal/70 hover:text-charcoal">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-charcoal">Create an Event</h1>
        <p className="mb-6 text-center text-charcoal/70">Set up your event details and questionnaire</p>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-3 text-red-800 text-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}
        
        <ProgressSteps steps={2} currentStep={step} className="mb-8" />

        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="host-name">Your Name</Label>
              <Input
                id="host-name"
                value={eventData.hostName}
                onChange={(e) => setEventData({ ...eventData, hostName: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="countdown-duration">Countdown Duration (seconds)</Label>
              <Input
                id="countdown-duration"
                type="number"
                min="60"
                max="3600"
                value={eventData.countdownDuration}
                onChange={(e) => setEventData({ ...eventData, countdownDuration: parseInt(e.target.value) || 300 })}
                required
              />
              <p className="text-xs text-charcoal/70">
                Time participants will wait before matching starts (60-3600 seconds)
              </p>
            </div>

            <AnimatedButton
              type="button"
              onClick={handleNext}
              className="mt-6 w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
            >
              Next: Questionnaire
            </AnimatedButton>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="default-questions" className="font-medium">
                Use Default Questionnaire
              </Label>
              <Switch
                id="default-questions"
                checked={eventData.useDefaultQuestions}
                onCheckedChange={(checked) => setEventData({ ...eventData, useDefaultQuestions: checked })}
              />
            </div>
            
            {eventData.useDefaultQuestions && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-charcoal">Default Questions</h3>
                <p className="text-sm text-charcoal/70">
                  The default questionnaire includes questions about preferences, personality, and compatibility.
                </p>
                <div className="max-h-60 overflow-y-auto rounded-md border p-4">
                  <ul className="space-y-3">
                    {DEFAULT_QUESTIONS.map((q, idx) => (
                      <li key={idx} className="text-sm">
                        <p className="font-medium text-charcoal">{q.text}</p>
                        <ul className="ml-4 mt-1 list-disc space-y-1 text-charcoal/70">
                          {q.options.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!eventData.useDefaultQuestions && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-charcoal">Custom Questions</h3>
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addQuestion}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Question
                  </AnimatedButton>
                </div>

                {eventData.customQuestions.map((q, index) => (
                  <AnimatedCard key={index} className="relative">
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`question-${index}`}>Question</Label>
                        <Input
                          id={`question-${index}`}
                          value={q.text}
                          onChange={(e) => updateQuestion(index, e.target.value)}
                          placeholder="Enter your question"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label>Options</Label>
                          <AnimatedButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(index)}
                            className="flex items-center gap-1 text-xs"
                          >
                            <Plus className="h-3 w-3" /> Add Option
                          </AnimatedButton>
                        </div>
                        
                        <div className="space-y-2">
                          {q.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(index, optionIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            )}

            <AnimatedButton
              type="submit"
              className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating Event..." : "Create Event"}
            </AnimatedButton>
          </motion.form>
        )}
      </motion.div>
    </main>
  )
}
