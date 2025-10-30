/**
 * FadeIn Component
 * Wrapper component that fades in its children
 */

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import {
  useAnimationTransition,
  useAnimationVariants,
} from "@/lib/animations/hooks/use-reduced-motion";
import { defaultTransition } from "@/lib/animations/transitions";
import { fadeVariants } from "@/lib/animations/variants";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * FadeIn - Fades in content on mount
 *
 * @example
 * ```tsx
 * <FadeIn delay={0.2}>
 *   <p>This content will fade in</p>
 * </FadeIn>
 * ```
 */
export function FadeIn({ children, delay = 0, duration, className, ...props }: FadeInProps) {
  const variants = useAnimationVariants(fadeVariants);
  const transition = useAnimationTransition({
    ...defaultTransition,
    delay,
    ...(duration && { duration }),
  });

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
  );
}
