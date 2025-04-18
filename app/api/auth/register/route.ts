import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { User } from '@/lib/auth'

// Mock JWT secret (in a real app, this would be in an environment variable)
const JWT_SECRET = 'your-secret-key-here'

// Mock user database (in a real app, this would be a database connection)
const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    isHost: true,
    createdAt: new Date(2023, 0, 15).toISOString(),
    eventCount: 3
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    isHost: false,
    createdAt: new Date(2023, 1, 20).toISOString()
  }
]

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      isHost: false, // Default to non-host user
      createdAt: new Date().toISOString()
    }

    // In a real app, you would hash the password and save to DB
    // For mock purposes, we'll just add to our users array
    users.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return success response with token and user data
    return NextResponse.json({
      token,
      user: newUser
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Failed to register user' },
      { status: 500 }
    )
  }
} 