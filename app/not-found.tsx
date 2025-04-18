import Link from "next/link"
import { AnimatedButton } from "@/components/ui/button-animated"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-2 text-6xl font-bold text-lapisLazuli">404</h1>
      <h2 className="mb-6 text-2xl font-semibold text-charcoal">Page Not Found</h2>
      <p className="mb-8 max-w-md text-charcoal/70">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/">
        <AnimatedButton className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </AnimatedButton>
      </Link>
    </div>
  )
}
