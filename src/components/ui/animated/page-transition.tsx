/**
 * PageTransition Component
 * Wrapper for page transitions using AnimatePresence
 */

import type { HTMLMotionProps } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import {
  useAnimationTransition,
  useAnimationVariants,
} from "@/lib/animations/hooks/use-reduced-motion";
import { pageTransition } from "@/lib/animations/transitions";
import { fadeUpVariants } from "@/lib/animations/variants";

interface PageTransitionProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  pageKey: string;
  className?: string;
  mode?: "wait" | "sync" | "popLayout";
}

/**
 * PageTransition - Animates page/route changes
 *
 * @example
 * ```tsx
 * <PageTransition pageKey={currentPage} mode="wait">
 *   {currentPage === "dashboard" ? <Dashboard /> : <Builder />}
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  pageKey,
  className,
  mode = "wait",
  ...props
}: PageTransitionProps) {
  const variants = useAnimationVariants(fadeUpVariants);
  const transition = useAnimationTransition(pageTransition);

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={pageKey}
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
    </AnimatePresence>
  );
}
