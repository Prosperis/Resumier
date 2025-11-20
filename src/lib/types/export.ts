/**
 * Export Format Types
 * Type definitions for resume export functionality
 */

/**
 * Supported export formats
 */
export type ExportFormatType =
  | "latex"
  | "docx"
  | "html"
  | "markdown"
  | "txt"
  | "json";

/**
 * Export format metadata
 */
export interface ExportFormat {
  id: ExportFormatType;
  label: string;
  description: string;
  extension: string;
  mimeType: string;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormatType;
  includeMetadata?: boolean;
  filename?: string;
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean;
  format: ExportFormatType;
  filename: string;
  error?: string;
}

/**
 * Available export formats with their metadata
 */
export const EXPORT_FORMATS: Record<ExportFormatType, ExportFormat> = {
  latex: {
    id: "latex",
    label: "LaTeX",
    description: "LaTeX source document - Compile to PDF with full control",
    extension: ".tex",
    mimeType: "text/x-latex",
  },
  docx: {
    id: "docx",
    label: "Word Document",
    description: "Microsoft Word format - Editable and ATS-friendly",
    extension: ".docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  html: {
    id: "html",
    label: "HTML",
    description: "Web page with embedded styles - Universal compatibility",
    extension: ".html",
    mimeType: "text/html",
  },
  markdown: {
    id: "markdown",
    label: "Markdown",
    description:
      "Plain text format - Developer-friendly and version-control ready",
    extension: ".md",
    mimeType: "text/markdown",
  },
  txt: {
    id: "txt",
    label: "Plain Text",
    description: "Simple text file - Maximum compatibility",
    extension: ".txt",
    mimeType: "text/plain",
  },
  json: {
    id: "json",
    label: "JSON",
    description: "Structured data format - For backup and data portability",
    extension: ".json",
    mimeType: "application/json",
  },
};
