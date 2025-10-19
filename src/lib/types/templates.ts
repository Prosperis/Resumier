/**
 * Template Types
 * Type definitions for resume templates
 */

export type TemplateType = "modern" | "classic" | "minimal"

export interface TemplateInfo {
  id: TemplateType
  name: string
  description: string
  preview?: string
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, two-column design with accent colors",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column format, ATS-friendly",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean design with lots of white space",
  },
]
