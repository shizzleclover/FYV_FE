"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { AnimatedButton } from "@/components/ui/button-animated"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Header } from "@/components/ui/header"
import {
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Star,
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle2,
  Shirt,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LandingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("about")

  const features = [
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Meet New People",
      description: "Connect with others at events based on compatibility and shared vibes",
      color: "bg-lapisLazuli",
    },
    {
      icon: <Shirt className="h-6 w-6 text-white" />,
      title: "Outfit Matching",
      description: "Describe your outfit and find people with complementary styles",
      color: "bg-carolinaBlue",
    },
    {
      icon: <Star className="h-6 w-6 text-white" />,
      title: "Rate & Match",
      description: "Vote on outfits and get matched based on mutual attraction",
      color: "bg-charcoal",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      title: "Real-time Chat",
      description: "Message your matches instantly during the event",
      color: "bg-lapisLazuli",
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Create or Join an Event",
      description: "Hosts can create events with custom questions, or participants can join with an event code",
      icon: <Calendar className="h-8 w-8 text-lapisLazuli" />,
    },
    {
      step: 2,
      title: "Answer the Questionnaire",
      description: "Share your preferences across multiple categories to find your best matches",
      icon: <CheckCircle2 className="h-8 w-8 text-lapisLazuli" />,
    },
    {
      step: 3,
      title: "Describe Your Outfit",
      description: "Tell others what you're wearing so they can find you at the event",
      icon: <Shirt className="h-8 w-8 text-lapisLazuli" />,
    },
    {
      step: 4,
      title: "Wait for the Countdown",
      description: "Once the event starts, the matching process begins",
      icon: <Clock className="h-8 w-8 text-lapisLazuli" />,
    },
    {
      step: 5,
      title: "Vote on Outfits",
      description: "Rate other participants' outfits to help determine matches",
      icon: <Star className="h-8 w-8 text-lapisLazuli" />,
    },
    {
      step: 6,
      title: "Discover Your Matches",
      description: "See who you matched with based on compatibility and mutual interest",
      icon: <Heart className="h-8 w-8 text-lapisLazuli" />,
    },
    {
      step: 7,
      title: "Chat and Connect",
      description: "Message your matches and decide if you want to meet in person",
      icon: <MessageCircle className="h-8 w-8 text-lapisLazuli" />,
    },
  ]

  const categories = [
    "Sexual Orientation",
    "Relationship Preferences",
    "Personality & Compatibility",
    "Flirty & Romantic Preferences",
    "Party & Social Vibes",
    "Icebreakers & Fun",
    "Deep Personality & Self-Reflection",
  ]

  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lapisLazuli via-carolinaBlue to-lightGreen pt-32 text-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute right-1/4 top-3/4 h-64 w-64 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lapisLazuli"
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
            </div>

            <h1 className="mb-4 font-montserrat text-4xl sm:text-5xl font-bold leading-tight md:text-6xl px-4">
              Find Your <span className="text-lightGreen">Vibe</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg sm:text-xl text-white/90 px-4">
              Connect with like-minded people at events based on compatibility, shared interests, and outfit vibes
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row px-4">
              <AnimatedButton
                className="w-full bg-white text-lapisLazuli hover:bg-white/90 sm:w-auto"
                onClick={() => router.push("/join-event")}
              >
                Join an Event
              </AnimatedButton>

              <AnimatedButton
                className="w-full border-2 border-white bg-transparent text-white hover:bg-white/10 sm:w-auto"
                onClick={() => router.push("/create-event")}
              >
                Host an Event
              </AnimatedButton>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 mx-auto -mb-16 mt-12 w-full max-w-5xl px-4 sm:px-6"
        >
          <div className="overflow-hidden rounded-3xl bg-white/10 p-1 backdrop-blur-lg">
            <div className="rounded-2xl bg-white p-4">
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="FYV App Interface"
                className="w-full rounded-xl object-cover shadow-lg"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-nyanza py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 font-montserrat text-3xl font-bold text-charcoal md:text-4xl"
            >
              Why Choose <span className="text-lapisLazuli">FYV</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-2xl text-lg text-charcoal/70"
            >
              Our unique approach to event-based matchmaking creates meaningful connections through shared interests and
              style
            </motion.p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatedCard className="h-full">
                  <div className="mb-6 flex justify-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${feature.color}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-xl font-semibold text-charcoal">{feature.title}</h3>
                  <p className="text-center text-charcoal/70">{feature.description}</p>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 font-montserrat text-3xl font-bold text-charcoal md:text-4xl"
            >
              How <span className="text-lapisLazuli">FYV</span> Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-2xl text-lg text-charcoal/70"
            >
              A simple step-by-step process to find your perfect match at any event
            </motion.p>
          </div>

          <div className="mx-auto max-w-4xl">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative mb-8 flex items-start gap-6 last:mb-0"
              >
                {index < howItWorks.length - 1 && (
                  <div className="absolute left-6 top-16 h-[calc(100%-32px)] w-0.5 -translate-x-1/2 bg-carolinaBlue/30"></div>
                )}

                <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-carolinaBlue/10">
                  {step.icon}
                </div>

                <div className="flex-1">
                  <h3 className="mb-2 flex items-center font-montserrat text-xl font-semibold text-charcoal">
                    <span className="mr-2 rounded-full bg-lapisLazuli px-2 py-0.5 text-sm text-white">
                      Step {step.step}
                    </span>
                    {step.title}
                  </h3>
                  <p className="text-charcoal/70">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="bg-carolinaBlue/10 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 font-montserrat text-3xl font-bold text-charcoal md:text-4xl"
            >
              Explore <span className="text-lapisLazuli">FYV</span> Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-2xl text-lg text-charcoal/70"
            >
              Discover all the tools and features that make FYV the perfect matchmaking platform for events
            </motion.p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3">
                <TabsTrigger value="about">About FYV</TabsTrigger>
                <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
                <TabsTrigger value="matching">Matching System</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="rounded-xl bg-white p-6 shadow-md">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 font-montserrat text-2xl font-semibold text-lapisLazuli">What is FYV?</h3>
                    <p className="mb-4 text-charcoal/80">
                      Find Your Vibe (FYV) is an innovative event-based matchmaking platform that helps people connect
                      based on compatibility, shared interests, and outfit vibes.
                    </p>
                    <p className="mb-4 text-charcoal/80">
                      Whether you're at a party, conference, or social gathering, FYV makes it easy to find people
                      you'll click with.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "No profile pictures required - match based on real connection",
                        "Real-time matching during events",
                        "Comprehensive questionnaire for accurate matching",
                        "Fun, interactive voting system",
                        "Instant chat with your matches",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="mr-2 mt-0.5 h-5 w-5 text-lightGreen" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="overflow-hidden rounded-xl bg-carolinaBlue/10 p-6">
                      <img
                        src="/placeholder.svg?height=300&width=300"
                        alt="FYV App Interface"
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="questionnaire" className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="mb-4 font-montserrat text-2xl font-semibold text-lapisLazuli">
                  Comprehensive Questionnaire
                </h3>
                <p className="mb-6 text-charcoal/80">
                  Our detailed questionnaire covers multiple categories to ensure the most compatible matches. Hosts can
                  use our default questions or create custom ones for their event.
                </p>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  {categories.map((category, i) => (
                    <div key={i} className="flex items-center rounded-lg bg-carolinaBlue/10 p-3">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-lapisLazuli text-white">
                        {i + 1}
                      </div>
                      <span className="font-medium text-charcoal">{category}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-lightGreen/10 p-4">
                  <div className="flex items-start">
                    <Zap className="mr-2 mt-0.5 h-5 w-5 text-lapisLazuli" />
                    <div>
                      <h4 className="font-medium text-charcoal">Personalized Experience</h4>
                      <p className="text-sm text-charcoal/70">
                        Questions adapt based on your orientation and preferences to ensure the most relevant matching
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="matching" className="rounded-xl bg-white p-6 shadow-md">
                <h3 className="mb-4 font-montserrat text-2xl font-semibold text-lapisLazuli">Smart Matching System</h3>
                <p className="mb-6 text-charcoal/80">
                  Our algorithm combines questionnaire responses, outfit ratings, and mutual interest to create the most
                  compatible matches.
                </p>

                <div className="mb-6 grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg bg-carolinaBlue/10 p-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lapisLazuli text-white">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="mb-2 font-medium text-charcoal">Compatibility Score</h4>
                    <p className="text-sm text-charcoal/70">Based on questionnaire answers and preferences</p>
                  </div>

                  <div className="rounded-lg bg-carolinaBlue/10 p-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lapisLazuli text-white">
                        <Star className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="mb-2 font-medium text-charcoal">Outfit Ratings</h4>
                    <p className="text-sm text-charcoal/70">Rate outfits to indicate attraction and style preference</p>
                  </div>

                  <div className="rounded-lg bg-carolinaBlue/10 p-4 text-center">
                    <div className="mb-3 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lapisLazuli text-white">
                        <Trophy className="h-6 w-6" />
                      </div>
                    </div>
                    <h4 className="mb-2 font-medium text-charcoal">Leaderboard</h4>
                    <p className="text-sm text-charcoal/70">See top-rated outfits and most popular participants</p>
                  </div>
                </div>

                <div className="rounded-lg bg-lightGreen/10 p-4">
                  <div className="flex items-start">
                    <Heart className="mr-2 mt-0.5 h-5 w-5 text-lapisLazuli" />
                    <div>
                      <h4 className="font-medium text-charcoal">Follow-Up System</h4>
                      <p className="text-sm text-charcoal/70">
                        After the event, indicate if you're interested in reconnecting with your matches. Contact
                        information is only shared if there's mutual interest.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-lapisLazuli to-charcoal py-16 sm:py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 font-montserrat text-3xl font-bold md:text-4xl"
            >
              Ready to Find Your Vibe?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-lg text-white/80"
            >
              Join an existing event or host your own to start connecting with like-minded people
            </motion.p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row px-4 sm:px-0">
              <AnimatedButton
                className="w-full bg-white text-lapisLazuli hover:bg-white/90 sm:w-auto"
                onClick={() => router.push("/join-event")}
              >
                <span className="flex items-center justify-center">
                  Join an Event <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </AnimatedButton>

              <AnimatedButton
                className="w-full border-2 border-white bg-transparent text-white hover:bg-white/10 sm:w-auto"
                onClick={() => router.push("/create-event")}
              >
                <span className="flex items-center justify-center">Host an Event</span>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal py-8 sm:py-12 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lapisLazuli">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">FYV</h3>
            </div>

            <div className="flex gap-6">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                About
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Features
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                How It Works
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Contact
              </Button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Find Your Vibe (FYV). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
