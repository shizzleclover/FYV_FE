import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Parse request body
    const body = await req.json()
    
    // Forward the request to the real API
    const response = await fetch(`${API_BASE_URL}/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
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