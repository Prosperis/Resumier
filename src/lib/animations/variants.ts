/**
 * Animation Variants Library
 * Reusable Framer Motion animation variants for consistent UI animations
 */

import type { Variants } from "framer-motion";

/**
 * Fade Variants
 * Simple opacity transitions
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Fade Up Variants
 * Fade in while moving up
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

/**
 * Fade Down Variants
 * Fade in while moving down
 */
export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * Fade Left Variants
 * Fade in while moving from right to left
 */
export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/**
 * Fade Right Variants
 * Fade in while moving from left to right
 */
export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/**
 * Scale Variants
 * Scale from center
 */
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

/**
 * Scale Bounce Variants
 * Scale with bounce effect
 */
export const scaleBounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { opacity: 0, scale: 0.3 },
};

/**
 * Slide Up Variants
 * Slide in from bottom
 */
export const slideUpVariants: Variants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
  exit: { y: "100%" },
};

/**
 * Slide Down Variants
 * Slide in from top
 */
export const slideDownVariants: Variants = {
  hidden: { y: "-100%" },
  visible: { y: 0 },
  exit: { y: "-100%" },
};

/**
 * Slide Left Variants
 * Slide in from right
 */
export const slideLeftVariants: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

/**
 * Slide Right Variants
 * Slide in from left
 */
export const slideRightVariants: Variants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

/**
 * Stagger Container Variants
 * For parent container with staggered children
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger Item Variants
 * For child items in stagger container
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
  exit: { opacity: 0, y: -10 },
};

/**
 * Collapse Variants
 * For expandable/collapsible content
 */
export const collapseVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
  },
  expanded: {
    height: "auto",
    opacity: 1,
    overflow: "visible",
  },
};

/**
 * Drawer Variants
 * For slide-out drawer/panel
 */
export const drawerVariants = {
  left: {
    hidden: { x: "-100%" },
    visible: { x: 0 },
    exit: { x: "-100%" },
  },
  right: {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  },
  top: {
    hidden: { y: "-100%" },
    visible: { y: 0 },
    exit: { y: "-100%" },
  },
  bottom: {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  },
} as const;

/**
 * Modal/Dialog Variants
 * For modal overlays and content
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
};

/**
 * Dropdown/Menu Variants
 */
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
};

/**
 * Toast/Notification Variants
 */
export const toastVariants = {
  topRight: {
    hidden: { opacity: 0, x: 50, y: 0 },
    visible: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 50, y: 0 },
  },
  topLeft: {
    hidden: { opacity: 0, x: -50, y: 0 },
    visible: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -50, y: 0 },
  },
  bottomRight: {
    hidden: { opacity: 0, x: 50, y: 0 },
    visible: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 50, y: 0 },
  },
  bottomLeft: {
    hidden: { opacity: 0, x: -50, y: 0 },
    visible: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -50, y: 0 },
  },
} as const;

/**
 * Shimmer/Loading Variants
 * For skeleton screens
 */
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: "-200% 0",
  },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1.5,
      ease: "linear",
    },
  },
};

/**
 * Pulse Variants
 * For attention-grabbing elements
 */
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 2,
      ease: "easeInOut",
    },
  },
};

/**
 * Spin Variants
 * For loading spinners
 */
export const spinVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1,
      ease: "linear",
    },
  },
};
