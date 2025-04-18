import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// This is a mock implementation for demonstration purposes
// In a real application, you would connect to your database
// to retrieve the user profile based on the authenticated token

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
        name: string
      }
      
      // Return mock user data
      // In a real app, you would fetch this from your database
      return NextResponse.json({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        eventCount: 2,
        recentEvents: [
          { eventCode: "ABC123" },
          { eventCode: "XYZ789" }
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