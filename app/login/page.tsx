"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { login, register, isAuthenticated } from "@/lib/auth"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" })

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await login(loginData.email, loginData.password)
      
      if (response) {
        toast.success("Login successful")
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      toast.error("An error occurred during login")
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await register(
        registerData.name,
        registerData.email,
        registerData.password
      )
      
      if (response) {
        toast.success("Registration successful")
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
      toast.error("An error occurred during registration")
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
        <h1 className="mb-6 text-center text-3xl font-bold text-charcoal">
          Welcome to <span className="text-lapisLazuli">Event Matcher</span>
        </h1>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required 
                />
              </div>

              <AnimatedButton
                type="submit"
                className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </AnimatedButton>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required 
                />
              </div>

              <AnimatedButton
                type="submit"
                className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </AnimatedButton>
            </form>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  )
}
