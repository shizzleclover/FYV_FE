import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-lapisLazuli" />
        <p className="text-lg font-medium text-charcoal">Loading...</p>
      </div>
    </div>
  )
}
