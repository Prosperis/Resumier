import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import type * as React from "react";
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { badgeVariants } from "./badge-variants";

function Badge({
  className,
  variant,
  asChild = false,
  animated = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    animated?: boolean;
  }) {
  const prefersReducedMotion = useReducedMotion();
  const Comp = asChild ? Slot : "span";

  if (!animated || asChild) {
    return (
      <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
    );
  }

  const MotionSpan = motion.span;

  return (
    <MotionSpan
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      initial={prefersReducedMotion ? undefined : { scale: 0.8, opacity: 0 }}
      animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
      transition={
        prefersReducedMotion ? undefined : { type: "spring", stiffness: 500, damping: 25 }
      }
      {...(props as React.ComponentProps<typeof MotionSpan>)}
    />
  );
}

export { Badge };
