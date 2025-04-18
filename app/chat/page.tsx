"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, User } from "lucide-react"

// Sample chat data
const initialMessages = [
  {
    id: "1",
    sender: "match",
    text: "Hi there! I noticed we matched. How are you enjoying the event?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    sender: "user",
    text: "Hey! It's been great so far. Your outfit description caught my attention!",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    sender: "match",
    text: "Thanks! I liked yours too. What brought you to this event?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
]

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate typing indicator
    setIsTyping(true)

    // Simulate response after delay
    setTimeout(() => {
      const matchResponse = {
        id: (Date.now() + 1).toString(),
        sender: "match",
        text: "That's interesting! Would you like to meet up at the event?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, matchResponse])
      setIsTyping(false)
    }, 3000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <main className="flex min-h-screen flex-col bg-nyanza">
      <header className="flex items-center gap-4 border-b bg-white p-4">
        <button onClick={() => router.back()} className="text-charcoal/70 hover:text-charcoal">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lapisLazuli">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-medium text-charcoal">Alex</h1>
            <p className="text-xs text-charcoal/70">Your match</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === "user" ? "bg-lapisLazuli text-white" : "bg-white text-charcoal"
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-right text-xs ${message.sender === "user" ? "text-white/70" : "text-charcoal/50"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-white px-4 py-3 text-charcoal">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0,
                    }}
                    className="h-2 w-2 rounded-full bg-charcoal/30"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.2,
                    }}
                    className="h-2 w-2 rounded-full bg-charcoal/30"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.4,
                    }}
                    className="h-2 w-2 rounded-full bg-charcoal/30"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="border-t bg-white p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <AnimatedButton
            type="submit"
            size="icon"
            className="bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </AnimatedButton>
        </div>
      </form>
    </main>
  )
}
