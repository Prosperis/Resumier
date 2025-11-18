import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { Resume } from "@/lib/api/types";

/**
 * Generate and download resume as PDF file
 * Uses jsPDF's text rendering to avoid html2canvas oklch color parsing issues
 */
export async function downloadPDF(resume: Resume): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const {
      personalInfo,
      experience,
      education,
      skills,
      certifications,
      links,
    } = resume.content;

    let yPosition = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to manage page breaks and multiline text
    const addMultilineText = (
      text: string,
      x: number,
      maxWidth: number,
      options: any = {},
    ) => {
      const lines = pdf.splitTextToSize(text, maxWidth);
      const lineHeight = options.maxHeight || 5;

      for (const line of lines) {
        if (yPosition > pageHeight - 10) {
          pdf.addPage();
          yPosition = 15;
        }
        pdf.text(line, x, yPosition, { ...options, maxWidth });
        yPosition += lineHeight;
      }
    };

    // Set default font
    pdf.setFont("helvetica");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    // Name
    if (personalInfo.name) {
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(personalInfo.name, margin, yPosition);
      yPosition += 8;
    }

    // Contact Info
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    const contactParts: string[] = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.location) contactParts.push(personalInfo.location);

    if (contactParts.length > 0) {
      pdf.text(contactParts.join(" | "), margin, yPosition);
      yPosition += 6;
    }

    pdf.setTextColor(0, 0, 0);
    yPosition += 3;

    // Professional Summary
    if (personalInfo.summary) {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("PROFESSIONAL SUMMARY", margin, yPosition);
      yPosition += 5;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      addMultilineText(personalInfo.summary, margin, contentWidth, {
        maxHeight: 4,
      });
      yPosition += 4;
    }

    // Experience
    if (experience.length > 0) {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("EXPERIENCE", margin, yPosition);
      yPosition += 5;

      for (const exp of experience) {
        if (yPosition > pageHeight - 15) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${exp.position} | ${exp.company}`, margin, yPosition);
        yPosition += 4;

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}`,
          margin,
          yPosition,
        );
        yPosition += 4;

        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");

        if (exp.description) {
          addMultilineText(exp.description, margin, contentWidth, {
            maxHeight: 4,
          });
          yPosition += 2;
        }

        if (exp.highlights && exp.highlights.length > 0) {
          for (const highlight of exp.highlights) {
            pdf.setFontSize(9);
            addMultilineText(`• ${highlight}`, margin + 3, contentWidth - 3, {
              maxHeight: 4,
            });
          }
          yPosition += 2;
        }
      }
    }

    // Education
    if (education.length > 0) {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("EDUCATION", margin, yPosition);
      yPosition += 5;

      for (const edu of education) {
        if (yPosition > pageHeight - 12) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${edu.degree} | ${edu.institution}`, margin, yPosition);
        yPosition += 4;

        if (edu.endDate || edu.gpa) {
          const details: string[] = [];
          if (edu.endDate) details.push(edu.endDate);
          if (edu.gpa) details.push(`GPA: ${edu.gpa}`);

          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(100, 100, 100);
          pdf.text(details.join(" | "), margin, yPosition);
          yPosition += 4;
          pdf.setTextColor(0, 0, 0);
        }
      }
    }

    // Skills
    const skillCategories = [
      { name: "Technical", items: skills.technical },
      { name: "Languages", items: skills.languages },
      { name: "Tools", items: skills.tools },
      { name: "Soft Skills", items: skills.soft },
    ].filter((cat) => cat.items.length > 0);

    if (skillCategories.length > 0) {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("SKILLS", margin, yPosition);
      yPosition += 5;

      for (const skillCategory of skillCategories) {
        if (yPosition > pageHeight - 10) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${skillCategory.name}:`, margin, yPosition);

        pdf.setFont("helvetica", "normal");
        yPosition += 4;
        addMultilineText(
          skillCategory.items.join(", "),
          margin + 3,
          contentWidth - 3,
          { maxHeight: 4 },
        );
        yPosition += 2;
      }
    }

    // Certifications
    if (certifications.length > 0) {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("CERTIFICATIONS", margin, yPosition);
      yPosition += 5;

      for (const cert of certifications) {
        if (yPosition > pageHeight - 10) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const certText = `• ${cert.name} - ${cert.issuer}${cert.date ? ` (${cert.date})` : ""}`;
        addMultilineText(certText, margin + 2, contentWidth - 2, {
          maxHeight: 4,
        });
        yPosition += 2;
      }
    }

    // Links
    if (links.length > 0) {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("LINKS", margin, yPosition);
      yPosition += 5;

      for (const link of links) {
        if (yPosition > pageHeight - 10) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const linkText = `• ${link.label}: ${link.url}`;
        addMultilineText(linkText, margin + 2, contentWidth - 2, {
          maxHeight: 4,
        });
        yPosition += 2;
      }
    }

    // Save the PDF
    pdf.save(`${sanitizeFilename(resume.title)}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

/**
 * Alternative PDF export that captures the styled resume template from the DOM
 * This preserves the template design, colors, and formatting
 */
export async function downloadPDFWithTemplate(resume: Resume): Promise<void> {
  try {
    // Find the resume preview element in the DOM
    const resumeElement = document.querySelector(".resume-light-mode");

    if (!resumeElement) {
      throw new Error(
        "Resume preview not found. Please ensure the resume is displayed on the page.",
      );
    }

    // Clone the element to avoid modifying the original
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

    // Create a temporary container off-screen
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = "210mm";
    container.style.background = "#FFFFFF";
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    try {
      // Remove any interactive elements that shouldn't be in PDF
      const interactiveElements = clonedElement.querySelectorAll(
        "button, [role='button'], .no-print, .print\\:hidden, .export-controls, [data-no-print]",
      );
      interactiveElements.forEach((el) => el.remove());

      // Inject comprehensive style override FIRST to convert CSS variables and prevent oklch
      const styleOverride = document.createElement("style");
      styleOverride.id = "pdf-export-oklch-override";
      styleOverride.textContent = `
        /* Override all CSS variables with RGB equivalents */
        .resume-light-mode,
        .resume-light-mode * {
          --background: #ffffff !important;
          --foreground: #252525 !important;
          --card: #ffffff !important;
          --card-foreground: #252525 !important;
          --popover: #ffffff !important;
          --popover-foreground: #252525 !important;
          --primary: #3a3a3a !important;
          --primary-foreground: #fafafa !important;
          --secondary: #f5f5f5 !important;
          --secondary-foreground: #3a3a3a !important;
          --muted: #f5f5f5 !important;
          --muted-foreground: #737373 !important;
          --accent: #f5f5f5 !important;
          --accent-foreground: #3a3a3a !important;
          --destructive: #dc2626 !important;
          --border: #e5e5e5 !important;
          --input: #e5e5e5 !important;
          --ring: #a3a3a3 !important;
        }
      `;
      container.insertBefore(styleOverride, container.firstChild);

      // Fix oklch colors by converting computed styles to inline RGB styles
      const fixOklchColors = (element: HTMLElement) => {
        // Helper to convert any color (including oklch) to RGB
        const colorToRGB = (colorStr: string, isBackground = false): string => {
          if (!colorStr || colorStr === "transparent" || colorStr === "none") {
            return colorStr;
          }

          // If it's already rgb/rgba, return as-is
          if (colorStr.startsWith("rgb")) {
            return colorStr;
          }

          // If it's hex, return as-is
          if (colorStr.startsWith("#")) {
            return colorStr;
          }

          // If it contains oklch, we need to convert it
          const lowerColorStr = colorStr.toLowerCase();
          if (lowerColorStr.includes("oklch")) {
            try {
              // Create a temporary element to get computed RGB value
              const tempEl = document.createElement("div");
              tempEl.style.position = "absolute";
              tempEl.style.visibility = "hidden";
              tempEl.style.top = "-9999px";
              tempEl.style.left = "-9999px";
              
              // Set the color property based on context
              if (isBackground) {
                tempEl.style.backgroundColor = colorStr;
              } else {
                tempEl.style.color = colorStr;
              }
              
              document.body.appendChild(tempEl);
              
              // Force a reflow to ensure styles are computed
              void tempEl.offsetHeight;
              
              const computed = window.getComputedStyle(tempEl);
              const rgbColor = isBackground 
                ? computed.backgroundColor 
                : computed.color;
              
              document.body.removeChild(tempEl);
              
              // If conversion failed or still contains oklch, use fallback
              if (!rgbColor || rgbColor.toLowerCase().includes("oklch") || rgbColor === colorStr) {
                return isBackground ? "#ffffff" : "#000000";
              }
              
              // Ensure it's in rgb format
              if (!rgbColor.startsWith("rgb") && !rgbColor.startsWith("#")) {
                return isBackground ? "#ffffff" : "#000000";
              }
              
              return rgbColor;
            } catch (e) {
              // Fallback based on context
              return isBackground ? "#ffffff" : "#000000";
            }
          }

          // For other color formats, try to convert via computed style
          try {
            const tempEl = document.createElement("div");
            tempEl.style.position = "absolute";
            tempEl.style.visibility = "hidden";
            tempEl.style.top = "-9999px";
            tempEl.style.left = "-9999px";
            
            if (isBackground) {
              tempEl.style.backgroundColor = colorStr;
            } else {
              tempEl.style.color = colorStr;
            }
            
            document.body.appendChild(tempEl);
            void tempEl.offsetHeight; // Force reflow
            
            const computed = window.getComputedStyle(tempEl);
            const rgbColor = isBackground 
              ? computed.backgroundColor 
              : computed.color;
            
            document.body.removeChild(tempEl);
            
            // Only return if it's a valid RGB format
            if (rgbColor && (rgbColor.startsWith("rgb") || rgbColor.startsWith("#"))) {
              return rgbColor;
            }
            
            return colorStr;
          } catch (e) {
            return colorStr;
          }
        };

        // Process all elements including the root
        const allElements = [element, ...Array.from(element.querySelectorAll("*"))];
        
        allElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (!htmlEl || !htmlEl.style) return;

          const computed = window.getComputedStyle(htmlEl);

          // Convert all color-related properties
          const colorProperties = [
            { prop: "backgroundColor", styleProp: "backgroundColor", isBackground: true },
            { prop: "color", styleProp: "color", isBackground: false },
            { prop: "borderColor", styleProp: "borderColor", isBackground: false },
            { prop: "borderTopColor", styleProp: "borderTopColor", isBackground: false },
            { prop: "borderRightColor", styleProp: "borderRightColor", isBackground: false },
            { prop: "borderBottomColor", styleProp: "borderBottomColor", isBackground: false },
            { prop: "borderLeftColor", styleProp: "borderLeftColor", isBackground: false },
            { prop: "outlineColor", styleProp: "outlineColor", isBackground: false },
            { prop: "textDecorationColor", styleProp: "textDecorationColor", isBackground: false },
            { prop: "columnRuleColor", styleProp: "columnRuleColor", isBackground: false },
          ];

          colorProperties.forEach(({ prop, styleProp, isBackground }) => {
            const value = computed.getPropertyValue(prop);
            if (value && value.trim() && value !== "transparent" && value !== "none") {
              // Check if value contains oklch or is a CSS variable
              const lowerValue = value.toLowerCase();
              if (lowerValue.includes("oklch") || lowerValue.includes("var(--")) {
                const safeColor = colorToRGB(value, isBackground);
                if (safeColor && safeColor !== value && !safeColor.toLowerCase().includes("oklch")) {
                  htmlEl.style.setProperty(styleProp, safeColor, "important");
                }
              }
            }
          });

          // Also check for CSS variables in inline styles that might resolve to oklch
          const inlineStyle = htmlEl.getAttribute("style") || "";
          if (inlineStyle.includes("var(--")) {
            // Get all CSS custom properties used in inline styles
            const cssVars = inlineStyle.match(/var\(--[^)]+\)/g);
            if (cssVars) {
              cssVars.forEach((cssVar) => {
                try {
                  // Get computed value of the CSS variable
                  const varName = cssVar.replace(/var\(|\)/g, "").trim();
                  const computedValue = computed.getPropertyValue(varName);
                  
                  if (computedValue && computedValue.toLowerCase().includes("oklch")) {
                    // Determine if this is a background or foreground color
                    const isBg = varName.includes("background") || 
                                varName.includes("card") || 
                                varName.includes("popover") ||
                                varName.includes("muted") ||
                                varName.includes("accent") ||
                                varName.includes("secondary");
                    
                    // Convert and replace in inline style
                    const safeColor = colorToRGB(computedValue, isBg);
                    if (safeColor && !safeColor.toLowerCase().includes("oklch")) {
                      htmlEl.style.cssText = htmlEl.style.cssText.replace(
                        new RegExp(cssVar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
                        safeColor,
                      );
                    }
                  }
                } catch (e) {
                  // Ignore errors in CSS variable processing
                }
              });
            }
          }

          // Copy other important styles including flex properties
          const propertiesToCopy = [
            "fontSize",
            "fontWeight",
            "fontFamily",
            "fontStyle",
            "lineHeight",
            "textAlign",
            "textDecoration",
            "padding",
            "margin",
            "border",
            "borderRadius",
            "display",
            "width",
            "height",
            "maxWidth",
            "minWidth",
            "alignItems",
            "justifyContent",
            "flexDirection",
            "flexWrap",
            "gap",
            "verticalAlign",
            "flexShrink",
            "flex",
          ];

          propertiesToCopy.forEach((prop) => {
            const value = computed.getPropertyValue(prop);
            if (value && value.trim() && value !== "auto") {
              htmlEl.style.setProperty(prop, value, "important");
            }
          });
        });
      };

      fixOklchColors(clonedElement);

      // Wait a bit for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capture the resume element as canvas with html2canvas
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        imageTimeout: 10000,
        windowHeight: clonedElement.scrollHeight,
        windowWidth: 800,
        onclone: (clonedDoc, element) => {
          // Inject style override in cloned document's head
          const head = clonedDoc.head || clonedDoc.createElement("head");
          if (!clonedDoc.head) {
            clonedDoc.documentElement.insertBefore(head, clonedDoc.documentElement.firstChild);
          }
          
          const overrideStyle = clonedDoc.createElement("style");
          overrideStyle.id = "oklch-override-clone";
          overrideStyle.textContent = `
            * {
              --background: #ffffff !important;
              --foreground: #252525 !important;
              --card: #ffffff !important;
              --card-foreground: #252525 !important;
              --popover: #ffffff !important;
              --popover-foreground: #252525 !important;
              --primary: #3a3a3a !important;
              --primary-foreground: #fafafa !important;
              --secondary: #f5f5f5 !important;
              --secondary-foreground: #3a3a3a !important;
              --muted: #f5f5f5 !important;
              --muted-foreground: #737373 !important;
              --accent: #f5f5f5 !important;
              --accent-foreground: #3a3a3a !important;
              --destructive: #dc2626 !important;
              --border: #e5e5e5 !important;
              --input: #e5e5e5 !important;
              --ring: #a3a3a3 !important;
            }
            svg {
              vertical-align: middle !important;
              display: inline-block !important;
            }
            /* Fix flex containers that contain SVG icons */
            [class*="flex"][class*="items-center"] {
              align-items: center !important;
            }
            [class*="flex"][class*="items-center"] svg {
              vertical-align: middle !important;
              align-self: center !important;
            }
          `;
          head.appendChild(overrideStyle);
          
          // Remove or override any stylesheets that might contain oklch
          try {
            const styleSheets = Array.from(clonedDoc.styleSheets);
            styleSheets.forEach((sheet) => {
              try {
                const rules = Array.from(sheet.cssRules || []);
                rules.forEach((rule) => {
                  if (rule instanceof CSSStyleRule) {
                    const style = rule.style;
                    // Convert any oklch colors in the rule
                    for (let i = 0; i < style.length; i++) {
                      const prop = style[i];
                      const value = style.getPropertyValue(prop);
                      if (value && value.toLowerCase().includes("oklch")) {
                        // Fallback immediately - don't try to compute as it may fail
                        const fallback = prop.includes("background") || prop.includes("bg")
                          ? "#ffffff"
                          : "#000000";
                        style.setProperty(prop, fallback, "important");
                      }
                    }
                  }
                });
              } catch (e) {
                // Cross-origin or other access issues, ignore
              }
            });
          } catch (e) {
            // Ignore stylesheet access errors
          }

          // Process all elements in the cloned document
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (!htmlEl || !htmlEl.style) return;

            const computed = clonedDoc.defaultView?.getComputedStyle(htmlEl);
            if (!computed) return;

            // Ensure absolutely positioned elements are visible (for timeline elements)
            const position = computed.getPropertyValue("position");
            if (position === "absolute") {
              const visibility = computed.getPropertyValue("visibility");
              const display = computed.getPropertyValue("display");
              if (visibility === "hidden" || display === "none") {
                htmlEl.style.setProperty("visibility", "visible", "important");
                htmlEl.style.setProperty("display", "block", "important");
              }
              // Ensure z-index is set for proper layering
              const zIndex = computed.getPropertyValue("z-index");
              if (!zIndex || zIndex === "auto") {
                htmlEl.style.setProperty("z-index", "1", "important");
              }
            }

            // Fix flex containers to ensure proper alignment
            const display = computed.getPropertyValue("display");
            if (display === "flex" || display === "inline-flex") {
              const alignItems = computed.getPropertyValue("align-items");
              // Force center alignment for flex containers to prevent shifting
              if (!alignItems || alignItems === "normal" || alignItems === "stretch") {
                htmlEl.style.setProperty("align-items", "center", "important");
              }
              // Ensure flex items align properly
              htmlEl.style.setProperty("align-items", "center", "important");
            }

            // Fix SVG icon alignment - html2canvas has issues with SVG alignment
            if (htmlEl.tagName === "svg") {
              const svgEl = htmlEl as SVGElement;
              svgEl.style.setProperty("vertical-align", "middle", "important");
              svgEl.style.setProperty("display", "inline-block", "important");
              // Ensure parent container aligns properly
              if (htmlEl.parentElement) {
                const parentComputed = clonedDoc.defaultView?.getComputedStyle(htmlEl.parentElement);
                if (parentComputed) {
                  const parentDisplay = parentComputed.getPropertyValue("display");
                  if (parentDisplay === "flex" || parentDisplay === "inline-flex") {
                    htmlEl.parentElement.style.setProperty("align-items", "center", "important");
                  }
                }
              }
            }

            // Fix elements containing SVG (like icon wrappers)
            if (htmlEl.querySelector("svg")) {
              const svg = htmlEl.querySelector("svg") as SVGElement;
              if (svg) {
                svg.style.setProperty("vertical-align", "middle", "important");
                svg.style.setProperty("display", "inline-block", "important");
                // Match line-height with parent or siblings
                const parentLineHeight = computed.getPropertyValue("line-height");
                if (parentLineHeight && parentLineHeight !== "normal") {
                  svg.style.setProperty("line-height", parentLineHeight, "important");
                }
                // Ensure the wrapper aligns properly
                if (display === "flex" || display === "inline-flex") {
                  htmlEl.style.setProperty("align-items", "center", "important");
                  // Ensure all children have matching line-height
                  const children = Array.from(htmlEl.children);
                  children.forEach((child) => {
                    const childEl = child as HTMLElement;
                    if (childEl.style) {
                      const childLineHeight = clonedDoc.defaultView?.getComputedStyle(childEl).getPropertyValue("line-height");
                      if (!childLineHeight || childLineHeight === "normal") {
                        const computedLineHeight = computed.getPropertyValue("line-height");
                        if (computedLineHeight && computedLineHeight !== "normal") {
                          childEl.style.setProperty("line-height", computedLineHeight, "important");
                        }
                      }
                    }
                  });
                }
              }
            }

            // Convert all color properties
            const colorProps = [
              "backgroundColor",
              "color",
              "borderColor",
              "borderTopColor",
              "borderRightColor",
              "borderBottomColor",
              "borderLeftColor",
              "outlineColor",
            ];

            colorProps.forEach((prop) => {
              const value = computed.getPropertyValue(prop);
              if (value && value.toLowerCase().includes("oklch")) {
                // Use fallback
                const fallback =
                  prop.includes("background") || prop.includes("bg")
                    ? "#ffffff"
                    : "#000000";
                htmlEl.style.setProperty(prop, fallback, "important");
              }
            });
          });
        },
      });

      // Create PDF from canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
      );
      heightLeft -= 297; // A4 height in mm

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
        );
        heightLeft -= 297;
      }

      // Save the PDF
      pdf.save(`${sanitizeFilename(resume.title)}.pdf`);
    } finally {
      // Clean up temporary container
      document.body.removeChild(container);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

/**
 * Print the resume using browser's print dialog
 * This creates a PDF through the browser's print-to-PDF functionality
 */
export function printResume(resumeTitle: string) {
  // Set page title for PDF filename suggestion
  const originalTitle = document.title;
  document.title = resumeTitle;

  // Trigger print dialog
  window.print();

  // Restore original title after print
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}

/**
 * Open print preview
 */
export function openPrintPreview() {
  window.print();
}

/**
 * Download resume as HTML file with embedded styles
 */
export function downloadHTML(resume: Resume, htmlContent: string) {
  // Add complete HTML structure with styles
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { font-size: 28px; margin-bottom: 10px; color: #2563eb; }
    h2 { font-size: 20px; margin-top: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
    h3 { font-size: 16px; margin: 10px 0 5px; }
    .contact-info { margin-bottom: 20px; color: #666; }
    .section { margin-bottom: 25px; }
    .job, .education-item { margin-bottom: 15px; }
    .date { color: #666; font-style: italic; }
    ul { margin: 5px 0; padding-left: 20px; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
  saveAs(blob, `${sanitizeFilename(resume.title)}.html`);
}

/**
 * Download resume as DOCX (Microsoft Word) file
 */
export async function downloadDOCX(resume: Resume): Promise<void> {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  const sections: Paragraph[] = [];

  // Name (Title)
  if (personalInfo.name) {
    sections.push(
      new Paragraph({
        text: personalInfo.name,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    );
  }

  // Contact Information
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);

  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        text: contactParts.join(" | "),
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
    );
  }

  // Professional Summary
  if (personalInfo.summary) {
    sections.push(
      new Paragraph({
        text: "PROFESSIONAL SUMMARY",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    );
    sections.push(
      new Paragraph({
        text: personalInfo.summary,
        spacing: { after: 300 },
      }),
    );
  }

  // Experience
  if (experience.length > 0) {
    sections.push(
      new Paragraph({
        text: "EXPERIENCE",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    );

    for (const exp of experience) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true }),
            new TextRun({ text: ` | ${exp.company}` }),
          ],
          spacing: { after: 100 },
        }),
      );

      const dateRange = `${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}`;
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: dateRange, italics: true })],
          spacing: { after: 100 },
        }),
      );

      if (exp.description) {
        sections.push(
          new Paragraph({
            text: exp.description,
            spacing: { after: 100 },
          }),
        );
      }

      if (exp.highlights && exp.highlights.length > 0) {
        for (const highlight of exp.highlights) {
          sections.push(
            new Paragraph({
              text: highlight,
              bullet: { level: 0 },
              spacing: { after: 50 },
            }),
          );
        }
      }

      sections.push(new Paragraph({ text: "", spacing: { after: 200 } }));
    }
  }

  // Education
  if (education.length > 0) {
    sections.push(
      new Paragraph({
        text: "EDUCATION",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    );

    for (const edu of education) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            new TextRun({ text: ` | ${edu.institution}` }),
          ],
          spacing: { after: 100 },
        }),
      );

      if (edu.endDate) {
        sections.push(
          new Paragraph({
            children: [new TextRun({ text: edu.endDate, italics: true })],
            spacing: { after: 100 },
          }),
        );
      }

      if (edu.gpa) {
        sections.push(
          new Paragraph({
            text: `GPA: ${edu.gpa}`,
            spacing: { after: 200 },
          }),
        );
      }
    }
  }

  // Skills
  const skillCategories = [
    { name: "Technical", items: skills.technical },
    { name: "Languages", items: skills.languages },
    { name: "Tools", items: skills.tools },
    { name: "Soft Skills", items: skills.soft },
  ].filter((cat) => cat.items.length > 0);

  if (skillCategories.length > 0) {
    sections.push(
      new Paragraph({
        text: "SKILLS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    );

    for (const skillCategory of skillCategories) {
      const skillText = `${skillCategory.name}: ${skillCategory.items.join(", ")}`;
      sections.push(
        new Paragraph({
          text: skillText,
          spacing: { after: 100 },
        }),
      );
    }
  }

  // Certifications
  if (certifications.length > 0) {
    sections.push(
      new Paragraph({
        text: "CERTIFICATIONS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    );

    for (const cert of certifications) {
      const certText = `${cert.name} - ${cert.issuer}${cert.date ? ` (${cert.date})` : ""}`;
      sections.push(
        new Paragraph({
          text: certText,
          spacing: { after: 100 },
        }),
      );
    }
  }

  // Links
  if (links.length > 0) {
    sections.push(
      new Paragraph({
        text: "LINKS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    );

    for (const link of links) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${link.label}: ` }),
            new TextRun({
              text: link.url,
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 100 },
        }),
      );
    }
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${sanitizeFilename(resume.title)}.docx`);
}

/**
 * Download resume as Markdown file
 */
export function downloadMarkdown(resume: Resume): void {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  let markdown = "";

  // Name
  if (personalInfo.name) {
    markdown += `# ${personalInfo.name}\n\n`;
  }

  // Contact Info
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(`📧 ${personalInfo.email}`);
  if (personalInfo.phone) contactParts.push(`📞 ${personalInfo.phone}`);
  if (personalInfo.location) contactParts.push(`📍 ${personalInfo.location}`);

  if (contactParts.length > 0) {
    markdown += `${contactParts.join(" | ")}\n\n`;
  }

  // Separator
  markdown += "---\n\n";

  // Professional Summary
  if (personalInfo.summary) {
    markdown += `## Professional Summary\n\n${personalInfo.summary}\n\n`;
  }

  // Experience
  if (experience.length > 0) {
    markdown += "## Experience\n\n";
    for (const exp of experience) {
      markdown += `### ${exp.position}\n`;
      markdown += `**${exp.company}** | ${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}\n\n`;
      if (exp.description) {
        markdown += `${exp.description}\n\n`;
      }
      if (exp.highlights && exp.highlights.length > 0) {
        for (const highlight of exp.highlights) {
          markdown += `- ${highlight}\n`;
        }
        markdown += "\n";
      }
    }
  }

  // Education
  if (education.length > 0) {
    markdown += "## Education\n\n";
    for (const edu of education) {
      markdown += `### ${edu.degree}\n`;
      markdown += `**${edu.institution}**`;
      if (edu.endDate) markdown += ` | ${edu.endDate}`;
      if (edu.gpa) markdown += ` | GPA: ${edu.gpa}`;
      markdown += "\n\n";
    }
  }

  // Skills
  const skillCategories = [
    { name: "Technical", items: skills.technical },
    { name: "Languages", items: skills.languages },
    { name: "Tools", items: skills.tools },
    { name: "Soft Skills", items: skills.soft },
  ].filter((cat) => cat.items.length > 0);

  if (skillCategories.length > 0) {
    markdown += "## Skills\n\n";
    for (const skillCategory of skillCategories) {
      markdown += `**${skillCategory.name}:** ${skillCategory.items.join(", ")}\n\n`;
    }
  }

  // Certifications
  if (certifications.length > 0) {
    markdown += "## Certifications\n\n";
    for (const cert of certifications) {
      markdown += `- ${cert.name} - ${cert.issuer}`;
      if (cert.date) markdown += ` (${cert.date})`;
      markdown += "\n";
    }
    markdown += "\n";
  }

  // Links
  if (links.length > 0) {
    markdown += "## Links\n\n";
    for (const link of links) {
      markdown += `- [${link.label}](${link.url})\n`;
    }
  }

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  saveAs(blob, `${sanitizeFilename(resume.title)}.md`);
}

/**
 * Download resume as plain text file
 */
export function downloadPlainText(resume: Resume): void {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  let text = "";

  // Name
  if (personalInfo.name) {
    text += `${personalInfo.name}\n`;
    text += `${"=".repeat(personalInfo.name.length)}\n\n`;
  }

  // Contact Info
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);

  if (contactParts.length > 0) {
    text += `${contactParts.join(" | ")}\n\n`;
  }

  // Professional Summary
  if (personalInfo.summary) {
    text += "PROFESSIONAL SUMMARY\n";
    text += `${"-".repeat(20)}\n`;
    text += `${personalInfo.summary}\n\n`;
  }

  // Experience
  if (experience.length > 0) {
    text += "EXPERIENCE\n";
    text += `${"-".repeat(20)}\n`;
    for (const exp of experience) {
      text += `${exp.position}\n`;
      text += `${exp.company} | ${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}\n`;
      if (exp.description) {
        text += `${exp.description}\n`;
      }
      if (exp.highlights && exp.highlights.length > 0) {
        for (const highlight of exp.highlights) {
          text += `  • ${highlight}\n`;
        }
      }
      text += "\n";
    }
  }

  // Education
  if (education.length > 0) {
    text += "EDUCATION\n";
    text += `${"-".repeat(20)}\n`;
    for (const edu of education) {
      text += `${edu.degree}\n`;
      text += `${edu.institution}`;
      if (edu.endDate) text += ` | ${edu.endDate}`;
      if (edu.gpa) text += ` | GPA: ${edu.gpa}`;
      text += "\n\n";
    }
  }

  // Skills
  const skillCategories = [
    { name: "Technical", items: skills.technical },
    { name: "Languages", items: skills.languages },
    { name: "Tools", items: skills.tools },
    { name: "Soft Skills", items: skills.soft },
  ].filter((cat) => cat.items.length > 0);

  if (skillCategories.length > 0) {
    text += "SKILLS\n";
    text += `${"-".repeat(20)}\n`;
    for (const skillCategory of skillCategories) {
      text += `${skillCategory.name}: ${skillCategory.items.join(", ")}\n`;
    }
    text += "\n";
  }

  // Certifications
  if (certifications.length > 0) {
    text += "CERTIFICATIONS\n";
    text += `${"-".repeat(20)}\n`;
    for (const cert of certifications) {
      text += `• ${cert.name} - ${cert.issuer}`;
      if (cert.date) text += ` (${cert.date})`;
      text += "\n";
    }
    text += "\n";
  }

  // Links
  if (links.length > 0) {
    text += "LINKS\n";
    text += `${"-".repeat(20)}\n`;
    for (const link of links) {
      text += `${link.label}: ${link.url}\n`;
    }
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `${sanitizeFilename(resume.title)}.txt`);
}

/**
 * Download resume as JSON file
 */
export function downloadJSON(resume: Resume): void {
  const jsonString = JSON.stringify(resume, null, 2);
  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8",
  });
  saveAs(blob, `${sanitizeFilename(resume.title)}.json`);
}

/**
 * Sanitize filename by removing invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9_-]/gi, "_").replace(/_{2,}/g, "_");
}

/**
 * Copy resume content to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Format date for resume display
 */
export function formatResumeDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
