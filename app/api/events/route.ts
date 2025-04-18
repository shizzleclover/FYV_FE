import { NextResponse } from "next/server"
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, you would save this to a database
    console.log("Event data received:", body)

    // Generate a random event code
    const eventCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    return NextResponse.json({
      success: true,
      eventCode,
      message: "Event created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create event" }, { status: 500 })
  }
}

// This is a mock implementation for demonstration purposes
// In a real application, you would connect to your database
// to fetch the events associated with the authenticated user

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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
        email: string 
      }
      
      // Return mock events data
      // In a real app, you would fetch this from your database
      return NextResponse.json({
        events: [
          {
            id: '1',
            title: 'Tech Conference 2023',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days in future
            location: 'San Francisco, CA',
            description: 'Annual technology conference featuring the latest innovations',
            eventCode: 'TECH2023',
            attendeeCount: 42,
            status: 'active'
          },
          {
            id: '2',
            title: 'Networking Mixer',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            location: 'New York, NY',
            description: 'Professional networking event for industry leaders',
            eventCode: 'NET2023',
            attendeeCount: 28,
            status: 'completed'
          }
        ]
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
