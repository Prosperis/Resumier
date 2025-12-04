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

    // Apply key computed styles as inline styles
    const importantProps = [
      "color",
      "backgroundColor",
      "fontSize",
      "fontFamily",
      "fontWeight",
      "fontStyle",
      "textAlign",
      "lineHeight",
      "padding",
      "margin",
      "border",
      "borderRadius",
      "display",
      "width",
      "height",
      "maxWidth",
      "minWidth",
      "minHeight",
      "gap",
      "flexShrink",
      "verticalAlign",
      "alignItems",
    ];

    importantProps.forEach((prop) => {
      const camelProp = prop as keyof CSSStyleDeclaration;
      const value = computed[camelProp] as string;
      if (value && value !== "none" && value !== "normal" && value !== "auto") {
        htmlEl.style[camelProp as any] = value;
      }
    });

    // Special handling for SVG elements (Lucide icons)
    if (htmlEl.tagName === "svg" || htmlEl.closest("svg")) {
      // Ensure SVG size attributes are preserved
      const width = computed.width;
      const height = computed.height;
      if (width && width !== "auto") {
        htmlEl.style.width = width;
        htmlEl.setAttribute("width", width);
      }
      if (height && height !== "auto") {
        htmlEl.style.height = height;
        htmlEl.setAttribute("height", height);
      }

      // Preserve viewBox if it exists
      if (htmlEl.hasAttribute("viewBox")) {
        const viewBox = htmlEl.getAttribute("viewBox");
        if (viewBox) htmlEl.setAttribute("viewBox", viewBox);
      }

      // Ensure stroke and fill are preserved
      const stroke = computed.stroke;
      const fill = computed.fill;
      const strokeWidth = computed.strokeWidth;

      if (stroke && stroke !== "none") htmlEl.style.stroke = stroke;
      if (fill && fill !== "none") htmlEl.style.fill = fill;
      if (strokeWidth) htmlEl.style.strokeWidth = strokeWidth;
    }
  });

  return clonedElement.innerHTML;
}

/**
 * Helper function to collect all CSS rules from stylesheets
 */
function collectStyleSheets(): string {
  const styleSheets = Array.from(document.styleSheets);
  let allStyles = "";

  try {
    styleSheets.forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach((rule) => {
          allStyles += rule.cssText + "\n";
        });
      } catch {
        // Cross-origin stylesheets - skip them
      }
    });
  } catch {
    // Error collecting styles
  }

  return allStyles;
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
 * @internal Reserved for future use
 */
export async function generatePDFFromRenderedTemplate(
  resume: Resume,
): Promise<void> {
  // Wait a bit for DOM to be ready
  await new Promise((resolve) => setTimeout(resolve, 100));

  const resumeElement = document.querySelector(".resume-light-mode");
  if (!resumeElement) {
    throw new Error(
      "Resume preview not found. Please ensure you're viewing the resume preview before exporting.",
    );
  }

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
  container.style.width = `${resumeElement.clientWidth}px`;
  container.style.backgroundColor = "#ffffff";
  container.appendChild(clonedElement);
  document.body.appendChild(container);

  // Wait for element to render
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    // Convert to canvas
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: clonedElement.scrollWidth,
      height: clonedElement.scrollHeight,
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Failed to capture resume content. Canvas is empty.");
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    if (!imgData || imgData === "data:,") {
      throw new Error("Failed to convert canvas to image.");
    }

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
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

  // Get all stylesheets content
  const allStyles = collectStyleSheets();

  // Build complete HTML document with embedded styles
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.title}</title>
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #f3f4f6;
      padding: 2rem;
    }

    /* Print styles */
    @media print {
      body {
        background: white;
        padding: 0;
      }
    }

    /* Embedded app styles */
    ${allStyles}
  </style>
</head>
<body>
  <div class="resume-light-mode light">
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
 * Download resume as DOCX (Microsoft Word) file
 */
export async function downloadDOCX(resume: Resume): Promise<void> {
  const { personalInfo, experience, education, skills, certifications, links } =
    resume.content;

  const sections: Paragraph[] = [];

  // Name (Title)
  const fullName = getFullName(
    personalInfo.firstName,
    personalInfo.lastName,
    personalInfo.nameOrder,
  );
  if (fullName) {
    sections.push(
      new Paragraph({
        text: fullName,
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
    { name: "Technical", items: skills.technical.map(getSkillName) },
    { name: "Languages", items: skills.languages.map(getSkillName) },
    { name: "Tools", items: skills.tools.map(getSkillName) },
    { name: "Soft Skills", items: skills.soft.map(getSkillName) },
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
