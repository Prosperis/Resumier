import { useEffect, useRef } from "react"
import { useTheme } from "@/app/theme-provider"

interface AnimatedDotGridProps {
  dotSize?: number
  dotSpacing?: number
  waveRadius?: number
  waveIntensity?: number
  enabled?: boolean
}

/**
 * Animated dot grid background component
 * Creates a grid of dots that animate in a wave pattern following the mouse cursor
 */
export function AnimatedDotGrid({
  dotSize = 2,
  dotSpacing = 40,
  waveRadius = 150,
  waveIntensity = 20,
  enabled = true,
}: AnimatedDotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<{ x: number; y: number; baseX: number; baseY: number; element?: HTMLElement }[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationFrameRef = useRef<number | undefined>(undefined)
  const isAnimatingRef = useRef(false)
  const { theme } = useTheme()
  
  // Pre-calculate wave radius squared to avoid sqrt in hot path
  const waveRadiusSq = waveRadius * waveRadius

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    // Debounced resize handler for better performance
    let resizeTimeout: NodeJS.Timeout
    const updateContainerSize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        createDots()
      }, 150)
    }

    const createDots = () => {
      const dots: typeof dotsRef.current = []
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      const cols = Math.ceil(containerWidth / dotSpacing)
      const rows = Math.ceil(containerHeight / dotSpacing)

      // Clear existing dots
      container.querySelectorAll(".dot").forEach((dot) => dot.remove())

      // Create dot elements with performance optimizations
      const fragment = document.createDocumentFragment()
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * dotSpacing + dotSpacing / 2
          const y = j * dotSpacing + dotSpacing / 2

          const dot = document.createElement("div")
          dot.className = "dot absolute rounded-full pointer-events-none"
          
          // Batch style updates
          const styles = [
            `width: ${dotSize}px`,
            `height: ${dotSize}px`,
            `left: ${x}px`,
            `top: ${y}px`,
            "transform: translate(-50%, -50%)",
            "will-change: transform",
            "contain: layout style paint",
          ].join("; ")
          
          dot.style.cssText = styles

          dots.push({
            x,
            y,
            baseX: x,
            baseY: y,
            element: dot,
          })
        }
      }
      
      // Append all dots at once for better performance
      container.appendChild(fragment)
      dotsRef.current = dots
      updateDotColors()
    }

    const updateDotColors = () => {
      const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
      const dotColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)"

      // Batch color updates for better performance
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i]
        if (dot.element) {
          dot.element.style.backgroundColor = dotColor
        }
      }
    }

    const animateDots = () => {
      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y

      // Batch DOM updates for better performance
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i]
        if (!dot.element) continue

        const dx = mouseX - dot.baseX
        const dy = mouseY - dot.baseY
        const distanceSq = dx * dx + dy * dy

        // Use squared distance to avoid expensive sqrt
        if (distanceSq < waveRadiusSq) {
          // Only calculate sqrt when needed
          const distance = Math.sqrt(distanceSq)
          const force = (1 - distance / waveRadius) * waveIntensity
          const angle = Math.atan2(dy, dx)

          // Apply transform directly for smooth animation
          const translateX = Math.cos(angle) * force
          const translateY = Math.sin(angle) * force
          const scale = 1 + (force / waveIntensity) * 0.5
          
          // Use will-change for optimization hint
          dot.element.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`
        } else {
          // Return to original position
          dot.element.style.transform = "translate(-50%, -50%) scale(1)"
        }
      }
      
      isAnimatingRef.current = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Only update if mouse is within container bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y }

        // Throttle animations - only start if not already animating
        if (!isAnimatingRef.current) {
          isAnimatingRef.current = true
          animationFrameRef.current = requestAnimationFrame(() => {
            animateDots()
          })
        }
      }
    }

    const handleMouseLeave = () => {
      // Move mouse far away to trigger reset
      mouseRef.current = { x: -1000, y: -1000 }

      // Reset all dots to original position
      dotsRef.current.forEach((dot) => {
        if (!dot.element) return
        dot.element.style.transform = "translate(-50%, -50%) scale(1)"
      })
    }

    // Initialize
    createDots()
    
    // Use passive event listeners for better performance
    window.addEventListener("resize", updateContainerSize, { passive: true })
    // Use document-level events to work with pointer-events-none
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true })

    // Update colors when theme changes
    updateDotColors()

    return () => {
      window.removeEventListener("resize", updateContainerSize)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Clean up dots
      container.querySelectorAll(".dot").forEach((dot) => dot.remove())
    }
  }, [dotSize, dotSpacing, waveRadius, waveIntensity, theme, enabled])

  if (!enabled) {
    return null
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dots will be appended here via JavaScript */}
    </div>
  )
}
