import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { Resume, SkillWithLevel } from "@/lib/api/types";
import { getFullName } from "@/lib/validations";
import { useSettingsStore } from "@/stores/settings-store";

// Helper to get skill name from string or SkillWithLevel
function getSkillName(skill: string | SkillWithLevel): string {
  return typeof skill === "string" ? skill : skill.name;
}

/**
 * Helper function to prepare a cloned resume element for export
 * Removes interactive elements and prepares for rendering
 */
function prepareResumeElementForExport(): HTMLElement | null {
  const resumeElement = document.querySelector(".resume-light-mode");
  if (!resumeElement) {
    return null;
  }

  // Clone the element
  const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

  // Remove interactive elements
  const interactiveElements = clonedElement.querySelectorAll(
    "button, [role='button'], .no-print, .print\\:hidden, .export-controls, [data-no-print]",
  );
  interactiveElements.forEach((el) => el.remove());

  return clonedElement;
}

/**
 * Comprehensive list of CSS properties to inline for export
 * This ensures all visual styles are preserved
 */
const INLINE_STYLE_PROPERTIES = [
  // Colors and backgrounds
  "color",
  "backgroundColor",
  "background",
  "backgroundImage",
  "backgroundPosition",
  "backgroundSize",
  "backgroundRepeat",
  "opacity",
  // Typography
  "fontSize",
  "fontFamily",
  "fontWeight",
  "fontStyle",
  "fontVariant",
  "textAlign",
  "textDecoration",
  "textTransform",
  "letterSpacing",
  "lineHeight",
  "wordSpacing",
  "whiteSpace",
  "textIndent",
  // Box model
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  // Borders
  "border",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
  "borderWidth",
  "borderStyle",
  "borderColor",
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  // Layout
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "float",
  "clear",
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
  "overflow",
  "overflowX",
  "overflowY",
  // Flexbox
  "flexDirection",
  "flexWrap",
  "justifyContent",
  "alignItems",
  "alignContent",
  "alignSelf",
  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "gap",
  "rowGap",
  "columnGap",
  // Grid
  "gridTemplateColumns",
  "gridTemplateRows",
  "gridColumn",
  "gridRow",
  "gridGap",
  // Visual
  "boxShadow",
  "textShadow",
  "verticalAlign",
  "visibility",
  "zIndex",
  // List styles
  "listStyle",
  "listStyleType",
  "listStylePosition",
];

/**
 * Convert an RGB/RGBA color string to hex
 */
function rgbToHex(rgb: string): string {
  if (!rgb || rgb === "transparent" || rgb === "none") return rgb;
  if (rgb.startsWith("#")) return rgb;

  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  return rgb;
}

/**
 * Helper function to get rendered template HTML from the DOM
 * This captures the actual template with all its styling and formatting
 */
function getRenderedTemplateHTML(): string | null {
  const clonedElement = prepareResumeElementForExport();
  if (!clonedElement) {
    return null;
  }

  // Convert computed styles to inline styles for portability
  const allElements = [
    clonedElement,
    ...Array.from(clonedElement.querySelectorAll("*")),
  ];

  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (!htmlEl || !htmlEl.style) return;

    const computed = window.getComputedStyle(htmlEl);

    // Apply all important computed styles as inline styles
    INLINE_STYLE_PROPERTIES.forEach((prop) => {
      try {
        const camelProp = prop as keyof CSSStyleDeclaration;
        let value = computed[camelProp] as string;

        if (
          value &&
          value !== "none" &&
          value !== "normal" &&
          value !== "auto" &&
          value !== "0px" &&
          value !== "0" &&
          value !== "transparent"
        ) {
          // Convert RGB colors to hex for better compatibility
          if (
            prop.toLowerCase().includes("color") ||
            prop.toLowerCase().includes("background")
          ) {
            value = rgbToHex(value);
          }
          (htmlEl.style as any)[camelProp] = value;
        }
      } catch {
        // Some properties may not be settable, skip them
      }
    });

    // Special handling for SVG elements (Lucide icons)
    if (htmlEl.tagName === "svg" || htmlEl.tagName.toLowerCase() === "svg") {
      const width = computed.width;
      const height = computed.height;
      if (width && width !== "auto" && width !== "0px") {
        htmlEl.style.width = width;
        htmlEl.setAttribute("width", width);
      }
      if (height && height !== "auto" && height !== "0px") {
        htmlEl.style.height = height;
        htmlEl.setAttribute("height", height);
      }

      // Preserve viewBox
      if (htmlEl.hasAttribute("viewBox")) {
        const viewBox = htmlEl.getAttribute("viewBox");
        if (viewBox) htmlEl.setAttribute("viewBox", viewBox);
      }

      // Ensure stroke and fill are preserved with actual color values
      const stroke = computed.stroke;
      const fill = computed.fill;
      const strokeWidth = computed.strokeWidth;

      if (stroke && stroke !== "none") {
        const strokeColor = rgbToHex(stroke);
        htmlEl.style.stroke = strokeColor;
        htmlEl.setAttribute("stroke", strokeColor);
      }
      if (fill && fill !== "none") {
        const fillColor = rgbToHex(fill);
        htmlEl.style.fill = fillColor;
        htmlEl.setAttribute("fill", fillColor);
      }
      if (strokeWidth && strokeWidth !== "0") {
        htmlEl.style.strokeWidth = strokeWidth;
        htmlEl.setAttribute("stroke-width", strokeWidth);
      }
      if (computed.strokeLinecap) {
        htmlEl.setAttribute("stroke-linecap", computed.strokeLinecap);
      }
      if (computed.strokeLinejoin) {
        htmlEl.setAttribute("stroke-linejoin", computed.strokeLinejoin);
      }
    }

    // Handle path and line elements inside SVGs
    if (
      htmlEl.tagName === "path" ||
      htmlEl.tagName === "line" ||
      htmlEl.tagName === "circle" ||
      htmlEl.tagName === "rect" ||
      htmlEl.tagName === "polyline" ||
      htmlEl.tagName === "polygon"
    ) {
      const stroke = computed.stroke;
      const fill = computed.fill;

      if (stroke && stroke !== "none") {
        htmlEl.setAttribute("stroke", rgbToHex(stroke));
      }
      if (fill && fill !== "none") {
        htmlEl.setAttribute("fill", rgbToHex(fill));
      }
    }
  });

  return clonedElement.innerHTML;
}


/**
 * Escape LaTeX special characters
 */
function escapeLaTeX(text: string): string {
  if (!text) return "";

  const specialChars: Record<string, string> = {
    "\\": "\\textbackslash{}",
    "{": "\\{",
    "}": "\\}",
    $: "\\$",
    "&": "\\&",
    "%": "\\%",
    "#": "\\#",
    "^": "\\textasciicircum{}",
    _: "\\_",
    "~": "\\textasciitilde{}",
  };

  return text
    .split("")
    .map((char) => specialChars[char] || char)
    .join("");
}

/**
 * Generate and download resume as LaTeX file
 * Creates a professional LaTeX document that can be compiled to PDF
 */
export function downloadLaTeX(resume: Resume): void {
  try {
    const {
      personalInfo,
      experience,
      education,
      skills,
      certifications,
      links,
    } = resume.content;

    let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{hyperref}

% Configure hyperlinks
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue,
    citecolor=black
}

% Remove page numbers
\\pagestyle{empty}

% Section formatting
\\titleformat{\\section}
  {\\Large\\bfseries\\uppercase}
  {}
  {0em}
  {}
  [\\titlerule[0.5pt]]

\\titlespacing*{\\section}{0pt}{12pt}{6pt}

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in, labelsep=0.05in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

% Document begins
\\begin{document}

% Header
\\begin{center}
    {\\Huge\\bfseries ${escapeLaTeX(getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder))}}\\\\[0.5cm]
    \\small
    ${personalInfo.email ? escapeLaTeX(personalInfo.email) : ""}${personalInfo.email && personalInfo.phone ? " \\quad $|$ \\quad " : ""}${personalInfo.phone ? escapeLaTeX(personalInfo.phone) : ""}${(personalInfo.email || personalInfo.phone) && personalInfo.location ? " \\quad $|$ \\quad " : ""}${personalInfo.location ? escapeLaTeX(personalInfo.location) : ""}\\\\[0.3cm]
\\end{center}

`;

    // Professional Summary
    if (personalInfo.summary) {
      latex += `\\section{Professional Summary}
${escapeLaTeX(personalInfo.summary)}

`;
    }

    // Experience
    if (experience.length > 0) {
      latex += `\\section{Experience}

`;
      for (const exp of experience) {
        const dateRange = `${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}`;
        latex += `\\textbf{${escapeLaTeX(exp.position)}} \\hfill \\textit{${escapeLaTeX(dateRange)}}\\\\
\\textit{${escapeLaTeX(exp.company)}}\\\\[0.1cm]
`;

        if (exp.description) {
          latex += `${escapeLaTeX(exp.description)}\\\\[0.1cm]
`;
        }

        if (exp.highlights && exp.highlights.length > 0) {
          latex += `\\resumeItemListStart
`;
          for (const highlight of exp.highlights) {
            latex += `\\resumeItem{${escapeLaTeX(highlight)}}
`;
          }
          latex += `\\resumeItemListEnd
`;
        }
        latex += `\\vspace{0.2cm}

`;
      }
    }

    // Education
    if (education.length > 0) {
      latex += `\\section{Education}

`;
      for (const edu of education) {
        const dateInfo = edu.endDate || (edu.current ? "Present" : "");
        latex += `\\textbf{${escapeLaTeX(edu.degree)}}${edu.field ? ` in ${escapeLaTeX(edu.field)}` : ""} \\hfill \\textit{${escapeLaTeX(dateInfo)}}\\\\
\\textit{${escapeLaTeX(edu.institution)}}`;

        if (edu.gpa) {
          latex += ` \\quad GPA: ${escapeLaTeX(edu.gpa)}`;
        }

        if (edu.honors && edu.honors.length > 0) {
          latex += ` \\quad Honors: ${edu.honors.map((h) => escapeLaTeX(h)).join(", ")}`;
        }

        latex += `\\vspace{0.1cm}

`;
      }
    }

    // Skills
    const skillCategories = [
      { name: "Technical Skills", items: skills.technical.map(getSkillName) },
      { name: "Languages", items: skills.languages.map(getSkillName) },
      { name: "Tools", items: skills.tools.map(getSkillName) },
      { name: "Soft Skills", items: skills.soft.map(getSkillName) },
    ].filter((cat) => cat.items.length > 0);

    if (skillCategories.length > 0) {
      latex += `\\section{Skills}

`;
      for (const skillCategory of skillCategories) {
        latex += `\\textbf{${escapeLaTeX(skillCategory.name)}:} ${skillCategory.items.map((s) => escapeLaTeX(s)).join(", ")}\\\\[0.1cm]
`;
      }
      latex += `
`;
    }

    // Certifications
    if (certifications.length > 0) {
      latex += `\\section{Certifications}

`;
      for (const cert of certifications) {
        latex += `\\textbf{${escapeLaTeX(cert.name)}}`;
        if (cert.issuer) {
          latex += ` - ${escapeLaTeX(cert.issuer)}`;
        }
        if (cert.date) {
          latex += ` (${escapeLaTeX(cert.date)})`;
        }
        if (cert.credentialId) {
          latex += ` \\quad Credential ID: ${escapeLaTeX(cert.credentialId)}`;
        }
        if (cert.url) {
          latex += ` \\quad \\href{${cert.url}}{Link}`;
        }
        latex += `\\vspace{0.1cm}

`;
      }
    }

    // Links
    if (links.length > 0) {
      latex += `\\section{Links}

`;
      for (const link of links) {
        latex += `\\href{${link.url}}{${escapeLaTeX(link.label)}}`;
        if (link.type) {
          latex += ` \\quad (${escapeLaTeX(link.type)})`;
        }
        latex += `\\vspace{0.1cm}

`;
      }
    }

    latex += `\\end{document}
`;

    // Save the LaTeX file with filename prompt
    const filename = getFinalFilename(resume, "tex");
    if (filename) {
      const blob = new Blob([latex], { type: "text/plain;charset=utf-8" });
      saveAs(blob, filename);
    }
  } catch (error) {
    console.error("Error generating LaTeX:", error);
    throw new Error("Failed to generate LaTeX. Please try again.");
  }
}

/**
 * Generate PDF from rendered template using html2canvas and jsPDF
 * This preserves the exact visual appearance of the rendered template
 * Provides direct PDF download without needing print dialog
 */
export async function generatePDFFromRenderedTemplate(
  resume: Resume,
): Promise<void> {
  // Wait a bit for DOM to be ready
  await new Promise((resolve) => setTimeout(resolve, 100));

  const resumeElement = document.querySelector(
    ".resume-light-mode",
  ) as HTMLElement;
  if (!resumeElement) {
    throw new Error(
      "Resume preview not found. Please ensure you're viewing the resume preview before exporting.",
    );
  }

  // A4 dimensions in pixels at 96 DPI
  const A4_WIDTH_PX = 794; // 210mm at 96 DPI

  // Prepare element for export
  const clonedElement = prepareResumeElementForExport();
  if (!clonedElement) {
    throw new Error("Failed to prepare resume element for export.");
  }

  // Temporarily add to DOM for rendering (hidden but visible to html2canvas)
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = `${A4_WIDTH_PX}px`;
  container.style.backgroundColor = "#ffffff";
  container.style.overflow = "visible";

  // Style the cloned element for proper rendering
  clonedElement.style.width = `${A4_WIDTH_PX}px`;
  clonedElement.style.maxWidth = `${A4_WIDTH_PX}px`;
  clonedElement.style.backgroundColor = "#ffffff";
  clonedElement.style.overflow = "visible";

  container.appendChild(clonedElement);
  document.body.appendChild(container);

  // Wait for fonts and images to load
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // Convert to canvas with high quality settings
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // 2x for better quality (effective 192 DPI)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
      onclone: (clonedDoc) => {
        // Ensure all styles are applied in the cloned document
        const clonedResume = clonedDoc.querySelector(
          ".resume-light-mode",
        ) as HTMLElement;
        if (clonedResume) {
          clonedResume.style.width = `${A4_WIDTH_PX}px`;
          clonedResume.style.backgroundColor = "#ffffff";
        }
      },
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Failed to capture resume content. Canvas is empty.");
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Get high quality image data
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    if (!imgData || imgData === "data:,") {
      throw new Error("Failed to convert canvas to image.");
    }

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Handle multi-page PDFs properly
    let heightLeft = imgHeight;
    let pageNum = 0;

    while (heightLeft > 0) {
      if (pageNum > 0) {
        pdf.addPage();
      }

      // Calculate the portion of the image to show on this page
      const yOffset = pageNum * pageHeight;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        -yOffset,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
      );

      heightLeft -= pageHeight;
      pageNum++;

      // Safety limit - prevent infinite loops
      if (pageNum > 10) break;
    }

    // Save PDF with filename prompt
    const filename = getFinalFilename(resume, "pdf");
    if (filename) {
      pdf.save(filename);
    }
  } catch (error) {
    console.error("Error in PDF generation:", error);
    throw error;
  } finally {
    // Clean up
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Download PDF directly using html2canvas (no print dialog required)
 * This is the preferred method for direct PDF download
 */
export async function downloadPDFDirect(resume: Resume): Promise<void> {
  return generatePDFFromRenderedTemplate(resume);
}

/**
 * Generate LaTeX code from resume data
 * This creates LaTeX that matches the resume structure
 * @internal Reserved for future use
 */
export function generateLaTeXCode(resume: Resume): string {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  let latex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{hyperref}

% Configure hyperlinks
\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue,
    citecolor=black
}

% Remove page numbers
\\pagestyle{empty}

% Section formatting
\\titleformat{\\section}
  {\\Large\\bfseries\\uppercase}
  {}
  {0em}
  {}
  [\\titlerule[0.5pt]]

\\titlespacing*{\\section}{0pt}{12pt}{6pt}

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in, labelsep=0.05in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

% Document begins
\\begin{document}

% Header
\\begin{center}
    {\\Huge\\bfseries ${escapeLaTeX(getFullName(personalInfo.firstName, personalInfo.lastName, personalInfo.nameOrder))}}\\\\[0.5cm]
    \\small
    ${personalInfo.email ? escapeLaTeX(personalInfo.email) : ""}${personalInfo.email && personalInfo.phone ? " \\quad $|$ \\quad " : ""}${personalInfo.phone ? escapeLaTeX(personalInfo.phone) : ""}${(personalInfo.email || personalInfo.phone) && personalInfo.location ? " \\quad $|$ \\quad " : ""}${personalInfo.location ? escapeLaTeX(personalInfo.location) : ""}\\\\[0.3cm]
\\end{center}

`;

  // Professional Summary
  if (personalInfo.summary) {
    latex += `\\section{Professional Summary}
${escapeLaTeX(personalInfo.summary)}

`;
  }

  // Experience
  if (experience.length > 0) {
    latex += `\\section{Experience}

`;
    for (const exp of experience) {
      const dateRange = `${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}`;
      latex += `\\textbf{${escapeLaTeX(exp.position)}} \\hfill \\textit{${escapeLaTeX(dateRange)}}\\\\
\\textit{${escapeLaTeX(exp.company)}}\\\\[0.1cm]
`;

      if (exp.description) {
        latex += `${escapeLaTeX(exp.description)}\\\\[0.1cm]
`;
      }

      if (exp.highlights && exp.highlights.length > 0) {
        latex += `\\resumeItemListStart
`;
        for (const highlight of exp.highlights) {
          latex += `\\resumeItem{${escapeLaTeX(highlight)}}
`;
        }
        latex += `\\resumeItemListEnd
`;
      }
      latex += `\\vspace{0.2cm}

`;
    }
  }

  // Education
  if (education.length > 0) {
    latex += `\\section{Education}

`;
    for (const edu of education) {
      const dateInfo = edu.endDate || (edu.current ? "Present" : "");
      latex += `\\textbf{${escapeLaTeX(edu.degree)}}${edu.field ? ` in ${escapeLaTeX(edu.field)}` : ""} \\hfill \\textit{${escapeLaTeX(dateInfo)}}\\\\
\\textit{${escapeLaTeX(edu.institution)}}`;

      if (edu.gpa) {
        latex += ` \\quad GPA: ${escapeLaTeX(edu.gpa)}`;
      }

      if (edu.honors && edu.honors.length > 0) {
        latex += ` \\quad Honors: ${edu.honors.map((h) => escapeLaTeX(h)).join(", ")}`;
      }

      latex += `\\vspace{0.1cm}

`;
    }
  }

  // Skills
  const skillCategories = [
    { name: "Technical Skills", items: skills.technical.map(getSkillName) },
    { name: "Languages", items: skills.languages.map(getSkillName) },
    { name: "Tools", items: skills.tools.map(getSkillName) },
    { name: "Soft Skills", items: skills.soft.map(getSkillName) },
  ].filter((cat) => cat.items.length > 0);

  if (skillCategories.length > 0) {
    latex += `\\section{Skills}

`;
    for (const skillCategory of skillCategories) {
      latex += `\\textbf{${escapeLaTeX(skillCategory.name)}:} ${skillCategory.items.map((s) => escapeLaTeX(s)).join(", ")}\\\\[0.1cm]
`;
    }
    latex += `
`;
  }

  // Certifications
  if (certifications.length > 0) {
    latex += `\\section{Certifications}

`;
    for (const cert of certifications) {
      latex += `\\textbf{${escapeLaTeX(cert.name)}}`;
      if (cert.issuer) {
        latex += ` - ${escapeLaTeX(cert.issuer)}`;
      }
      if (cert.date) {
        latex += ` (${escapeLaTeX(cert.date)})`;
      }
      if (cert.credentialId) {
        latex += ` \\quad Credential ID: ${escapeLaTeX(cert.credentialId)}`;
      }
      if (cert.url) {
        latex += ` \\quad \\href{${cert.url}}{Link}`;
      }
      latex += `\\vspace{0.1cm}

`;
    }
  }

  // Links
  if (links.length > 0) {
    latex += `\\section{Links}

`;
    for (const link of links) {
      latex += `\\href{${link.url}}{${escapeLaTeX(link.label)}}`;
      if (link.type) {
        latex += ` \\quad (${escapeLaTeX(link.type)})`;
      }
      latex += `\\vspace{0.1cm}

`;
    }
  }

  latex += `\\end{document}
`;

  return latex;
}

/**
 * Compile LaTeX code to PDF using LaTeX.Online API
 * Note: This may fail due to CORS restrictions. Falls back to html2canvas method.
 * @internal Reserved for future use
 */
export async function compileLaTeXToPDF(latexCode: string): Promise<Blob> {
  // Try LaTeX.Online API with CORS proxy or direct call
  try {
    const response = await fetch("https://latexonline.cc/compile", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: latexCode,
    });

    if (!response.ok) {
      await response.text().catch(() => "Unknown error");
      throw new Error(
        `LaTeX compilation failed: ${response.status} ${response.statusText}`,
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/pdf")) {
      await response.text().catch(() => "");
      throw new Error(`Expected PDF but got ${contentType}`);
    }

    return await response.blob();
  } catch (error) {
    // If it's a network/CORS error, throw a specific error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("CORS_ERROR: LaTeX compilation service unavailable");
    }
    throw error;
  }
}

/**
 * Export PDF using browser's native print-to-PDF functionality
 * This is the most reliable way to preserve styles in a web app
 * All modern browsers support "Save as PDF" in the print dialog
 */
export async function downloadPDFWithTemplate(resume: Resume): Promise<void> {
  // Generate filename with prompt if enabled
  const settings = useSettingsStore.getState().settings;
  let suggestedFilename: string;

  if (settings.promptExportFilename) {
    const filename = getFinalFilename(resume, "pdf");
    if (!filename) {
      // User cancelled, don't open print dialog
      return;
    }
    // Remove extension for document title
    suggestedFilename = filename.replace(/\.pdf$/i, "");
  } else {
    suggestedFilename = generateDefaultFilename(resume, "pdf").replace(
      /\.pdf$/i,
      "",
    );
  }

  // Set page title for PDF filename suggestion
  const originalTitle = document.title;
  document.title = suggestedFilename;

  // Add print-optimized class to resume
  const resumeElement = document.querySelector(".resume-light-mode");
  if (resumeElement) {
    resumeElement.classList.add("print-optimized");
  }

  // Trigger print dialog
  // User can save as PDF using browser's built-in functionality
  window.print();

  // Restore original title after print
  setTimeout(() => {
    document.title = originalTitle;
    if (resumeElement) {
      resumeElement.classList.remove("print-optimized");
    }
  }, 1000);
}

/**
 * Print the resume using browser's print dialog
 * This creates a PDF through the browser's print-to-PDF functionality
 */
export function printResume(resume: Resume) {
  // Generate filename with prompt if enabled
  const settings = useSettingsStore.getState().settings;
  let suggestedFilename: string;

  if (settings.promptExportFilename) {
    const filename = getFinalFilename(resume, "pdf");
    if (!filename) {
      // User cancelled, don't open print dialog
      return;
    }
    // Remove extension for document title
    suggestedFilename = filename.replace(/\.pdf$/i, "");
  } else {
    suggestedFilename = generateDefaultFilename(resume, "pdf").replace(
      /\.pdf$/i,
      "",
    );
  }

  // Set page title for PDF filename suggestion
  const originalTitle = document.title;
  document.title = suggestedFilename;

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
 * Now captures the actual rendered template with all formatting
 */
export function downloadHTML(resume: Resume) {
  // Get the rendered template HTML from the DOM
  const renderedHTML = getRenderedTemplateHTML();

  if (!renderedHTML) {
    throw new Error(
      "Resume preview not found. Please ensure the resume is displayed on the page.",
    );
  }

  // Build complete HTML document with embedded styles
  // Using inline styles from getRenderedTemplateHTML(), we don't need the full stylesheet
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(resume.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    /* Reset and base styles */
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #f3f4f6;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .resume-container {
      width: 210mm;
      min-height: 297mm;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    /* Print styles */
    @page {
      size: A4;
      margin: 0;
    }

    @media print {
      body {
        background: white !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .resume-container {
        width: 100% !important;
        box-shadow: none !important;
        margin: 0 !important;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    /* Utility classes for flex/grid layouts */
    .flex { display: flex !important; }
    .grid { display: grid !important; }
    .inline-flex { display: inline-flex !important; }
    .block { display: block !important; }
    .inline-block { display: inline-block !important; }
    .inline { display: inline !important; }

    /* SVG icons */
    svg {
      display: inline-block;
      vertical-align: middle;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="resume-container">
    ${renderedHTML}
  </div>
</body>
</html>`;

  const filename = getFinalFilename(resume, "html");
  if (filename) {
    const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
    saveAs(blob, filename);
  }
}

/**
 * Helper to escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Download resume as DOCX (Microsoft Word) file
 * Creates a professionally formatted Word document with proper styling
 */
export async function downloadDOCX(resume: Resume): Promise<void> {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  const sections: Paragraph[] = [];

  // Define colors (matching template theme)
  const primaryColor = "2563EB"; // Blue-600

  // Name (Title) - Large, bold, centered
  const fullName = getFullName(
    personalInfo.firstName,
    personalInfo.lastName,
    personalInfo.nameOrder,
  );
  if (fullName) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: fullName,
            bold: true,
            size: 48, // 24pt
            font: "Calibri",
            color: "1F2937", // Gray-800
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
    );
  }

  // Contact Information - Centered with separators
  const contactParts: TextRun[] = [];
  if (personalInfo.email) {
    contactParts.push(
      new TextRun({
        text: personalInfo.email,
        size: 20, // 10pt
        font: "Calibri",
        color: "4B5563", // Gray-600
      }),
    );
  }
  if (personalInfo.phone) {
    if (contactParts.length > 0) {
      contactParts.push(
        new TextRun({
          text: "  |  ",
          size: 20,
          font: "Calibri",
          color: "9CA3AF", // Gray-400
        }),
      );
    }
    contactParts.push(
      new TextRun({
        text: personalInfo.phone,
        size: 20,
        font: "Calibri",
        color: "4B5563",
      }),
    );
  }
  if (personalInfo.location) {
    if (contactParts.length > 0) {
      contactParts.push(
        new TextRun({
          text: "  |  ",
          size: 20,
          font: "Calibri",
          color: "9CA3AF",
        }),
      );
    }
    contactParts.push(
      new TextRun({
        text: personalInfo.location,
        size: 20,
        font: "Calibri",
        color: "4B5563",
      }),
    );
  }

  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        children: contactParts,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
    );
  }

  // Helper function to create section headers
  const createSectionHeader = (title: string) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24, // 12pt
          font: "Calibri",
          color: primaryColor,
        }),
      ],
      spacing: { before: 300, after: 120 },
      border: {
        bottom: {
          color: primaryColor,
          size: 12, // 0.75pt
          style: "single" as const,
        },
      },
    });
  };

  // Professional Summary
  if (personalInfo.summary) {
    sections.push(createSectionHeader("Professional Summary"));
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 22, // 11pt
            font: "Calibri",
            color: "374151", // Gray-700
          }),
        ],
        spacing: { after: 200 },
      }),
    );
  }

  // Experience
  if (experience.length > 0) {
    sections.push(createSectionHeader("Experience"));

    for (const exp of experience) {
      // Position and Date on same line
      const dateRange = `${exp.startDate || ""} - ${exp.current ? "Present" : exp.endDate || ""}`;
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position || "",
              bold: true,
              size: 22,
              font: "Calibri",
              color: "1F2937",
            }),
            new TextRun({
              text: `\t${dateRange}`,
              size: 20,
              font: "Calibri",
              color: "6B7280", // Gray-500
              italics: true,
            }),
          ],
          tabStops: [
            {
              type: "right" as const,
              position: 9360, // Right aligned at ~6.5 inches
            },
          ],
          spacing: { after: 60 },
        }),
      );

      // Company
      if (exp.company) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.company,
                size: 21,
                font: "Calibri",
                color: "4B5563",
                italics: true,
              }),
            ],
            spacing: { after: 80 },
          }),
        );
      }

      // Description
      if (exp.description) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
                font: "Calibri",
                color: "374151",
              }),
            ],
            spacing: { after: 80 },
          }),
        );
      }

      // Highlights as bullet points
      if (exp.highlights && exp.highlights.length > 0) {
        for (const highlight of exp.highlights) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: highlight,
                  size: 20,
                  font: "Calibri",
                  color: "374151",
                }),
              ],
              bullet: { level: 0 },
              spacing: { after: 40 },
            }),
          );
        }
      }

      sections.push(new Paragraph({ text: "", spacing: { after: 160 } }));
    }
  }

  // Education
  if (education.length > 0) {
    sections.push(createSectionHeader("Education"));

    for (const edu of education) {
      const dateInfo = edu.endDate || (edu.current ? "Present" : "");

      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.degree || "",
              bold: true,
              size: 22,
              font: "Calibri",
              color: "1F2937",
            }),
            ...(edu.field
              ? [
                  new TextRun({
                    text: ` in ${edu.field}`,
                    size: 22,
                    font: "Calibri",
                    color: "1F2937",
                  }),
                ]
              : []),
            ...(dateInfo
              ? [
                  new TextRun({
                    text: `\t${dateInfo}`,
                    size: 20,
                    font: "Calibri",
                    color: "6B7280",
                    italics: true,
                  }),
                ]
              : []),
          ],
          tabStops: [
            {
              type: "right" as const,
              position: 9360,
            },
          ],
          spacing: { after: 60 },
        }),
      );

      // Institution
      if (edu.institution) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution,
                size: 21,
                font: "Calibri",
                color: "4B5563",
                italics: true,
              }),
              ...(edu.gpa
                ? [
                    new TextRun({
                      text: `  •  GPA: ${edu.gpa}`,
                      size: 20,
                      font: "Calibri",
                      color: "6B7280",
                    }),
                  ]
                : []),
            ],
            spacing: { after: 80 },
          }),
        );
      }

      // Honors
      if (edu.honors && edu.honors.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Honors: ${edu.honors.join(", ")}`,
                size: 20,
                font: "Calibri",
                color: "374151",
                italics: true,
              }),
            ],
            spacing: { after: 120 },
          }),
        );
      }
    }
  }

  // Skills
  const skillCategories = [
    { name: "Technical Skills", items: skills.technical.map(getSkillName) },
    { name: "Languages", items: skills.languages.map(getSkillName) },
    { name: "Tools", items: skills.tools.map(getSkillName) },
    { name: "Soft Skills", items: skills.soft.map(getSkillName) },
  ].filter((cat) => cat.items.length > 0);

  if (skillCategories.length > 0) {
    sections.push(createSectionHeader("Skills"));

    for (const skillCategory of skillCategories) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${skillCategory.name}: `,
              bold: true,
              size: 20,
              font: "Calibri",
              color: "1F2937",
            }),
            new TextRun({
              text: skillCategory.items.join(", "),
              size: 20,
              font: "Calibri",
              color: "374151",
            }),
          ],
          spacing: { after: 80 },
        }),
      );
    }
  }

  // Certifications
  if (certifications.length > 0) {
    sections.push(createSectionHeader("Certifications"));

    for (const cert of certifications) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name || "",
              bold: true,
              size: 21,
              font: "Calibri",
              color: "1F2937",
            }),
            ...(cert.issuer
              ? [
                  new TextRun({
                    text: ` - ${cert.issuer}`,
                    size: 20,
                    font: "Calibri",
                    color: "4B5563",
                  }),
                ]
              : []),
            ...(cert.date
              ? [
                  new TextRun({
                    text: ` (${cert.date})`,
                    size: 20,
                    font: "Calibri",
                    color: "6B7280",
                    italics: true,
                  }),
                ]
              : []),
          ],
          spacing: { after: 80 },
        }),
      );
    }
  }

  // Links
  if (links.length > 0) {
    sections.push(createSectionHeader("Links"));

    for (const link of links) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${link.label || "Link"}: `,
              bold: true,
              size: 20,
              font: "Calibri",
              color: "1F2937",
            }),
            new TextRun({
              text: link.url,
              size: 20,
              font: "Calibri",
              color: primaryColor,
              underline: { type: UnderlineType.SINGLE },
            }),
          ],
          spacing: { after: 80 },
        }),
      );
    }
  }

  // Create document with proper page settings
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: sections,
      },
    ],
  });

  // Generate and save with filename prompt
  const filename = getFinalFilename(resume, "docx");
  if (filename) {
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
  }
}

/**
 * Download resume as Markdown file
 */
export function downloadMarkdown(resume: Resume): void {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  let markdown = "";

  // Name
  const markdownName = getFullName(
    personalInfo.firstName,
    personalInfo.lastName,
    personalInfo.nameOrder,
  );
  if (markdownName) {
    markdown += `# ${markdownName}\n\n`;
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
    { name: "Technical", items: skills.technical.map(getSkillName) },
    { name: "Languages", items: skills.languages.map(getSkillName) },
    { name: "Tools", items: skills.tools.map(getSkillName) },
    { name: "Soft Skills", items: skills.soft.map(getSkillName) },
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

  const filename = getFinalFilename(resume, "md");
  if (filename) {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, filename);
  }
}

/**
 * Download resume as plain text file
 */
export function downloadPlainText(resume: Resume): void {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  let text = "";

  // Name
  const textName = getFullName(
    personalInfo.firstName,
    personalInfo.lastName,
    personalInfo.nameOrder,
  );
  if (textName) {
    text += `${textName}\n`;
    text += `${"=".repeat(textName.length)}\n\n`;
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
    { name: "Technical", items: skills.technical.map(getSkillName) },
    { name: "Languages", items: skills.languages.map(getSkillName) },
    { name: "Tools", items: skills.tools.map(getSkillName) },
    { name: "Soft Skills", items: skills.soft.map(getSkillName) },
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

  const filename = getFinalFilename(resume, "txt");
  if (filename) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  }
}

/**
 * Download resume as JSON file
 */
export function downloadJSON(resume: Resume): void {
  const filename = getFinalFilename(resume, "json");
  if (filename) {
    const jsonString = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, filename);
  }
}

/**
 * Sanitize filename by removing invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9_-]/gi, "_").replace(/_{2,}/g, "_");
}

/**
 * Generate a default filename for export based on resume content
 * Format: FirstName_LastName_Resume_YYYY-MM-DD or Resume_Title_YYYY-MM-DD
 */
export function generateDefaultFilename(
  resume: Resume,
  extension: string,
): string {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  // Try to use personal name first
  const firstName = resume.content.personalInfo?.firstName?.trim();
  const lastName = resume.content.personalInfo?.lastName?.trim();
  if (firstName || lastName) {
    if (firstName && lastName) {
      return sanitizeFilename(
        `${firstName}_${lastName}_Resume_${dateStr}.${extension}`,
      );
    } else {
      // Use whichever name is available
      return sanitizeFilename(
        `${firstName || lastName}_Resume_${dateStr}.${extension}`,
      );
    }
  }

  // Fallback to resume title
  const title = resume.title || "Resume";
  return sanitizeFilename(`${title}_${dateStr}.${extension}`);
}

/**
 * Prompt user for filename with a default value
 * Returns the filename (without extension) or null if cancelled
 */
export function promptForFilename(
  defaultFilename: string,
  extension: string,
): string | null {
  const filenameWithoutExt = defaultFilename.replace(
    new RegExp(`\\.${extension}$`),
    "",
  );

  const userInput = window.prompt(
    `Enter filename for your resume (without extension):`,
    filenameWithoutExt,
  );

  if (userInput === null) {
    // User cancelled
    return null;
  }

  // Return sanitized filename with extension
  const sanitized = sanitizeFilename(userInput || filenameWithoutExt);
  return sanitized
    ? `${sanitized}.${extension}`
    : `${filenameWithoutExt}.${extension}`;
}

/**
 * Get the final filename for export, prompting user if setting is enabled
 * Returns null if user cancels the prompt
 */
export function getFinalFilename(
  resume: Resume,
  extension: string,
): string | null {
  const settings = useSettingsStore.getState().settings;
  const defaultFilename = generateDefaultFilename(resume, extension);

  if (settings.promptExportFilename) {
    return promptForFilename(defaultFilename, extension);
  }

  return defaultFilename;
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
