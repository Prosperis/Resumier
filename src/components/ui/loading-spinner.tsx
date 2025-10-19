/**
 * Loading Spinner Component
 * Animated loading indicator with various sizes and variants
 */

import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "muted"
  className?: string
}

/**
 * LoadingSpinner - Animated circular loading indicator
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" variant="primary" />
 * ```
 */
export function LoadingSpinner({
  size = "md",
  variant = "primary",
  className,
}: LoadingSpinnerProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  }

  const variantClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    muted: "border-muted-foreground border-t-transparent",
  }

  return (
    <motion.div
      className={cn("rounded-full", sizeClasses[size], variantClasses[variant], className)}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              rotate: 360,
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }
      }
    />
  )
}

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "muted"
  className?: string
}

/**
 * LoadingDots - Animated pulsing dots indicator
 *
 * @example
 * ```tsx
 * <LoadingDots size="md" variant="primary" />
 * ```
 */
export function LoadingDots({ size = "md", variant = "primary", className }: LoadingDotsProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  }

  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted-foreground",
  }

  const dotVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: { scale: 1.2, opacity: 1 },
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn("rounded-full", sizeClasses[size], variantClasses[variant])}
          variants={prefersReducedMotion ? undefined : dotVariants}
          initial={prefersReducedMotion ? undefined : "initial"}
          animate={prefersReducedMotion ? undefined : "animate"}
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 0.6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: index * 0.15,
                }
          }
        />
      ))}
    </div>
  )
}

interface LoadingPulseProps {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "muted"
  className?: string
}

/**
 * LoadingPulse - Animated pulsing circle indicator
 *
 * @example
 * ```tsx
 * <LoadingPulse size="md" variant="primary" />
 * ```
 */
export function LoadingPulse({ size = "md", variant = "primary", className }: LoadingPulseProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted-foreground",
  }

  return (
    <motion.div
      className={cn("rounded-full", sizeClasses[size], variantClasses[variant], className)}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
      }
    />
  )
}
