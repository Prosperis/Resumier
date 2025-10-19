/**
 * Animated Badge Utilities
 * Extended badge animations for notifications and counts
 */

import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface NotificationBadgeProps {
  count: number
  max?: number
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary"
}

/**
 * NotificationBadge - Animated badge with count
 *
 * @example
 * ```tsx
 * <NotificationBadge count={5} max={99} variant="destructive" />
 * ```
 */
export function NotificationBadge({
  count,
  max = 99,
  variant = "destructive",
  className,
}: NotificationBadgeProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayCount = count > max ? `${max}+` : count

  if (count === 0) return null

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? undefined
          : {
              scale: 0,
              opacity: 0,
            }
      }
      animate={
        prefersReducedMotion
          ? undefined
          : {
              scale: 1,
              opacity: 1,
            }
      }
      exit={
        prefersReducedMotion
          ? undefined
          : {
              scale: 0,
              opacity: 0,
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              type: "spring",
              stiffness: 500,
              damping: 25,
            }
      }
      className={className}
    >
      <Badge variant={variant} animated>
        {displayCount}
      </Badge>
    </motion.div>
  )
}

interface PulseBadgeProps {
  children: React.ReactNode
  pulse?: boolean
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary"
}

/**
 * PulseBadge - Badge with optional pulsing animation
 *
 * @example
 * ```tsx
 * <PulseBadge pulse variant="destructive">New</PulseBadge>
 * ```
 */
export function PulseBadge({
  children,
  pulse = true,
  variant = "default",
  className,
}: PulseBadgeProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={
        pulse && !prefersReducedMotion
          ? {
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1],
            }
          : {}
      }
      transition={
        pulse && !prefersReducedMotion
          ? {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
          : undefined
      }
      className={className}
    >
      <Badge variant={variant}>{children}</Badge>
    </motion.div>
  )
}

interface StatusBadgeProps {
  status: "online" | "offline" | "away" | "busy"
  showText?: boolean
  className?: string
}

/**
 * StatusBadge - Animated status indicator
 *
 * @example
 * ```tsx
 * <StatusBadge status="online" showText />
 * ```
 */
export function StatusBadge({ status, showText = false, className }: StatusBadgeProps) {
  const prefersReducedMotion = useReducedMotion()

  const statusConfig = {
    online: {
      color: "bg-green-500",
      text: "Online",
      pulse: true,
    },
    offline: {
      color: "bg-gray-500",
      text: "Offline",
      pulse: false,
    },
    away: {
      color: "bg-yellow-500",
      text: "Away",
      pulse: false,
    },
    busy: {
      color: "bg-red-500",
      text: "Busy",
      pulse: true,
    },
  }

  const config = statusConfig[status]

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="relative">
        <motion.div
          className={cn("h-2 w-2 rounded-full", config.color)}
          animate={
            config.pulse && !prefersReducedMotion
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }
              : {}
          }
          transition={
            config.pulse && !prefersReducedMotion
              ? {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : undefined
          }
        />
        {config.pulse && !prefersReducedMotion && (
          <motion.div
            className={cn("absolute inset-0 rounded-full", config.color)}
            animate={{
              scale: [1, 2, 2],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        )}
      </div>
      {showText && <span className="text-sm text-muted-foreground">{config.text}</span>}
    </div>
  )
}
