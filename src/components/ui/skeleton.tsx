/**
 * Skeleton Component
 * Loading placeholder with shimmer effect
 */

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/animations/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "rectangular" | "circular" | "text";
  shimmer?: boolean;
}

/**
 * Skeleton - Loading placeholder with optional shimmer effect
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-full" />
 * <Skeleton variant="circular" className="h-12 w-12" />
 * <Skeleton variant="text" />
 * ```
 */
function Skeleton({ className, variant = "rectangular", shimmer = true, ...props }: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantClasses = {
    rectangular: "rounded-md",
    circular: "rounded-full",
    text: "h-4 rounded-md",
  };

  const shimmerAnimation = {
    initial: { x: "-100%" },
    animate: { x: "100%" },
  };

  // Use simple pulse animation if reduced motion or shimmer disabled
  if (!shimmer || prefersReducedMotion) {
    return (
      <div
        data-slot="skeleton"
        className={cn("bg-accent animate-pulse", variantClasses[variant], className)}
        {...props}
      />
    );
  }

  // Use shimmer animation
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent relative overflow-hidden", variantClasses[variant], className)}
      {...props}
    >
      <motion.div
        className="via-muted-foreground/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
        variants={shimmerAnimation}
        initial="initial"
        animate="animate"
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
}

/**
 * SkeletonText - Multiple lines of skeleton text
 *
 * @example
 * ```tsx
 * <SkeletonText lines={3} />
 * ```
 */
function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} variant="text" className={cn(index === lines - 1 && "w-3/4")} />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - Skeleton for card component
 *
 * @example
 * ```tsx
 * <SkeletonCard />
 * ```
 */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card space-y-4 rounded-xl border p-6", className)}>
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

/**
 * SkeletonTable - Skeleton for table component
 *
 * @example
 * ```tsx
 * <SkeletonTable rows={5} columns={4} />
 * ```
 */
function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border", className)}>
      {/* Table header */}
      <div className="bg-muted/50 border-b p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-20" />
          ))}
        </div>
      </div>
      {/* Table rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SkeletonForm - Skeleton for form component
 *
 * @example
 * ```tsx
 * <SkeletonForm fields={5} />
 * ```
 */
function SkeletonForm({ fields = 5, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonForm };
