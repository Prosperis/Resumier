/**
 * Resume Page Wrapper
 * Wraps resume content with pagination support, showing page breaks
 * and splitting content into standard A4-sized pages.
 *
 * This component creates a multi-page view where each page appears as
 * a separate sheet of paper with gaps between them (like viewing a PDF).
 *
 * It properly splits content across pages and ensures correct alignment
 * at the top of each page, similar to PDF rendering.
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface ResumePageWrapperProps {
  children: ReactNode;
  className?: string;
}

// A4 page dimensions in pixels (at 96 DPI)
// 21cm = 794px, 29.7cm = 1123px
export const PAGE_WIDTH = 794; // 21cm
export const PAGE_HEIGHT = 1123; // 29.7cm (A4 height)

// Minimum height threshold - elements shorter than this that get split will be pushed to next page
const MIN_ELEMENT_HEIGHT = 60; // About 2-3 lines of text

export function ResumePageWrapper({ children, className }: ResumePageWrapperProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);
  const [contentHeight, setContentHeight] = useState(PAGE_HEIGHT);
  const [adjustmentStyles, setAdjustmentStyles] = useState<string>("");

  // Generate a CSS selector path for an element relative to a root
  const getElementPath = useCallback((element: Element, root: Element): string => {
    const path: string[] = [];
    let current: Element | null = element;

    while (current && current !== root && current.parentElement) {
      const parent: Element = current.parentElement;
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(current);
      const tagName = current.tagName.toLowerCase();
      path.unshift(`${tagName}:nth-child(${index + 1})`);
      current = parent;
    }

    return path.join(" > ");
  }, []);

  // Calculate adjustments for text blocks and sections that would be cut
  const calculateTextBlockAdjustments = useCallback(() => {
    if (!measureRef.current) return "";

    const containerRect = measureRef.current.getBoundingClientRect();
    const adjustments: Array<{ selector: string; adjustment: number }> = [];
    let cumulativeAdjustment = 0;

    // Find the resume content root (first child of measure container)
    const contentRoot = measureRef.current.firstElementChild;
    if (!contentRoot) return "";

    // FIRST: Handle orphaned section headers (headers near page breaks without content below)
    const sections = measureRef.current.querySelectorAll("section");
    const orphanedSectionIndices: Array<{ idx: number; adjustment: number }> = [];

    let sectionIndex = 0;
    for (const section of sections) {
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top - containerRect.top + cumulativeAdjustment;
      const sectionHeight = sectionRect.height;
      const sectionBottom = sectionTop + sectionHeight;

      // Check if this section starts and ends on the same page
      const startPage = Math.floor(sectionTop / PAGE_HEIGHT);
      const endPage = Math.floor((sectionBottom - 1) / PAGE_HEIGHT);

      // If section already spans multiple pages, skip it
      if (startPage === endPage) {
        const header = section.querySelector("h2");
        if (header) {
          const headerRect = header.getBoundingClientRect();
          const headerTop = headerRect.top - containerRect.top + cumulativeAdjustment;
          const headerHeight = headerRect.height;
          const headerBottom = headerTop + headerHeight;
          const headerText = header.textContent?.trim() || "";

          // How much space is left on this page after the header?
          const pageBottom = (startPage + 1) * PAGE_HEIGHT;
          const spaceAfterHeader = pageBottom - headerBottom;
          const minContentSpace = 120; // Require more space - about 5 lines minimum

          // If header is too close to page bottom, push entire section to next page
          if (spaceAfterHeader < minContentSpace) {
            const adjustment = pageBottom - headerTop;
            orphanedSectionIndices.push({ idx: sectionIndex, adjustment });
            cumulativeAdjustment += adjustment;
            console.warn(
              `[Page Break] Detected orphaned section #${sectionIndex} ("${headerText}") at ${headerTop.toFixed(0)}px, pushing by ${adjustment.toFixed(0)}px`,
            );
          }
        }
      }
      sectionIndex++;
    }

    // Build CSS for orphaned sections - use nth-of-type to target specific sections with calculated adjustments
    let orphanedSectionCSS = orphanedSectionIndices
      .map(
        ({ idx, adjustment }) =>
          `section:nth-of-type(${idx + 1}) { margin-top: ${adjustment}px !important; }`,
      )
      .join("\n");

    // SECOND: Handle small text-containing elements that might get cut
    const textElements = measureRef.current.querySelectorAll("p, li, h1, h2, h3, h4, h5, h6");

    // Filter to leaf-level text elements
    const leafTextElements: Element[] = [];
    textElements.forEach((el) => {
      const hasBlockChildren = el.querySelector("p, li, div, section, article");
      if (!hasBlockChildren && el.textContent?.trim()) {
        leafTextElements.push(el);
      }
    });

    // Sort by vertical position
    const elementsWithPositions = leafTextElements
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          element: el,
          top: rect.top - containerRect.top,
          height: rect.height,
        };
      })
      .filter((e) => e.height > 0 && e.height < 200)
      .sort((a, b) => a.top - b.top);

    // Find elements that would be cut and need adjustment
    for (const { element, top, height } of elementsWithPositions) {
      const adjustedTop = top + cumulativeAdjustment;
      const adjustedBottom = adjustedTop + height;

      const startPage = Math.floor(adjustedTop / PAGE_HEIGHT);
      const endPage = Math.floor((adjustedBottom - 1) / PAGE_HEIGHT);

      // Check if element spans a page boundary
      if (startPage !== endPage && height < MIN_ELEMENT_HEIGHT * 3) {
        const nextPageStart = (startPage + 1) * PAGE_HEIGHT;
        const contentBeforeBreak = nextPageStart - adjustedTop;
        const contentAfterBreak = adjustedBottom - nextPageStart;

        if (contentBeforeBreak < MIN_ELEMENT_HEIGHT || contentAfterBreak < MIN_ELEMENT_HEIGHT) {
          const adjustment = nextPageStart - adjustedTop;
          const path = getElementPath(element, contentRoot);
          if (path) {
            adjustments.push({ path, adjustment });
            cumulativeAdjustment += adjustment;
          }
        }
      }
    }

    // Generate CSS using structural selectors that work on both hidden and visible content
    const mainStyleString = adjustments
      .map(({ selector, path, adjustment }) => {
        const target = selector || (path ? `.resume-light-mode ${path}` : null);
        return target ? `${target} { margin-top: ${adjustment}px !important; }` : "";
      })
      .filter((css) => css.length > 0)
      .join("\n");

    // Combine orphaned section CSS with other adjustments
    const fullStyleString = [orphanedSectionCSS, mainStyleString]
      .filter((css) => css.length > 0)
      .join("\n");
    return fullStyleString;
  }, [getElementPath]);

  // Calculate pages based on content height
  const calculatePages = useCallback(() => {
    if (!measureRef.current) return;

    try {
      // Calculate text block adjustments using structural CSS selectors
      const styles = calculateTextBlockAdjustments();
      setAdjustmentStyles(styles);

      // Wait a frame for adjustments to apply, then measure
      requestAnimationFrame(() => {
        if (!measureRef.current) return;

        const content = measureRef.current;
        const height = content.scrollHeight || content.offsetHeight;

        if (height <= 0) return;

        setContentHeight(height);
        const pages = Math.max(1, Math.ceil(height / PAGE_HEIGHT));
        setPageCount(pages);
      });
    } catch (error) {
      console.error("Error calculating pages:", error);
    }
  }, [calculateTextBlockAdjustments]);

  useEffect(() => {
    const timeoutId = setTimeout(calculatePages, 150);

    let resizeObserver: ResizeObserver | null = null;
    let resizeTimeoutId: number | null = null;

    const observerTimeoutId = setTimeout(() => {
      if (measureRef.current) {
        resizeObserver = new ResizeObserver(() => {
          if (resizeTimeoutId) {
            clearTimeout(resizeTimeoutId);
          }
          resizeTimeoutId = window.setTimeout(calculatePages, 100);
        });
        resizeObserver.observe(measureRef.current);
      }
    }, 200);

    window.addEventListener("resize", calculatePages);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(observerTimeoutId);
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", calculatePages);
    };
  }, [calculatePages]);

  // Clone children for each page - all pages share the same content structure
  const cloneChildren = useCallback(
    (pageIndex: number) => {
      if (!isValidElement(children)) return children;
      return cloneElement(children, { key: `page-content-${pageIndex}` });
    },
    [children],
  );

  // Calculate last page content height
  const lastPageContentHeight = contentHeight - (pageCount - 1) * PAGE_HEIGHT;

  return (
    <div className={cn("relative flex flex-col items-center gap-4", className)}>
      {/* Inject page break prevention styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Prevent sections from breaking inside (keeps header + content together) */
            section {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            /* Prevent section headers from breaking away from content */
            section h2,
            div > h2 {
              break-after: avoid;
              page-break-after: avoid;
              orphans: 3;
              widows: 3;
            }

            /* Prevent individual items from breaking if possible */
            section > div > div {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            /* Prevent containers from breaking (for non-section templates) */
            .resume-light-mode > div {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            /* Allow list items to break if the container does */
            li {
              break-inside: auto;
              page-break-inside: auto;
            }

            ${adjustmentStyles}
          `,
        }}
      />

      {/* Hidden measurement container - positioned outside visible area */}
      <div
        ref={measureRef}
        style={{
          position: "fixed",
          width: `${PAGE_WIDTH}px`,
          visibility: "hidden",
          left: "-9999px",
          top: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Render each page as a separate container with proper clipping */}
      {Array.from({ length: pageCount }, (_, pageIndex) => {
        const isLastPage = pageIndex === pageCount - 1;
        // For the last page, calculate how much content is visible
        const visibleContentOnLastPage = Math.max(50, lastPageContentHeight);
        const pageTopOffset = pageIndex * PAGE_HEIGHT;

        return (
          <div
            key={`page-${pageIndex}`}
            data-resume-page
            className="relative"
            style={{
              width: `${PAGE_WIDTH}px`,
              height: isLastPage ? `${visibleContentOnLastPage}px` : `${PAGE_HEIGHT}px`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Shadow container - full page for regular pages, content height for last page */}
            <div
              className="absolute top-0 left-0 bg-white"
              style={{
                width: `${PAGE_WIDTH}px`,
                height: isLastPage ? `${visibleContentOnLastPage}px` : `${PAGE_HEIGHT}px`,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                zIndex: 0,
              }}
            />

            {/* White background fill for the rest of last page (no shadow) */}
            {isLastPage && visibleContentOnLastPage < PAGE_HEIGHT && (
              <div
                className="absolute left-0 bg-white"
                style={{
                  width: `${PAGE_WIDTH}px`,
                  top: `${visibleContentOnLastPage}px`,
                  height: `${PAGE_HEIGHT - visibleContentOnLastPage}px`,
                  zIndex: 0,
                }}
              />
            )}

            {/* Content positioned to show the correct slice for this page */}
            {/* Content starts at top:0 of each page container, shifted up by the page offset */}
            {/* This ensures each page shows only its portion, aligned at the top */}
            <div
              className="absolute top-0 left-0"
              style={{
                transform: `translateY(-${pageTopOffset}px)`,
                width: `${PAGE_WIDTH}px`,
                zIndex: 1,
                willChange: "transform",
              }}
            >
              {cloneChildren(pageIndex)}
            </div>

            {/* Page number indicator - excluded from export via data-no-print */}
            {pageCount > 1 && (
              <div
                className="absolute right-4 pointer-events-none print:hidden"
                data-no-print
                style={{
                  top: isLastPage ? `${visibleContentOnLastPage - 24}px` : `${PAGE_HEIGHT - 24}px`,
                  zIndex: 10,
                }}
              >
                <span className="text-xs text-gray-400">
                  {pageIndex + 1} / {pageCount}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
