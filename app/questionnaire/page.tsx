"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { ProgressSteps } from "@/components/ui/progress-steps"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Sample questions data
const questionsData = [
  {
    category: "Personality",
    questions: [
      {
        id: "p1",
        text: "I consider myself more of an introvert than an extrovert.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: "p2",
        text: "I enjoy trying new activities and experiences.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
    ],
  },
  {
    category: "Relationship Preferences",
    questions: [
      {
        id: "r1",
        text: "I value emotional connection over physical attraction.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: "r2",
        text: "I prefer someone with similar interests and hobbies.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
    ],
  },
  {
    category: "Lifestyle",
    questions: [
      {
        id: "l1",
        text: "I enjoy going out and socializing on weekends.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
      {
        id: "l2",
        text: "I prefer quiet evenings at home over going out.",
        options: [
          { value: "1", label: "Strongly Disagree" },
          { value: "2", label: "Disagree" },
          { value: "3", label: "Neutral" },
          { value: "4", label: "Agree" },
          { value: "5", label: "Strongly Agree" },
        ],
      },
    ],
  },
]

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const currentSectionQuestions = questionsData[currentSection].questions
  const allCurrentQuestionsAnswered = currentSectionQuestions.every((q) => answers[q.id])

  const handleNext = () => {
    if (currentSection < questionsData.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        router.push("/outfit-description")
      }, 1000)
    }
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    } else {
      router.back()
    }
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
        <h1 className="mb-2 text-center text-3xl font-bold text-charcoal">Questionnaire</h1>
        <p className="mb-6 text-center text-charcoal/70">Help us find your best matches</p>

        <ProgressSteps steps={questionsData.length} currentStep={currentSection + 1} className="mb-8" />

        <AnimatedCard className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-lapisLazuli">{questionsData[currentSection].category}</h2>

          <div className="space-y-6">
            {currentSectionQuestions.map((question) => (
              <div key={question.id} className="space-y-3">
                <p className="font-medium text-charcoal">{question.text}</p>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="grid grid-cols-5 gap-2"
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex flex-col items-center">
                      <RadioGroupItem
                        value={option.value}
                        id={`${question.id}-${option.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${question.id}-${option.value}`}
                        className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-carolinaBlue bg-white p-2 text-center text-xs peer-data-[state=checked]:border-lapisLazuli peer-data-[state=checked]:bg-lapisLazuli/10 peer-data-[state=checked]:font-medium"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedButton
          onClick={handleNext}
          className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
          disabled={!allCurrentQuestionsAnswered || isLoading}
        >
          {isLoading ? (
            "Processing..."
          ) : currentSection < questionsData.length - 1 ? (
            <span className="flex items-center">
              Next Section <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          ) : (
            "Continue"
          )}
        </AnimatedButton>
      </motion.div>
    </main>
  )
}
