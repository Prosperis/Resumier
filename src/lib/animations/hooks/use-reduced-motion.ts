/**
 * Reduced Motion Hook
 * Respects user's motion preferences for accessibility
 */

import type { Transition, Variants } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Detects if user has requested reduced motion
 * Returns true if animations should be reduced/disabled
 *
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={shouldReduceMotion ? {} : { scale: 1.2 }}
 *   transition={shouldReduceMotion ? { duration: 0 } : springTransition}
 * >
 * ```
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if matchMedia is supported (for SSR and test environments)
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    // Create media query for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Additional guard for test environments
    if (!mediaQuery) {
      return;
    }

    // Set initial value
    setShouldReduceMotion(mediaQuery.matches);

    // Create event listener for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches);
    };

    // Add listener (use deprecated addListener for Safari < 14)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers - using type assertion
      (mediaQuery as MediaQueryList & { addListener: typeof handleChange }).addListener(
        handleChange,
      );
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers - using type assertion
        (mediaQuery as MediaQueryList & { removeListener: typeof handleChange }).removeListener(
          handleChange,
        );
      }
    };
  }, []);

  return shouldReduceMotion;
}

/**
 * Hook to get animation-safe transition
 * Returns instant transition if reduced motion is preferred
 *
 * @param transition - Transition to use when motion is allowed
 * @returns Transition object
 *
 * @example
 * ```tsx
 * const transition = useAnimationTransition(springTransition)
 *
 * <motion.div
 *   animate={{ scale: 1.2 }}
 *   transition={transition}
 * >
 * ```
 */
export function useAnimationTransition(transition: Transition = {}): Transition {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return { duration: 0 };
  }

  return transition;
}

/**
 * Hook to get animation-safe variants
 * Returns empty variants if reduced motion is preferred
 *
 * @param variants - Variants to use when motion is allowed
 * @returns Variants object or empty object
 *
 * @example
 * ```tsx
 * const variants = useAnimationVariants(fadeUpVariants)
 *
 * <motion.div
 *   variants={variants}
 *   initial="hidden"
 *   animate="visible"
 * >
 * ```
 */
export function useAnimationVariants(variants: Variants): Variants | Record<string, never> {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return {};
  }

  return variants;
}
