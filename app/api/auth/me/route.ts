import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/api'

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
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Forward the request to the real API
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    })
    
    // Get the response data
    const data = await response.json()
    
    // Return the response from the API with the same status
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 