"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { User, Lock, Mail, UserPlus, LogIn } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields")
        return false
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill in all fields")
        return false
      }
      
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return false
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return false
      }
    }
    
    return true
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      
      const requestBody = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password 
          }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password 
          }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed")
      }
      
      // Store token in localStorage
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userName', isLogin ? data.name : formData.name)
      localStorage.setItem('isHost', "true")
      
      toast.success(isLogin ? "Logged in successfully" : "Registered successfully")
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error("Authentication error:", error)
      toast.error((error as Error).message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-charcoal">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="text-charcoal/70">
          {isLogin ? "Sign in to manage your events" : "Register to start creating events"}
        </p>
      </motion.div>
      
      <AnimatedCard className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-charcoal">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-charcoal/50" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white border border-charcoal/20 text-charcoal text-sm rounded-lg focus:ring-lapisLazuli focus:border-lapisLazuli block w-full pl-10 p-2.5"
                  placeholder="Your name"
                />
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-charcoal">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-charcoal/50" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white border border-charcoal/20 text-charcoal text-sm rounded-lg focus:ring-lapisLazuli focus:border-lapisLazuli block w-full pl-10 p-2.5"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-charcoal">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="w-5 h-5 text-charcoal/50" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-white border border-charcoal/20 text-charcoal text-sm rounded-lg focus:ring-lapisLazuli focus:border-lapisLazuli block w-full pl-10 p-2.5"
                placeholder="••••••"
              />
            </div>
          </div>
          
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-charcoal">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-charcoal/50" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-white border border-charcoal/20 text-charcoal text-sm rounded-lg focus:ring-lapisLazuli focus:border-lapisLazuli block w-full pl-10 p-2.5"
                  placeholder="••••••"
                />
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-lapisLazuli text-white hover:bg-lapisLazuli/90"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {isLogin ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              </div>
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-lapisLazuli hover:underline"
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </AnimatedCard>
    </main>
  )
} 