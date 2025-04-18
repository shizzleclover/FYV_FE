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

// Mock password database (in a real app, these would be hashed and stored with user records)
const passwordMap = {
  'john@example.com': 'password123',
  'jane@example.com': 'password456'
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = users.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password (in a real app, you would compare hashed passwords)
    const storedPassword = passwordMap[email]
    if (password !== storedPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return success response with token and user data
    return NextResponse.json({
      token,
      user
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Failed to log in' },
      { status: 500 }
    )
  }
} 