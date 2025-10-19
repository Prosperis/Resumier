/**
 * Animation Transitions
 * Reusable transition configurations for Framer Motion
 */

import type { Transition } from "framer-motion"

/**
 * Duration presets in seconds
 */
export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.75,
} as const

/**
 * Easing functions
 * Based on Material Design and common web standards
 */
export const easings = {
  // Standard easing
  easeInOut: [0.4, 0.0, 0.2, 1] as const,
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  easeIn: [0.4, 0.0, 1, 1] as const,

  // Sharp transitions
  sharp: [0.4, 0.0, 0.6, 1] as const,

  // Custom easing
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  smooth: [0.645, 0.045, 0.355, 1] as const,
}

/**
 * Default transition
 * Use for most animations
 */
export const defaultTransition: Transition = {
  duration: durations.normal,
  ease: easings.easeInOut,
}

/**
 * Fast transition
 * For quick micro-interactions
 */
export const fastTransition: Transition = {
  duration: durations.fast,
  ease: easings.easeOut,
}

/**
 * Slow transition
 * For emphasis and important changes
 */
export const slowTransition: Transition = {
  duration: durations.slow,
  ease: easings.smooth,
}

/**
 * Spring transition
 * For natural, physics-based animations
 */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

/**
 * Bouncy spring transition
 * For playful interactions
 */
export const bouncySpringTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 17,
  mass: 0.8,
}

/**
 * Smooth spring transition
 * For gentle, smooth animations
 */
export const smoothSpringTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
}

/**
 * Stiff spring transition
 * For snappy, responsive feel
 */
export const stiffSpringTransition: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 25,
}

/**
 * Page transition
 * For route/page changes
 */
export const pageTransition: Transition = {
  duration: durations.normal,
  ease: easings.easeInOut,
}

/**
 * Modal transition
 * For dialog/modal animations
 */
export const modalTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

/**
 * Dropdown transition
 * For menu and dropdown animations
 */
export const dropdownTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
}

/**
 * Stagger transition
 * For sequential animations
 */
export const staggerTransition: Transition = {
  staggerChildren: 0.1,
  delayChildren: 0.05,
}

/**
 * Layout transition
 * For layout animations (use sparingly)
 */
export const layoutTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

/**
 * Collapse transition
 * For expanding/collapsing content
 */
export const collapseTransition: Transition = {
  duration: durations.normal,
  ease: easings.easeInOut,
}

/**
 * Instant transition
 * Disables animation (for reduced motion)
 */
export const instantTransition: Transition = {
  duration: durations.instant,
}

/**
 * Create custom transition
 * Helper function to create transition with overrides
 */
export function createTransition(overrides: Partial<Transition> = {}): Transition {
  return {
    ...defaultTransition,
    ...overrides,
  }
}

/**
 * Create spring transition
 * Helper function to create spring transition with overrides
 */
export function createSpringTransition(overrides: Partial<Transition> = {}): Transition {
  return {
    ...springTransition,
    ...overrides,
  }
}
