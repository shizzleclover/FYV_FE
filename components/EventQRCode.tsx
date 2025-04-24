"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Copy, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface EventQRCodeProps {
  eventCode: string
  showTitle?: boolean
}

export default function EventQRCode({ eventCode, showTitle = true }: EventQRCodeProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [eventTitle, setEventTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQRCode() {
      try {
        setLoading(true)
        // Use the new QR code endpoint with query parameter
        const response = await fetch(`/api/event-qrcode?code=${eventCode}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch QR code: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setQrCode(data.qrCode)
        setEventTitle(data.eventTitle)
        setError(null)
      } catch (err) {
        console.error('Error fetching QR code:', err)
        setError(`Failed to load QR code: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    if (eventCode) {
      fetchQRCode()
    }
  }, [eventCode])

  const handleDownload = () => {
    if (!qrCode) return
    
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `event-${eventCode}-qrcode.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('QR code downloaded')
  }

  const handleCopy = async () => {
    if (!qrCode) return
    
    try {
      // Convert the data URL to a blob
      const response = await fetch(qrCode)
      const blob = await response.blob()
      
      // Use the clipboard API to copy the image
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      toast.success('QR code copied to clipboard')
    } catch (err) {
      console.error('Failed to copy QR code:', err)
      toast.error('Failed to copy QR code')
    }
  }

  const handleShare = async () => {
    if (!qrCode) return
    
    try {
      // Convert data URL to blob for sharing
      const response = await fetch(qrCode)
      const blob = await response.blob()
      
      if (navigator.share) {
        await navigator.share({
          title: `QR Code for ${eventTitle || 'Event'}`,
          text: `Here's the QR code for event: ${eventCode}`,
          files: [new File([blob], `event-${eventCode}.png`, { type: 'image/png' })]
        })
        toast.success('QR code shared')
      } else {
        toast.error('Sharing not supported on this device')
      }
    } catch (err) {
      console.error('Failed to share QR code:', err)
      toast.error('Failed to share QR code')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lapisLazuli border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Generating QR code...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {showTitle && eventTitle && (
        <h3 className="mb-3 text-xl font-semibold text-charcoal">{eventTitle}</h3>
      )}
      
      {qrCode && (
        <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-lg">
          <Image 
            src={qrCode} 
            alt={`QR Code for ${eventTitle || eventCode}`}
            fill
            className="object-contain"
            unoptimized={true}
          />
        </div>
      )}
      
      <p className="mb-3 text-center text-sm text-gray-500">
        Event Code: <span className="font-mono font-medium">{eventCode}</span>
      </p>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="flex items-center gap-1"
        >
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  )
} 