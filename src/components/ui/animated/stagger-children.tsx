/**
 * StaggerChildren Component
 * Wrapper component that staggers animations of its children
 */

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import {
  useAnimationTransition,
  useAnimationVariants,
} from "@/lib/animations/hooks/use-reduced-motion";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations/variants";

interface StaggerChildrenProps
  extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

/**
 * StaggerChildren - Container that staggers child animations
 *
 * @example
 * ```tsx
 * <StaggerChildren staggerDelay={0.1}>
 *   <StaggerItem>Item 1</StaggerItem>
 *   <StaggerItem>Item 2</StaggerItem>
 *   <StaggerItem>Item 3</StaggerItem>
 * </StaggerChildren>
 * ```
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: StaggerChildrenProps) {
  const variants = useAnimationVariants(staggerContainerVariants);
  const transition = useAnimationTransition({
    staggerChildren: staggerDelay,
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

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  className?: string;
}

/**
 * StaggerItem - Child item for StaggerChildren container
 *
 * @example
 * ```tsx
 * <StaggerItem>
 *   <p>This will animate in sequence</p>
 * </StaggerItem>
 * ```
 */
export function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  const variants = useAnimationVariants(staggerItemVariants);

  return (
    <motion.div variants={variants} className={className} {...props}>
      {children}
    </motion.div>
  );
}
