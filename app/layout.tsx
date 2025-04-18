import type React from "react"
import "./globals.css"
import { Inter, Montserrat } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

export const metadata = {
  title: "FYV - Find Your Vibe | Event-Based Matchmaking",
  description: "Connect with like-minded people at events based on compatibility, shared interests, and outfit vibes.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-nyanza font-inter">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
