import { useEffect, useRef } from "react";
import { useTheme } from "@/app/theme-provider";

interface AnimatedDotGridProps {
  dotSize?: number;
  dotSpacing?: number;
  waveRadius?: number;
  waveIntensity?: number;
  enabled?: boolean;
}

/**
 * Animated dot grid background component
 * Creates a grid of dots that animate in a wave pattern following the mouse cursor
 */
export function AnimatedDotGrid({
  dotSize = 2,
  dotSpacing = 40,
  waveRadius = 150,
  waveIntensity = 20,
  enabled = true,
}: AnimatedDotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<
    {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      element?: HTMLElement;
    }[]
  >([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isAnimatingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    // Pre-calculate wave radius squared to avoid sqrt in hot path
    const waveRadiusSq = waveRadius * waveRadius;
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Debounced resize handler for better performance
    let resizeTimeout: NodeJS.Timeout;
    const updateContainerSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        createDots();
      }, 150);
    };

    const createDots = () => {
      const dots: typeof dotsRef.current = [];
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Extend grid beyond container boundaries to fill edges
      // Add extra columns and rows to cover the overflow areas
      const cols = Math.ceil(containerWidth / dotSpacing) + 2; // +2 extra columns
      const rows = Math.ceil(containerHeight / dotSpacing) + 2; // +2 extra rows

      // Clear existing dots
      for (const dot of container.querySelectorAll(".dot")) {
        dot.remove();
      }

      // Create dot elements with performance optimizations
      const fragment = document.createDocumentFragment();

      // Pre-calculate styles that don't change
      // Large hexagons for honeycomb pattern
      const hexSize = dotSpacing * 0.95; // Slightly smaller than spacing for subtle gaps
      const staticStyles = `width: ${hexSize}px; height: ${hexSize}px; transform: translate(-50%, -50%); will-change: transform; contain: layout style paint;`;

      // Start from negative positions to extend beyond container edges
      for (let i = -1; i < cols - 1; i++) {
        for (let j = -1; j < rows - 1; j++) {
          // Offset every other row for hexagonal honeycomb pattern
          const xOffset = j % 2 === 1 ? dotSpacing / 2 : 0;
          const x = i * dotSpacing + dotSpacing / 2 + xOffset;
          const y = j * dotSpacing + dotSpacing / 2;

          const dot = document.createElement("div");
          dot.className = "dot absolute pointer-events-none";

          // Create SVG hexagon outline with vibrant modern design
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("width", hexSize.toString());
          svg.setAttribute("height", hexSize.toString());
          svg.setAttribute("viewBox", `0 0 ${hexSize} ${hexSize}`);
          svg.style.transition =
            "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

          // Add gradient definition for each hexagon
          const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
          const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
          const gradientId = `hex-gradient-${i}-${j}`;
          gradient.setAttribute("id", gradientId);
          gradient.setAttribute("x1", "0%");
          gradient.setAttribute("y1", "0%");
          gradient.setAttribute("x2", "100%");
          gradient.setAttribute("y2", "100%");

          const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
          stop1.setAttribute("offset", "0%");
          stop1.setAttribute("stop-opacity", "1");
          stop1.className.baseVal = "hex-gradient-start";

          const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
          stop2.setAttribute("offset", "100%");
          stop2.setAttribute("stop-opacity", "0.7");
          stop2.className.baseVal = "hex-gradient-end";

          gradient.appendChild(stop1);
          gradient.appendChild(stop2);
          defs.appendChild(gradient);
          svg.appendChild(defs);

          const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          // Flat-top hexagon points (perfect regular hexagon with small padding for gaps)
          const inset = 0.05; // Smaller inset for subtle gaps with larger hexagons
          const points = [
            [hexSize * 0.5, hexSize * (0.067 + inset)], // top
            [hexSize * (0.933 - inset), hexSize * (0.25 + inset / 2)], // top-right
            [hexSize * (0.933 - inset), hexSize * (0.75 - inset / 2)], // bottom-right
            [hexSize * 0.5, hexSize * (0.933 - inset)], // bottom
            [hexSize * (0.067 + inset), hexSize * (0.75 - inset / 2)], // bottom-left
            [hexSize * (0.067 + inset), hexSize * (0.25 + inset / 2)], // top-left
          ]
            .map((p) => p.join(","))
            .join(" ");

          hexagon.setAttribute("points", points);
          hexagon.setAttribute("fill", "none");
          hexagon.setAttribute("stroke", `url(#${gradientId})`);
          hexagon.setAttribute("stroke-width", "3");
          hexagon.setAttribute("stroke-linecap", "round");
          hexagon.setAttribute("stroke-linejoin", "round");
          hexagon.className.baseVal = "hexagon-stroke";

          // Add smooth transitions for modern feel
          hexagon.style.transition =
            "stroke-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";

          svg.appendChild(hexagon);
          dot.appendChild(svg);

          // Apply static styles + position
          dot.style.cssText = `${staticStyles} left: ${x}px; top: ${y}px;`;

          // Add dot to fragment
          fragment.appendChild(dot);

          dots.push({
            x,
            y,
            baseX: x,
            baseY: y,
            element: dot,
          });
        }
      }

      // Append all dots at once for better performance
      container.appendChild(fragment);
      dotsRef.current = dots;
      updateDotColors();
    };

    const updateDotColors = () => {
      const isDark = theme === "dark";
      // Balanced gradients - subtle for dark mode, bold for light mode
      const gradientStart = isDark
        ? "rgba(139, 92, 246, 0.25)" // Subtle violet for dark mode
        : "rgba(124, 58, 237, 0.4)"; // Bold violet for light mode

      const gradientEnd = isDark
        ? "rgba(217, 70, 239, 0.18)" // Subtle fuchsia accent for dark mode
        : "rgba(192, 38, 211, 0.3)"; // Strong fuchsia for light mode

      // Batch color updates for better performance
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        if (dot.element) {
          // Update gradient stop colors
          const gradientStart_el = dot.element.querySelector(".hex-gradient-start");
          const gradientEnd_el = dot.element.querySelector(".hex-gradient-end");

          if (gradientStart_el && gradientEnd_el) {
            gradientStart_el.setAttribute("stop-color", gradientStart);
            gradientEnd_el.setAttribute("stop-color", gradientEnd);
          }
        }
      }
    };

    const animateDots = (timestamp: number) => {
      // Throttle to 60fps max (16ms per frame)
      if (timestamp - lastUpdateTimeRef.current < 16) {
        animationFrameRef.current = requestAnimationFrame(animateDots);
        return;
      }
      lastUpdateTimeRef.current = timestamp;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Pre-calculate inverse wave radius for performance
      const invWaveRadius = 1 / waveRadius;
      const invWaveIntensity = 1 / waveIntensity;

      // Batch DOM updates for better performance
      // Only update dots within a reasonable distance to reduce calculations
      const maxCheckDistanceSq = waveRadiusSq * 4; // Check 2x the wave radius

      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        if (!dot.element) continue;

        const dx = mouseX - dot.baseX;
        const dy = mouseY - dot.baseY;
        const distanceSq = dx * dx + dy * dy;

        // Skip dots that are too far away (optimization)
        if (distanceSq > maxCheckDistanceSq) continue;

        // Use squared distance to avoid expensive sqrt
        if (distanceSq < waveRadiusSq) {
          // Only calculate sqrt and trig when needed
          const distance = Math.sqrt(distanceSq);
          const force = (1 - distance * invWaveRadius) * waveIntensity;
          const angle = Math.atan2(dy, dx);

          // Apply transform directly for smooth animation
          const translateX = Math.cos(angle) * force;
          const translateY = Math.sin(angle) * force;
          const scale = 1 + force * invWaveIntensity * 0.5; // Enhanced scale

          // Use will-change for optimization hint
          dot.element.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale}) rotate(${force * 3}deg)`;

          // Add vibrant dynamic effects matching site theme
          const svg = dot.element.querySelector("svg");
          const hexagon = dot.element.querySelector(".hexagon-stroke");
          if (svg && hexagon) {
            // Dynamic opacity boost - full brightness on interaction
            const opacityBoost = 0.5 + force * invWaveIntensity * 0.5; // 0.5 to 1.0 range
            svg.style.opacity = opacityBoost.toString();

            // Dynamic stroke width - dramatic thickening
            const strokeWidth = 3 + force * invWaveIntensity * 2.5; // 3.0 to 5.5
            hexagon.setAttribute("stroke-width", strokeWidth.toString());

            // Multi-layer glow effect with vibrant colors
            const glowIntensity = force * invWaveIntensity * 12; // 0 to 12px blur
            const innerGlow = glowIntensity * 0.6;
            svg.style.filter = `
              drop-shadow(0 0 ${innerGlow}px rgba(139, 92, 246, 0.8))
              drop-shadow(0 0 ${glowIntensity}px rgba(217, 70, 239, 0.6))
              drop-shadow(0 0 ${glowIntensity * 1.5}px rgba(192, 38, 211, 0.4))
            `.trim();
          }
        } else {
          // Return to original position
          dot.element.style.transform = "translate(-50%, -50%) scale(1) rotate(0deg)";

          // Reset effects
          const svg = dot.element.querySelector("svg");
          const hexagon = dot.element.querySelector(".hexagon-stroke");
          if (svg && hexagon) {
            svg.style.opacity = "1";
            hexagon.setAttribute("stroke-width", "3");
            svg.style.filter = "none";
          }
        }
      }

      isAnimatingRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only update if mouse is within container bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y };

        // Throttle animations - only start if not already animating
        if (!isAnimatingRef.current) {
          isAnimatingRef.current = true;
          animationFrameRef.current = requestAnimationFrame(animateDots);
        }
      }
    };

    const handleMouseLeave = () => {
      // Move mouse far away to trigger reset
      mouseRef.current = { x: -1000, y: -1000 };

      // Reset all dots to original position
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        if (dot.element) {
          dot.element.style.transform = "translate(-50%, -50%) scale(1)";
        }
      }
    };

    // Initialize
    createDots();

    // Use passive event listeners for better performance
    window.addEventListener("resize", updateContainerSize, { passive: true });
    // Use document-level events to work with pointer-events-none
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, {
      passive: true,
    });

    // Update colors when theme changes
    updateDotColors();

    return () => {
      window.removeEventListener("resize", updateContainerSize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Clean up dots
      for (const dot of container.querySelectorAll(".dot")) {
        dot.remove();
      }
    };
  }, [dotSize, dotSpacing, waveRadius, waveIntensity, theme, enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dots will be appended here via JavaScript */}
    </div>
  );
}
