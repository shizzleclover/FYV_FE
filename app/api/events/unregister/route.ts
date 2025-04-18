import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { findEventById, isUserRegisteredForEvent } from '@/app/lib/eventData'
import { isPastEvent } from '@/app/lib/event'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    // Extract authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Extract token
    const token = authHeader.split(' ')[1]
    
    // Parse request body
    const { eventId } = await request.json()
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }
    
    // Find the event using the imported function
    const event = findEventById(eventId)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { 
        id: string
        email: string 
      }
      
      // Check if the user is registered for this event
      const userRegistered = isUserRegisteredForEvent(eventId, decoded.id)
      
      if (!userRegistered) {
        return NextResponse.json(
          { error: 'You are not registered for this event' },
          { status: 400 }
        )
      }
      
      // Check if the event has already started or completed
      if (isPastEvent(event)) {
        return NextResponse.json(
          { error: 'Cannot unregister from an event that has already started or completed' },
          { status: 400 }
        )
      }
      
      // In a real app, you would update the database here
      // For this mock implementation, we'll just return a success message
      
      return NextResponse.json({
        success: true,
        message: 'Successfully unregistered from the event',
        event: {
          id: event.id,
          title: event.title,
        }
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