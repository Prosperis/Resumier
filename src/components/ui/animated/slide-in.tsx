/**
 * SlideIn Component
 * Wrapper component that slides in its children from a specified direction
 */

import type { HTMLMotionProps } from "framer-motion"
import { motion } from "framer-motion"
import {
  useAnimationTransition,
  useAnimationVariants,
} from "@/lib/animations/hooks/use-reduced-motion"
import { defaultTransition } from "@/lib/animations/transitions"
import {
  fadeDownVariants,
  fadeLeftVariants,
  fadeRightVariants,
  fadeUpVariants,
} from "@/lib/animations/variants"

type Direction = "up" | "down" | "left" | "right"

interface SlideInProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
}

const directionVariants = {
  up: fadeUpVariants,
  down: fadeDownVariants,
  left: fadeLeftVariants,
  right: fadeRightVariants,
}

/**
 * SlideIn - Slides in content from specified direction
 *
 * @example
 * ```tsx
 * <SlideIn direction="up" delay={0.1}>
 *   <p>This content will slide up</p>
 * </SlideIn>
 * ```
 */
export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration,
  className,
  ...props
}: SlideInProps) {
  const variants = useAnimationVariants(directionVariants[direction])
  const transition = useAnimationTransition({
    ...defaultTransition,
    delay,
    ...(duration && { duration }),
  })

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
