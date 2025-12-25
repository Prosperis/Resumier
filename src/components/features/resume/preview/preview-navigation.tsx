/**
 * Preview Navigation
 * Floating navigation buttons for the document preview area.
 * Provides quick navigation: first page, previous page, next page, last page.
 */

import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PAGE_HEIGHT } from "./resume-page-wrapper";

interface PreviewNavigationProps {
  /** Reference to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Optional additional className */
  className?: string;
}

export function PreviewNavigation({ containerRef, className }: PreviewNavigationProps) {
  // Scroll to the first page (top of document)
  const scrollToFirstPage = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Scroll to the top of the last page
  const scrollToLastPage = () => {
    if (!containerRef.current) return;

    // Account for padding (p-8 = 32px) and gap between pages (gap-4 = 16px)
    const pageWithGap = PAGE_HEIGHT + 16;
    const totalScrollHeight = containerRef.current.scrollHeight;

    // Calculate total pages based on content height
    // Subtract container padding and calculate pages
    const totalPages = Math.ceil((totalScrollHeight - 32) / pageWithGap);
    const lastPageIndex = Math.max(0, totalPages - 1);

    containerRef.current.scrollTo({
      top: lastPageIndex * pageWithGap,
      behavior: "smooth",
    });
  };

  // Scroll to the previous page
  const scrollToPreviousPage = () => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollTop;
    // Account for padding (p-8 = 32px) and gap between pages (gap-4 = 16px)
    const pageWithGap = PAGE_HEIGHT + 16;
    const currentPage = Math.floor((currentScroll + 50) / pageWithGap);
    const targetPage = Math.max(0, currentPage - 1);

    containerRef.current.scrollTo({
      top: targetPage * pageWithGap,
      behavior: "smooth",
    });
  };

  // Scroll to the next page
  const scrollToNextPage = () => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollTop;
    // Account for padding (p-8 = 32px) and gap between pages (gap-4 = 16px)
    const pageWithGap = PAGE_HEIGHT + 16;
    const currentPage = Math.floor((currentScroll + 50) / pageWithGap);
    const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
    const targetScroll = Math.min((currentPage + 1) * pageWithGap, maxScroll);

    containerRef.current.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const buttonBaseClass = cn(
    "flex items-center justify-center",
    "w-9 h-9",
    "rounded-lg",
    "bg-white dark:bg-slate-700",
    "border border-slate-200 dark:border-slate-600",
    "text-slate-600 dark:text-slate-300",
    "shadow-md",
    "cursor-pointer",
    "hover:bg-slate-50 dark:hover:bg-slate-600",
    "hover:border-slate-300 dark:hover:border-slate-500",
    "hover:text-slate-800 dark:hover:text-white",
    "transition-all duration-150",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
  );

  return (
    <div className={cn("fixed bottom-6 right-28 z-50", "flex flex-col gap-1", className)}>
      {/* Jump to First Page */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={scrollToFirstPage}
            className={buttonBaseClass}
            aria-label="Jump to first page"
          >
            <ChevronsUp className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p>Jump to first page</p>
        </TooltipContent>
      </Tooltip>

      {/* Previous Page */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={scrollToPreviousPage}
            className={buttonBaseClass}
            aria-label="Previous page"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p>Previous page</p>
        </TooltipContent>
      </Tooltip>

      {/* Next Page */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={scrollToNextPage}
            className={buttonBaseClass}
            aria-label="Next page"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p>Next page</p>
        </TooltipContent>
      </Tooltip>

      {/* Jump to Last Page */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={scrollToLastPage}
            className={buttonBaseClass}
            aria-label="Jump to last page"
          >
            <ChevronsDown className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p>Jump to last page</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
