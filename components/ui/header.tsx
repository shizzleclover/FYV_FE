"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Features", href: "/#features" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isTransparent = pathname === "/"

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isTransparent ? "bg-transparent py-4" : "border-b border-gray-200 bg-white py-3 shadow-sm",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/" className="z-10">
          <Logo variant={isTransparent ? "light" : "dark"} size="md" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              className={cn(
                isTransparent
                  ? "text-white hover:bg-white/10 hover:text-white"
                  : "text-charcoal hover:bg-gray-100 hover:text-charcoal",
              )}
            >
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}

          <div className="ml-4 flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className={cn(
                isTransparent
                  ? "border-white text-white hover:bg-white/10"
                  : "border-lapisLazuli text-lapisLazuli hover:bg-lapisLazuli/10",
              )}
            >
              <Link href="/join-event">Join Event</Link>
            </Button>

            <Button asChild className="bg-lapisLazuli text-white hover:bg-lapisLazuli/90">
              <Link href="/create-event">Host Event</Link>
            </Button>
          </div>
        </nav>

        <button className="z-10 rounded-md p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <X className={cn("h-6 w-6", isTransparent ? "text-white" : "text-charcoal")} />
          ) : (
            <Menu className={cn("h-6 w-6", isTransparent ? "text-white" : "text-charcoal")} />
          )}
        </button>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-0 z-0 bg-white p-6 pt-24 shadow-lg"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-charcoal hover:text-lapisLazuli"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-4 flex flex-col gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-lapisLazuli text-lapisLazuli hover:bg-lapisLazuli/10"
                >
                  <Link href="/join-event" onClick={() => setMobileMenuOpen(false)}>
                    Join Event
                  </Link>
                </Button>

                <Button asChild className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90">
                  <Link href="/create-event" onClick={() => setMobileMenuOpen(false)}>
                    Host Event
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
