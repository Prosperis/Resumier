import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import type * as React from "react";
import {
  useAnimationTransition,
  useAnimationVariants,
} from "@/lib/animations/hooks/use-reduced-motion";
import { fadeVariants } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const variants = useAnimationVariants(fadeVariants);
  const transition = useAnimationTransition({ duration: 0.15 });

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        asChild
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          className={cn(
            "z-50 w-fit rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
            className,
          )}
        >
          {children}
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
