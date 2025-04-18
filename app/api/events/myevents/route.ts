import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { findEventsByUserId } from '@/app/lib/eventData'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1]
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string }
    const userId = decoded.id

    // Get events the user is registered for
    const userEvents = findEventsByUserId(userId)
    
    // Sort by date (closest upcoming events first)
    const sortedEvents = [...userEvents].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })

    return NextResponse.json({
      success: true,
      events: sortedEvents
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    console.error('Error fetching user events:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
} 