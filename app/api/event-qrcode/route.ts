import { NextRequest, NextResponse } from 'next/server'
import { findEventByCode } from '@/app/lib/eventData'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  try {
    // Get the event code from the query parameter
    const searchParams = request.nextUrl.searchParams
    const eventCode = searchParams.get('code')

    if (!eventCode) {
      return NextResponse.json(
        { error: 'Event code is required' },
        { status: 400 }
      )
    }

    // Find the event by code using the proper data source
    const event = findEventByCode(eventCode)

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(
      JSON.stringify({
        eventId: event.id,
        eventCode: event.eventCode,
        title: event.title
      })
    )

    // Return the QR code
    return NextResponse.json({
      success: true,
      eventCode: event.eventCode,
      eventTitle: event.title,
      qrCode: qrCodeDataUrl
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
} 