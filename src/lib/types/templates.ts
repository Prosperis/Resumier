/**
 * Enhanced Template Types and Architecture
 * Type definitions for resume templates with comprehensive metadata
 */

import type { ExperienceFormat, Resume } from "@/lib/api/types";

/**
 * Template Categories
 */
export type TemplateCategory =
  | "professional" // Traditional, business-focused
  | "modern" // Contemporary, clean designs
  | "creative" // Artistic, bold designs
  | "industry-specific" // Tailored for specific industries
  | "experience-level" // Optimized for career stage
  | "specialized"; // Unique layouts (two-column, timeline, etc.)

/**
 * Template Style
 */
export type TemplateStyle =
  | "traditional" // Classic, conservative
  | "contemporary" // Modern, current trends
  | "minimal" // Clean, lots of white space
  | "bold" // Strong visual elements
  | "creative" // Artistic, unique
  | "technical"; // Developer/engineer focused

/**
 * Layout Types
 */
export type TemplateLayout =
  | "single-column" // Traditional single column
  | "two-column" // Main content + sidebar
  | "three-column" // Multiple sidebars
  | "split" // Asymmetric split design
  | "timeline" // Career progression focused
  | "grid"; // Grid-based layout

/**
 * Header Styles
 */
export type HeaderStyle =
  | "centered" // Centered header
  | "left" // Left-aligned
  | "right" // Right-aligned
  | "split" // Name on left, contact on right
  | "banner" // Full-width banner
  | "minimal"; // Minimal header

/**
 * Section Styles
 */
export type SectionStyle =
  | "minimal" // Simple dividers
  | "bordered" // Boxed sections
  | "accented" // Color accents
  | "icons" // Icons for sections
  | "timeline" // Timeline-style
  | "cards"; // Card-based sections

/**
 * Color Scheme
 */
export interface ColorScheme {
  primary: string; // Main accent color
  secondary?: string; // Secondary accent
  text: string; // Main text color
  textLight: string; // Light text color
  background: string; // Background color
  border: string; // Border color
}

/**
 * Typography Configuration
 */
export interface Typography {
  headingFont: string; // Font for headings
  bodyFont: string; // Font for body text
  monoFont?: string; // Monospace font (for code, etc.)
  headingSizes: {
    h1: string;
    h2: string;
    h3: string;
  };
  bodySize: string;
}

/**
 * Spacing Configuration
 */
export type SpacingSize = "compact" | "normal" | "spacious";

/**
 * Extended Template Information
 */
export interface TemplateInfo {
  // Identification
  id: string;
  name: string;
  description: string;

  // Categorization
  category: TemplateCategory;
  style: TemplateStyle;
  layout: TemplateLayout;

  // Metadata
  tags: string[];
  bestFor: string[]; // e.g., ["Senior Developers", "Career Changers"]
  industries: string[]; // e.g., ["Technology", "Finance"]

  // Target audience
  experienceLevel?: ("entry" | "mid" | "senior" | "executive")[];

  // Quality metrics
  atsScore: number; // 1-10, how ATS-friendly
  printOptimized: boolean;

  // Visual
  preview: string; // Thumbnail URL
  thumbnail: string; // Gallery thumbnail URL

  // Design system
  colorScheme: ColorScheme;
  typography: Typography;
  spacing: SpacingSize;

  // Features
  features: TemplateFeature[];

  // Status
  isPremium?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

/**
 * Template Features
 */
export type TemplateFeature =
  | "ats-optimized"
  | "two-page"
  | "one-page"
  | "photo-support"
  | "color-customizable"
  | "icon-based"
  | "portfolio-section"
  | "projects-showcase"
  | "publications-section"
  | "references-section"
  | "skills-visualization"
  | "timeline-view";

/**
 * Template Component Props
 */
export interface TemplateComponentProps {
  resume: Resume;
  config?: TemplateConfig;
}

/**
 * Template Configuration (User Customizations)
 */
export interface TemplateConfig {
  // Color customization
  colorScheme?: Partial<ColorScheme>;

  // Typography customization
  typography?: Partial<Typography>;

  // Layout options
  spacing?: SpacingSize;
  showPhoto?: boolean;
  showIcons?: boolean;

  // Content format preferences
  experienceFormat?: ExperienceFormat;

  // Section visibility
  sections?: {
    summary?: boolean;
    experience?: boolean;
    education?: boolean;
    skills?: boolean;
    certifications?: boolean;
    links?: boolean;
    projects?: boolean;
    publications?: boolean;
    references?: boolean;
  };

  // Section order
  sectionOrder?: string[];

  // Page options
  pageCount?: 1 | 2;
}

/**
 * Template Registry
 * Maps template IDs to their component and metadata
 */
export interface TemplateRegistry {
  [key: string]: {
    info: TemplateInfo;
    component: React.ComponentType<TemplateComponentProps>;
  };
}

/**
 * Template Filter Options
 */
export interface TemplateFilterOptions {
  category?: TemplateCategory[];
  style?: TemplateStyle[];
  layout?: TemplateLayout[];
  industries?: string[];
  experienceLevel?: ("entry" | "mid" | "senior" | "executive")[];
  features?: TemplateFeature[];
  atsScoreMin?: number;
  isPremium?: boolean;
  search?: string;
}

/**
 * Template Sort Options
 */
export type TemplateSortBy =
  | "popular"
  | "newest"
  | "name"
  | "ats-score"
  | "category";

export type TemplateSortOrder = "asc" | "desc";

/**
 * Predefined Color Schemes
 */
export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  // Professional colors
  navy: {
    primary: "#1e3a8a",
    secondary: "#3b82f6",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  charcoal: {
    primary: "#374151",
    secondary: "#6b7280",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  blue: {
    primary: "#2563eb",
    secondary: "#3b82f6",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  slate: {
    primary: "#475569",
    secondary: "#64748b",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  indigo: {
    primary: "#4f46e5",
    secondary: "#6366f1",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },

  // Modern colors
  purple: {
    primary: "#8b5cf6",
    secondary: "#a78bfa",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  violet: {
    primary: "#7c3aed",
    secondary: "#8b5cf6",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  teal: {
    primary: "#14b8a6",
    secondary: "#2dd4bf",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  emerald: {
    primary: "#10b981",
    secondary: "#34d399",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },

  // Creative colors
  coral: {
    primary: "#f97316",
    secondary: "#fb923c",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  orange: {
    primary: "#ea580c",
    secondary: "#f97316",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
  rose: {
    primary: "#e11d48",
    secondary: "#f43f5e",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },

  // Neutral
  neutral: {
    primary: "#000000",
    secondary: "#404040",
    text: "#111827",
    textLight: "#6b7280",
    background: "#ffffff",
    border: "#e5e7eb",
  },
};

/**
 * Predefined Typography Sets
 */
export const TYPOGRAPHY_PRESETS: Record<string, Typography> = {
  classic: {
    headingFont: "Georgia, serif",
    bodyFont: "Arial, sans-serif",
    headingSizes: { h1: "2rem", h2: "1.5rem", h3: "1.25rem" },
    bodySize: "0.875rem",
  },
  modern: {
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
    headingSizes: { h1: "2.25rem", h2: "1.5rem", h3: "1.125rem" },
    bodySize: "0.875rem",
  },
  creative: {
    headingFont: "Montserrat, sans-serif",
    bodyFont: "Open Sans, sans-serif",
    headingSizes: { h1: "2.5rem", h2: "1.75rem", h3: "1.25rem" },
    bodySize: "0.875rem",
  },
  professional: {
    headingFont: "Lato, sans-serif",
    bodyFont: "Merriweather, serif",
    headingSizes: { h1: "2rem", h2: "1.5rem", h3: "1.25rem" },
    bodySize: "0.875rem",
  },
  technical: {
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
    monoFont: "Source Code Pro, monospace",
    headingSizes: { h1: "2rem", h2: "1.375rem", h3: "1.125rem" },
    bodySize: "0.875rem",
  },
};

/**
 * Template type union of all available templates
 */
export type TemplateType =
  | "modern"
  | "classic"
  | "minimal"
  | "executive"
  | "academic"
  | "corporate"
  | "techModern"
  | "creativePro"
  | "startup"
  | "contemporary"
  | "twoColumnPro"
  | "timeline"
  | "infographicLite"
  | "portfolio"
  | "government"
  | "professionalServices"
  | "threeColumn"
  | "boldHeaders"
  | "colorBlock"
  | "geometric"
  | "borderAccent"
  | "splitScreen"
  | "magazineStyle"
  | "compact"
  | "elegant"
  | "international";

/**
 * Templates array for backward compatibility
 */
export const TEMPLATES: Array<{
  id: TemplateType;
  name: string;
  description: string;
}> = [
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
  {
    id: "executive",
    name: "Executive",
    description: "Bold serif design for senior leadership",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Traditional CV format for academic positions",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Conservative design for corporate roles",
  },
  {
    id: "techModern",
    name: "Tech Modern",
    description: "Modern tech-focused design with skill bars",
  },
  {
    id: "creativePro",
    name: "Creative Professional",
    description: "Bold creative design with unique elements",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Dynamic design for startup environments",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Current design trends with clean lines",
  },
  {
    id: "twoColumnPro",
    name: "Two Column Pro",
    description: "Professional two-column layout with sidebar",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Visual timeline format for experience",
  },
  {
    id: "infographicLite",
    name: "Infographic Lite",
    description: "Visual elements with data representation",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase work with portfolio section",
  },
  {
    id: "government",
    name: "Government",
    description: "Federal resume format compliant",
  },
  {
    id: "professionalServices",
    name: "Professional Services",
    description: "Consulting and accounting focused",
  },
  {
    id: "threeColumn",
    name: "Three Column",
    description: "Unique three-column layout",
  },
  {
    id: "boldHeaders",
    name: "Bold Headers",
    description: "Statement-making header design",
  },
  {
    id: "colorBlock",
    name: "Color Block",
    description: "Strategic color blocking design",
  },
  {
    id: "geometric",
    name: "Geometric",
    description: "Modern shapes and design elements",
  },
  {
    id: "borderAccent",
    name: "Border Accent",
    description: "Framed sections with colored borders",
  },
  {
    id: "splitScreen",
    name: "Split Screen",
    description: "Two-tone contrasting layout",
  },
  {
    id: "magazineStyle",
    name: "Magazine Style",
    description: "Editorial multi-column design",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Maximum information density",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined typography with spacing",
  },
  {
    id: "international",
    name: "International",
    description: "European CV format with photo",
  },
];
