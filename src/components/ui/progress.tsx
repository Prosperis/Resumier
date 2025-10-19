/**
 * Progress Component
 * Animated progress indicators
 */

import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number // 0-100
  max?: number
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

/**
 * Progress - Animated linear progress bar
 *
 * @example
 * ```tsx
 * <Progress value={75} variant="primary" showValue />
 * ```
 */
export function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showValue = false,
  className,
}: ProgressProps) {
  const prefersReducedMotion = useReducedMotion()
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const variantClasses = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-destructive",
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div
        className={cn("relative w-full overflow-hidden rounded-full bg-muted", sizeClasses[size])}
      >
        <motion.div
          className={cn("h-full rounded-full", variantClasses[variant])}
          initial={prefersReducedMotion ? { width: `${percentage}%` } : { width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 0.5,
                  ease: "easeOut",
                }
          }
        />
      </div>
      {showValue && (
        <div className="text-xs text-muted-foreground text-right">{Math.round(percentage)}%</div>
      )}
    </div>
  )
}

interface CircularProgressProps {
  value: number // 0-100
  max?: number
  size?: number
  strokeWidth?: number
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
  showValue?: boolean
  className?: string
}

/**
 * CircularProgress - Animated circular progress indicator
 *
 * @example
 * ```tsx
 * <CircularProgress value={75} size={120} showValue />
 * ```
 */
export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "primary",
  showValue = false,
  className,
}: CircularProgressProps) {
  const prefersReducedMotion = useReducedMotion()
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const variantColors = {
    default: "stroke-muted-foreground",
    primary: "stroke-primary",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    destructive: "stroke-destructive",
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        role="img"
        aria-label={`Progress: ${Math.round(percentage)}%`}
      >
        <title>Circular progress indicator</title>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={variantColors[variant]}
          initial={
            prefersReducedMotion
              ? {
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                }
              : {
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference,
                }
          }
          animate={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 1,
                  ease: "easeOut",
                }
          }
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}

interface IndeterminateProgressProps {
  variant?: "default" | "primary"
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * IndeterminateProgress - Animated indeterminate progress bar
 *
 * @example
 * ```tsx
 * <IndeterminateProgress variant="primary" />
 * ```
 */
export function IndeterminateProgress({
  variant = "primary",
  size = "md",
  className,
}: IndeterminateProgressProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const variantClasses = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
  }

  if (prefersReducedMotion) {
    return (
      <div
        className={cn("w-full overflow-hidden rounded-full bg-muted", sizeClasses[size], className)}
      >
        <div className={cn("h-full w-1/3 animate-pulse rounded-full", variantClasses[variant])} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-muted",
        sizeClasses[size],
        className,
      )}
    >
      <motion.div
        className={cn("absolute h-full w-1/3 rounded-full", variantClasses[variant])}
        animate={{
          x: ["-100%", "400%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
