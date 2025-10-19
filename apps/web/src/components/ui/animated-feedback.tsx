/**
 * Animated Feedback Components
 * Success, error, and validation animations
 */

import { motion } from "framer-motion"
import { Check, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion"

interface SuccessCheckmarkProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * SuccessCheckmark - Animated checkmark that draws in
 *
 * @example
 * ```tsx
 * <SuccessCheckmark size="lg" />
 * ```
 */
export function SuccessCheckmark({ size = "md", className }: SuccessCheckmarkProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  }

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center rounded-full bg-green-500",
        sizeClasses[size],
        className,
      )}
      initial={
        prefersReducedMotion
          ? undefined
          : {
              scale: 0,
              rotate: -180,
            }
      }
      animate={
        prefersReducedMotion
          ? undefined
          : {
              scale: 1,
              rotate: 0,
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              type: "spring",
              stiffness: 260,
              damping: 20,
            }
      }
    >
      <motion.div
        initial={prefersReducedMotion ? undefined : { scale: 0 }}
        animate={prefersReducedMotion ? undefined : { scale: 1 }}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                delay: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 15,
              }
        }
      >
        <Check className={cn("text-white", iconSizeClasses[size])} />
      </motion.div>
    </motion.div>
  )
}

interface ErrorShakeProps {
  children: React.ReactNode
  trigger?: boolean
  className?: string
}

/**
 * ErrorShake - Shakes content on error
 *
 * @example
 * ```tsx
 * <ErrorShake trigger={hasError}>
 *   <Input />
 * </ErrorShake>
 * ```
 */
export function ErrorShake({ children, trigger = false, className }: ErrorShakeProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      animate={
        !prefersReducedMotion && trigger
          ? {
              x: [0, -10, 10, -10, 10, 0],
            }
          : {}
      }
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

interface ErrorCrossProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * ErrorCross - Animated error cross
 *
 * @example
 * ```tsx
 * <ErrorCross size="lg" />
 * ```
 */
export function ErrorCross({ size = "md", className }: ErrorCrossProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  }

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center rounded-full bg-destructive",
        sizeClasses[size],
        className,
      )}
      initial={
        prefersReducedMotion
          ? undefined
          : {
              scale: 0,
              rotate: 180,
            }
      }
      animate={
        prefersReducedMotion
          ? undefined
          : {
              scale: 1,
              rotate: 0,
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              type: "spring",
              stiffness: 260,
              damping: 20,
            }
      }
    >
      <motion.div
        initial={prefersReducedMotion ? undefined : { scale: 0 }}
        animate={prefersReducedMotion ? undefined : { scale: 1 }}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                delay: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 15,
              }
        }
      >
        <X className={cn("text-white", iconSizeClasses[size])} />
      </motion.div>
    </motion.div>
  )
}

interface WarningPulseProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * WarningPulse - Pulsing warning indicator
 *
 * @example
 * ```tsx
 * <WarningPulse size="md" />
 * ```
 */
export function WarningPulse({ size = "md", className }: WarningPulseProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  }

  return (
    <motion.div
      className={cn(
        "flex items-center justify-center rounded-full bg-yellow-500",
        sizeClasses[size],
        className,
      )}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              scale: [1, 1.1, 1],
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
    >
      <AlertCircle className={cn("text-white", iconSizeClasses[size])} />
    </motion.div>
  )
}

interface CountUpProps {
  value: number
  duration?: number
  className?: string
}

/**
 * CountUp - Animated number counter
 *
 * @example
 * ```tsx
 * <CountUp value={100} duration={1} />
 * ```
 */
export function CountUp({ value, duration = 1, className }: CountUpProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <span className={className}>{value}</span>
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration,
        }}
      >
        {value}
      </motion.span>
    </motion.span>
  )
}
