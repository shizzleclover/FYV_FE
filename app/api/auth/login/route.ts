import { NextRequest, NextResponse } from 'next/server'
import { API_BASE_URL } from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    // Parse request body to forward it
    const body = await request.json()
    
    // Forward the request to the real API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    // Get the response data
    const data = await response.json()
    
    // Return the response from the API with the same status
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Failed to log in' },
      { status: 500 }
    )
  }
} 