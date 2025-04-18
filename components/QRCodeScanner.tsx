"use client"

import { useState, useEffect, useRef } from 'react'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Button } from '@/components/ui/button'
import { Loader2, ScanLine, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface QRCodeScannerProps {
  onScan: (data: string) => void
  onClose?: () => void
}

export default function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true

    const initCamera = async () => {
      try {
        // Check if QR code scanning is supported (needs https or localhost)
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access not supported in this browser')
        }

        // Start the camera
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })

        if (!mounted) {
          // If component was unmounted during the async operation
          mediaStream.getTracks().forEach(track => track.stop())
          return
        }

        setStream(mediaStream)

        // Wait for video to be ready
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          await new Promise(resolve => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = resolve
            }
          })
          
          // Start video playback
          await videoRef.current.play()
          
          // Start scanning for QR codes
          startScanning()
        }

        setLoading(false)
      } catch (err) {
        console.error('Error accessing camera:', err)
        if (mounted) {
          setError((err as Error).message || 'Failed to access camera')
          setLoading(false)
        }
      }
    }

    initCamera()

    // Cleanup
    return () => {
      mounted = false
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      // Dynamically import jsQR for client-side only
      const jsQR = (await import('jsqr')).default

      const scanFrame = () => {
        if (!videoRef.current || !canvasRef.current) {
          animationFrameId.current = requestAnimationFrame(scanFrame)
          return
        }

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          animationFrameId.current = requestAnimationFrame(scanFrame)
          return
        }

        // Only process frames if video is playing
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Set canvas dimensions to match video
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Draw current video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Get image data for QR code scanning
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          
          // Scan for QR code in the image
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          })

          if (code) {
            // QR code found!
            console.log('QR code detected:', code.data)
            
            try {
              // Try to parse as JSON if it's a FYV QR code
              const data = JSON.parse(code.data)
              if (data.eventCode) {
                // Valid event QR code
                onScan(data.eventCode)
                return // Stop scanning
              }
            } catch (e) {
              // Not JSON, try to use as plain text
              onScan(code.data)
              return // Stop scanning
            }
          }
        }

        // Continue scanning
        animationFrameId.current = requestAnimationFrame(scanFrame)
      }

      // Start the scanning loop
      scanFrame()
    } catch (err) {
      console.error('Error loading jsQR library:', err)
      setError('Failed to initialize QR scanner')
    }
  }

  const handleClose = () => {
    // Clean up resources
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
    }
    
    // Call onClose callback if provided
    if (onClose) {
      onClose()
    }
  }

  if (loading) {
    return (
      <AnimatedCard className="flex flex-col items-center p-6">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-lapisLazuli" />
        <p className="text-charcoal/70">Accessing camera...</p>
      </AnimatedCard>
    )
  }

  if (error) {
    return (
      <AnimatedCard className="flex flex-col items-center p-6">
        <XCircle className="mb-4 h-10 w-10 text-red-500" />
        <p className="mb-4 text-center text-red-500">{error}</p>
        <Button variant="outline" onClick={handleClose}>Close</Button>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard className="relative flex flex-col items-center p-4">
      <div className="relative mb-4 overflow-hidden rounded-lg">
        {/* The video is hidden visually but used for capture */}
        <video 
          ref={videoRef} 
          className="h-64 w-full object-cover"
          muted
          playsInline
        />
        
        {/* Canvas where we'll render the video frames for processing */}
        <canvas 
          ref={canvasRef} 
          className="absolute left-0 top-0 h-full w-full"
        />
        
        {/* Scanner overlay effect */}
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <ScanLine className="h-16 w-16 animate-pulse text-lapisLazuli opacity-80" />
        </div>
      </div>
      
      <p className="mb-4 text-center text-sm text-charcoal/70">
        Position the QR code within the frame to scan
      </p>
      
      <Button variant="outline" onClick={handleClose}>
        Cancel
      </Button>
    </AnimatedCard>
  )
} 