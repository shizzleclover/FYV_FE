import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Mock database for events (in a real app, this would be a database call)
const mockEvents = {
  '1': {
    id: '1',
    title: 'Tech Conference 2023',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'San Francisco, CA',
    description: 'Annual technology conference featuring the latest innovations',
    eventCode: 'TECH2023',
    attendeeCount: 42,
    status: 'active',
    organizer: 'TechCorp',
    maxAttendees: 200,
    attendees: [
      { id: 'user1', name: 'John Doe', email: 'john@example.com' },
      { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  },
  '2': {
    id: '2',
    title: 'Networking Mixer',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'New York, NY',
    description: 'Professional networking event for industry leaders',
    eventCode: 'NET2023',
    attendeeCount: 28,
    status: 'completed',
    organizer: 'Business Network Inc',
    maxAttendees: 50,
    attendees: [
      { id: 'user1', name: 'John Doe', email: 'john@example.com' },
      { id: 'user3', name: 'Alex Johnson', email: 'alex@example.com' }
    ]
  }
}

export async function POST(req: NextRequest) {
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
    
    // Parse request body
    const { eventId } = await req.json()
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }
    
    const event = mockEvents[eventId]
    
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
      const userRegistered = event.attendees.some(
        attendee => attendee.id === decoded.id || attendee.email === decoded.email
      )
      
      if (!userRegistered) {
        return NextResponse.json(
          { error: 'You are not registered for this event' },
          { status: 400 }
        )
      }
      
      // Check if the event has already started or completed
      const eventDate = new Date(event.date)
      const now = new Date()
      
      if (event.status === 'completed' || eventDate < now) {
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