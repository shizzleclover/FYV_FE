import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// This is a mock implementation for demonstration purposes
// In a real application, you would connect to your database
// to retrieve the user profile based on the authenticated token

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Mock database for demonstration
// In a real app, this would be stored in a database
const users = [
  {
    id: 'user1',
    username: 'demohost',
    email: 'host@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isHost: true,
    eventCount: 3,
    recentEvents: [
      { eventCode: "ABC123", title: "Tech Conference 2023" },
      { eventCode: "XYZ789", title: "Networking Mixer" }
    ]
  },
  {
    id: 'user2',
    username: 'demoparticipant',
    email: 'participant@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isHost: false,
    eventCount: 0,
    recentEvents: []
  }
]

export async function GET(req: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      )
    }
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { 
        id: string
        username: string
        email: string
        isHost: boolean
      }
      
      // Find the user
      const user = users.find(u => u.id === decoded.id)
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user
      
      return NextResponse.json({
        ...userWithoutPassword,
        // Include additional profile information
        profileComplete: true,
        joinedDate: new Date(user.createdAt).toLocaleDateString(),
      })
      
    } catch (error) {
      console.error("Token verification failed:", error)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 