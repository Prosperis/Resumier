import { useEffect } from "react"
import { reportWebVitals } from "@/lib/monitoring/web-vitals"

/**
 * Hook to initialize Web Vitals tracking
 * Should be used once at the app root level
 *
 * @example
 * function App() {
 *   useWebVitals()
 *   return <YourApp />
 * }
 */
export function useWebVitals() {
  useEffect(() => {
    // Only run in production
    if (import.meta.env.PROD) {
      reportWebVitals()
    }
  }, [])
}
