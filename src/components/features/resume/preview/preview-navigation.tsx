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
  /** Width of the right sidebar in rem so the controls can stay clear of it */
  rightSidebarOffsetRem?: number;
  /** Optional additional className */
  className?: string;
}

export function PreviewNavigation({
  containerRef,
  rightSidebarOffsetRem = 4,
  className,
}: PreviewNavigationProps) {
  const getPageOffsets = () => {
    if (!containerRef.current) return [];

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    return Array.from(container.querySelectorAll<HTMLElement>("[data-resume-page]"))
      .map((page) => page.getBoundingClientRect().top - containerRect.top + container.scrollTop)
      .sort((a, b) => a - b);
  };

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

    const pageOffsets = getPageOffsets();
    const lastPageOffset =
      pageOffsets.length > 0
        ? pageOffsets[pageOffsets.length - 1]
        : Math.max(0, containerRef.current.scrollHeight - containerRef.current.clientHeight);

    containerRef.current.scrollTo({
      top: lastPageOffset,
      behavior: "smooth",
    });
  };

  // Scroll to the previous page
  const scrollToPreviousPage = () => {
    if (!containerRef.current) return;

    const pageOffsets = getPageOffsets();
    if (pageOffsets.length > 0) {
      const currentScroll = containerRef.current.scrollTop;
      const currentPage = pageOffsets.findLastIndex((offset) => offset <= currentScroll + 50);
      const targetPage = Math.max(0, currentPage - 1);

      containerRef.current.scrollTo({
        top: pageOffsets[targetPage] ?? 0,
        behavior: "smooth",
      });
      return;
    }

    const pageWithGap = PAGE_HEIGHT + 16;
    const currentPage = Math.floor((containerRef.current.scrollTop + 50) / pageWithGap);
    const targetPage = Math.max(0, currentPage - 1);

    containerRef.current.scrollTo({
      top: targetPage * pageWithGap,
      behavior: "smooth",
    });
  };

  // Scroll to the next page
  const scrollToNextPage = () => {
    if (!containerRef.current) return;

    const pageOffsets = getPageOffsets();
    if (pageOffsets.length > 0) {
      const currentScroll = containerRef.current.scrollTop;
      const nextPageOffset = pageOffsets.find((offset) => offset > currentScroll + 50);

      containerRef.current.scrollTo({
        top:
          nextPageOffset ??
          Math.max(0, containerRef.current.scrollHeight - containerRef.current.clientHeight),
        behavior: "smooth",
      });
      return;
    }

    const currentScroll = containerRef.current.scrollTop;
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
    <div
      className={cn("fixed bottom-6 z-50 flex flex-col gap-1", className)}
      style={{ right: `${rightSidebarOffsetRem}rem` }}
    >
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
