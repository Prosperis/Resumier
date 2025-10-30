import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import type * as React from "react";
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const prefersReducedMotion = useReducedMotion();
  const Comp = asChild ? Slot : "button";

  // If asChild, don't wrap with motion (let child handle animations)
  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }

  const MotionButton = motion.button;

  return (
    <MotionButton
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      transition={
        prefersReducedMotion ? undefined : { type: "spring", stiffness: 400, damping: 17 }
      }
      {...(props as React.ComponentProps<typeof MotionButton>)}
    />
  );
}

export { Button };
