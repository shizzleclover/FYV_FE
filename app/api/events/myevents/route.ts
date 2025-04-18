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
  },
  '3': {
    id: '3',
    title: 'Web Development Workshop',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Austin, TX',
    description: 'Hands-on workshop for web developers',
    eventCode: 'WEBDEV',
    attendeeCount: 15,
    status: 'active',
    organizer: 'Code Masters',
    maxAttendees: 30,
    attendees: [
      { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  }
}

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
      
      // Find all events the user is registered for
      const userEvents = Object.values(mockEvents).filter(event => 
        event.attendees.some(
          attendee => attendee.id === decoded.id || attendee.email === decoded.email
        )
      )
      
      // Format the response to include only necessary information
      const formattedEvents = userEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        status: event.status,
        organizer: event.organizer,
        attendeeCount: event.attendeeCount
      }))
      
      // Sort events by date (upcoming first)
      formattedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      return NextResponse.json({
        success: true,
        events: formattedEvents
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