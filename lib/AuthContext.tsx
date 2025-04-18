"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, getUserProfile, logout, isAuthenticated, register, login } from '@/lib/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isHost: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Function to refresh the user profile from the server
  const refreshUserProfile = async () => {
    if (!isAuthenticated()) {
      setUser(null)
      setLoading(false)
      return
    }
    
    try {
      const userData = await getUserProfile()
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Initialize auth state on component mount
  useEffect(() => {
    refreshUserProfile()
  }, [])
  
  // Login handler
  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true)
      const response = await login(username, password)
      
      if (response) {
        setUser(response.user)
        toast.success('Logged in successfully')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // Register handler
  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      setLoading(true)
      const response = await register(username, email, password)
      
      if (response) {
        setUser(response.user)
        toast.success('Account created successfully')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // Logout handler
  const handleLogout = () => {
    logout()
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/auth')
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isHost: user?.isHost || false,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
} 