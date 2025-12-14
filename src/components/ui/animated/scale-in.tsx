/**
 * ScaleIn Component
 * Wrapper component that scales in its children
 */

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import {
  useAnimationTransition,
  useAnimationVariants,
} from "@/lib/animations/hooks/use-reduced-motion";
import { springTransition } from "@/lib/animations/transitions";
import { scaleBounceVariants, scaleVariants } from "@/lib/animations/variants";

interface ScaleInProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  bounce?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * ScaleIn - Scales in content with optional bounce
 *
 * @example
 * ```tsx
 * <ScaleIn bounce>
 *   <p>This content will scale in with bounce</p>
 * </ScaleIn>
 * ```
 */
export function ScaleIn({
  children,
  bounce = false,
  delay = 0,
  duration,
  className,
  ...props
}: ScaleInProps) {
  const variants = useAnimationVariants(bounce ? scaleBounceVariants : scaleVariants);
  const transition = useAnimationTransition({
    ...springTransition,
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
