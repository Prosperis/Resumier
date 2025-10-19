/**
 * Animated Icon Components
 * Reusable icon animation wrappers for micro-interactions
 */

import type { HTMLMotionProps } from "framer-motion"
import { motion } from "framer-motion"
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

interface AnimatedIconProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  className?: string
}

/**
 * RotateOnHover - Rotates icon on hover
 *
 * @example
 * ```tsx
 * <RotateOnHover>
 *   <Settings className="h-5 w-5" />
 * </RotateOnHover>
 * ```
 */
export function RotateOnHover({ children, className, ...props }: AnimatedIconProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileHover={prefersReducedMotion ? undefined : { rotate: 180 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.3, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScaleOnHover - Scales icon on hover
 *
 * @example
 * ```tsx
 * <ScaleOnHover scale={1.1}>
 *   <Heart className="h-5 w-5" />
 * </ScaleOnHover>
 * ```
 */
export function ScaleOnHover({
  children,
  className,
  scale = 1.1,
  ...props
}: AnimatedIconProps & { scale?: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileHover={prefersReducedMotion ? undefined : { scale }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={
        prefersReducedMotion ? undefined : { type: "spring", stiffness: 400, damping: 17 }
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * BounceOnHover - Bounces icon on hover
 *
 * @example
 * ```tsx
 * <BounceOnHover>
 *   <Star className="h-5 w-5" />
 * </BounceOnHover>
 * ```
 */
export function BounceOnHover({ children, className, ...props }: AnimatedIconProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: [0, -4, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 0.5,
              ease: "easeInOut",
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * ShakeOnHover - Shakes icon on hover (for destructive actions)
 *
 * @example
 * ```tsx
 * <ShakeOnHover>
 *   <Trash className="h-5 w-5" />
 * </ShakeOnHover>
 * ```
 */
export function ShakeOnHover({ children, className, ...props }: AnimatedIconProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              x: [0, -2, 2, -2, 2, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration: 0.4,
              ease: "easeInOut",
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * PulseOnHover - Pulses icon on hover
 *
 * @example
 * ```tsx
 * <PulseOnHover>
 *   <Bell className="h-5 w-5" />
 * </PulseOnHover>
 * ```
 */
export function PulseOnHover({ children, className, ...props }: AnimatedIconProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileHover={
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
              duration: 0.4,
              repeat: Number.POSITIVE_INFINITY,
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * SpinOnClick - Spins icon on click
 *
 * @example
 * ```tsx
 * <SpinOnClick>
 *   <RefreshCw className="h-5 w-5" />
 * </SpinOnClick>
 * ```
 */
export function SpinOnClick({ children, className, ...props }: AnimatedIconProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={cn("inline-flex", className)}
      whileTap={
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
              duration: 0.5,
              ease: "easeOut",
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}
