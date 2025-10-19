import { motion } from "framer-motion"
import type * as React from "react"
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const prefersReducedMotion = useReducedMotion()
  const MotionTextarea = motion.textarea

  return (
    <MotionTextarea
      data-slot="textarea"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-[80px] flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      whileFocus={prefersReducedMotion ? undefined : { scale: 1.01 }}
      transition={
        prefersReducedMotion ? undefined : { type: "spring", stiffness: 300, damping: 25 }
      }
      {...(props as React.ComponentProps<typeof MotionTextarea>)}
    />
  )
}

export { Textarea }
