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
 * Uses html2canvas and jsPDF to convert the resume to a proper PDF document
 */
export async function downloadPDF(resume: Resume): Promise<void> {
  try {
    // Create a temporary container with the resume content
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = "210mm"; // A4 width
    container.style.height = "297mm"; // A4 height
    container.style.padding = "20px";
    container.style.backgroundColor = "#FFFFFF"; // Use standard RGB instead of oklch
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "11px";
    container.style.lineHeight = "1.4";
    container.style.color = "#333333"; // Use standard RGB instead of oklch

    // Build the resume HTML
    const {
      personalInfo,
      experience,
      education,
      skills,
      certifications,
      links,
    } = resume.content;

    let html = `<div style="padding: 20px; font-family: Arial, sans-serif; color: #333333; line-height: 1.4;">`;

    // Name
    if (personalInfo.name) {
      html += `<h1 style="font-size: 24px; margin: 0 0 10px 0; text-align: center; color: #000000;">${personalInfo.name}</h1>`;
    }

    // Contact Info
    const contactParts: string[] = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.location) contactParts.push(personalInfo.location);

    if (contactParts.length > 0) {
      html += `<p style="text-align: center; margin: 0 0 20px 0; font-size: 10px; color: #666666;">${contactParts.join(" | ")}</p>`;
    }

    // Professional Summary
    if (personalInfo.summary) {
      html += `<h2 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; border-bottom: 2px solid #333333; padding-bottom: 3px; color: #000000;">PROFESSIONAL SUMMARY</h2>`;
      html += `<p style="margin: 0 0 10px 0; font-size: 11px; color: #333333;">${personalInfo.summary}</p>`;
    }

    // Experience
    if (experience.length > 0) {
      html += `<h2 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; border-bottom: 2px solid #333333; padding-bottom: 3px; color: #000000;">EXPERIENCE</h2>`;
      for (const exp of experience) {
        html += `<div style="margin-bottom: 10px;">`;
        html += `<p style="margin: 0; font-weight: bold; font-size: 11px; color: #000000;">${exp.position} | ${exp.company}</p>`;
        html += `<p style="margin: 2px 0 5px 0; font-style: italic; font-size: 10px; color: #666666;">${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""}</p>`;
        if (exp.description) {
          html += `<p style="margin: 3px 0; font-size: 10px; color: #333333;">${exp.description}</p>`;
        }
        if (exp.highlights && exp.highlights.length > 0) {
          html += `<ul style="margin: 3px 0 0 20px; padding: 0; font-size: 10px; color: #333333;">`;
          for (const highlight of exp.highlights) {
            html += `<li style="margin: 2px 0; color: #333333;">${highlight}</li>`;
          }
          html += `</ul>`;
        }
        html += `</div>`;
      }
    }

    // Education
    if (education.length > 0) {
      html += `<h2 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; border-bottom: 2px solid #333333; padding-bottom: 3px; color: #000000;">EDUCATION</h2>`;
      for (const edu of education) {
        html += `<div style="margin-bottom: 8px;">`;
        html += `<p style="margin: 0; font-weight: bold; font-size: 11px; color: #000000;">${edu.degree} | ${edu.institution}</p>`;
        if (edu.endDate || edu.gpa) {
          const details: string[] = [];
          if (edu.endDate) details.push(edu.endDate);
          if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
          html += `<p style="margin: 2px 0; font-size: 10px; color: #666666;">${details.join(" | ")}</p>`;
        }
        html += `</div>`;
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
      html += `<h2 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; border-bottom: 2px solid #333333; padding-bottom: 3px; color: #000000;">SKILLS</h2>`;
      for (const skillCategory of skillCategories) {
        html += `<p style="margin: 3px 0; font-size: 10px; color: #333333;"><strong>${skillCategory.name}:</strong> ${skillCategory.items.join(", ")}</p>`;
      }
    }

    // Certifications
    if (certifications.length > 0) {
      html += `<h2 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; border-bottom: 2px solid #333333; padding-bottom: 3px; color: #000000;">CERTIFICATIONS</h2>`;
      for (const cert of certifications) {
        const certText = `${cert.name} - ${cert.issuer}${cert.date ? ` (${cert.date})` : ""}`;
        html += `<p style="margin: 3px 0; font-size: 10px; color: #333333;">• ${certText}</p>`;
      }
    }

    // Links
    if (links.length > 0) {
      html += `<h2 style="font-size: 14px; font-weight: bold; margin: 15px 0 8px 0; border-bottom: 2px solid #333333; padding-bottom: 3px; color: #000000;">LINKS</h2>`;
      for (const link of links) {
        html += `<p style="margin: 3px 0; font-size: 10px; color: #333333;">• <strong>${link.label}:</strong> ${link.url}</p>`;
      }
    }

    html += `</div>`;

    container.innerHTML = html;
    document.body.appendChild(container);

    // Convert HTML to canvas - use allowTaint to ignore unsupported CSS
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      logging: false,
      // Ignore errors from unsupported CSS features
      onclone: (cloned) => {
        const styles = cloned.querySelectorAll("[style]");
        styles.forEach((el) => {
          if (el instanceof HTMLElement) {
            // Remove any oklch color references that might cause issues
            let style = el.getAttribute("style") || "";
            style = style.replace(/oklch\([^)]*\)/g, "#333333");
            el.setAttribute("style", style);
          }
        });
      },
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF from canvas
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add pages if content is longer than one page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Save the PDF
    pdf.save(`${sanitizeFilename(resume.title)}.pdf`);
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
