/**
 * Template Registry
 * Central registry for all resume templates
 */

import type { TemplateInfo, TemplateRegistry } from "@/lib/types/templates";
import { COLOR_SCHEMES, TYPOGRAPHY_PRESETS } from "@/lib/types/templates";

// Import existing templates
import { ModernTemplate } from "./modern-template";
import { ClassicTemplate } from "./classic-template";
import { MinimalTemplate } from "./minimal-template";
import { ExecutiveTemplate } from "./executive-template";
import { TwoColumnTemplate } from "./two-column-template";
import { TimelineTemplate } from "./timeline-template";
import { CompactTemplate } from "./compact-template";
import { SplitScreenTemplate } from "./split-screen-template";
import { AcademicTemplate } from "./academic-template";
import { TechModernTemplate } from "./tech-modern-template";
import { CreativeProTemplate } from "./creative-pro-template";
import { StartupTemplate } from "./startup-template";
import { ContemporaryTemplate } from "./contemporary-template";
import { InfographicLiteTemplate } from "./infographic-lite-template";
import { PortfolioTemplate } from "./portfolio-template";
import { GovernmentTemplate } from "./government-template";
import { ProfessionalServicesTemplate } from "./professional-services-template";
import { ThreeColumnTemplate } from "./three-column-template";
import { BoldHeadersTemplate } from "./bold-headers-template";
import { ColorBlockTemplate } from "./color-block-template";
import { GeometricTemplate } from "./geometric-template";
import { BorderAccentTemplate } from "./border-accent-template";
import { MagazineStyleTemplate } from "./magazine-style-template";
import { ElegantTemplate } from "./elegant-template";
import { InternationalTemplate } from "./international-template";
import { CorporateTemplate } from "./corporate-template";

/**
 * Template metadata registry
 */
export const TEMPLATE_INFO: Record<string, TemplateInfo> = {
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean, two-column design with accent colors",
    category: "modern",
    style: "contemporary",
    layout: "two-column",
    tags: ["professional", "colorful", "two-column", "sidebar"],
    bestFor: ["Mid-level professionals", "Tech industry", "Creative roles"],
    industries: ["Technology", "Marketing", "Design", "Consulting"],
    experienceLevel: ["mid", "senior"],
    atsScore: 8,
    printOptimized: true,
    preview: "/templates/modern-preview.png",
    thumbnail: "/templates/modern-thumb.png",
    colorScheme: COLOR_SCHEMES.purple,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: [
      "ats-optimized",
      "two-page",
      "color-customizable",
      "icon-based",
      "skills-visualization",
    ],
    isPopular: true,
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column format, ATS-friendly",
    category: "professional",
    style: "traditional",
    layout: "single-column",
    tags: ["traditional", "ats", "conservative", "serif"],
    bestFor: [
      "Traditional industries",
      "Senior positions",
      "Government jobs",
      "Academic positions",
    ],
    industries: [
      "Finance",
      "Legal",
      "Government",
      "Healthcare",
      "Education",
      "Accounting",
    ],
    experienceLevel: ["mid", "senior", "executive"],
    atsScore: 10,
    printOptimized: true,
    preview: "/templates/classic-preview.png",
    thumbnail: "/templates/classic-thumb.png",
    colorScheme: COLOR_SCHEMES.neutral,
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "normal",
    features: ["ats-optimized", "one-page", "two-page"],
    isPopular: true,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean design with lots of white space",
    category: "modern",
    style: "minimal",
    layout: "single-column",
    tags: ["minimal", "clean", "modern", "simple"],
    bestFor: ["Entry-level", "Career changers", "Modern companies", "Startups"],
    industries: ["Technology", "Design", "Media", "Startups"],
    experienceLevel: ["entry", "mid"],
    atsScore: 9,
    printOptimized: true,
    preview: "/templates/minimal-preview.png",
    thumbnail: "/templates/minimal-thumb.png",
    colorScheme: COLOR_SCHEMES.charcoal,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "spacious",
    features: ["ats-optimized", "one-page", "color-customizable"],
    isNew: true,
  },
  // Phase 1: Core Professional Templates
  executive: {
    id: "executive",
    name: "Executive",
    description: "Senior leadership resume with executive summary emphasis",
    category: "professional",
    style: "traditional",
    layout: "single-column",
    tags: ["executive", "leadership", "c-suite", "senior", "serif"],
    bestFor: ["C-suite executives", "VP roles", "Directors", "Senior management"],
    industries: ["Corporate", "Finance", "Consulting", "Healthcare", "Manufacturing"],
    experienceLevel: ["senior", "executive"],
    atsScore: 9,
    printOptimized: true,
    preview: "/templates/executive-preview.png",
    thumbnail: "/templates/executive-thumb.png",
    colorScheme: COLOR_SCHEMES.neutral,
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "normal",
    features: ["ats-optimized", "two-page"],
    isPopular: true,
  },
  academic: {
    id: "academic",
    name: "Academic",
    description: "CV-style template for researchers and professors",
    category: "professional",
    style: "traditional",
    layout: "single-column",
    tags: ["academic", "cv", "research", "professor", "publications"],
    bestFor: ["Faculty positions", "Researchers", "PhD candidates", "Academic roles"],
    industries: ["Education", "Research", "Science", "Healthcare"],
    experienceLevel: ["mid", "senior", "executive"],
    atsScore: 10,
    printOptimized: true,
    preview: "/templates/academic-preview.png",
    thumbnail: "/templates/academic-thumb.png",
    colorScheme: COLOR_SCHEMES.neutral,
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "normal",
    features: ["ats-optimized", "two-page", "publications-section"],
  },
  corporate: {
    id: "corporate",
    name: "Corporate",
    description: "Conservative template for banking, finance, and legal sectors",
    category: "professional",
    style: "traditional",
    layout: "single-column",
    tags: ["corporate", "conservative", "finance", "legal", "traditional"],
    bestFor: ["Banking", "Finance", "Legal", "Accounting", "Consulting"],
    industries: ["Finance", "Legal", "Banking", "Accounting", "Insurance"],
    experienceLevel: ["mid", "senior"],
    atsScore: 10,
    printOptimized: true,
    preview: "/templates/corporate-preview.png",
    thumbnail: "/templates/corporate-thumb.png",
    colorScheme: COLOR_SCHEMES.neutral,
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "normal",
    features: ["ats-optimized", "one-page", "two-page"],
  },
  techModern: {
    id: "techModern",
    name: "Tech Modern",
    description: "Developer-focused template with skills visualization",
    category: "modern",
    style: "contemporary",
    layout: "two-column",
    tags: ["tech", "developer", "modern", "skills", "blue"],
    bestFor: ["Software developers", "Engineers", "Tech professionals", "IT roles"],
    industries: ["Technology", "Software", "IT", "Startups"],
    experienceLevel: ["entry", "mid", "senior"],
    atsScore: 8,
    printOptimized: true,
    preview: "/templates/tech-modern-preview.png",
    thumbnail: "/templates/tech-modern-thumb.png",
    colorScheme: COLOR_SCHEMES.blue,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["ats-optimized", "skills-visualization", "color-customizable"],
    isPopular: true,
  },
  creativePro: {
    id: "creativePro",
    name: "Creative Professional",
    description: "Balanced creativity with professional polish",
    category: "creative",
    style: "creative",
    layout: "single-column",
    tags: ["creative", "gradient", "modern", "colorful", "professional"],
    bestFor: ["Designers", "Marketers", "Content creators", "Creative roles"],
    industries: ["Marketing", "Design", "Media", "Advertising", "Entertainment"],
    experienceLevel: ["entry", "mid", "senior"],
    atsScore: 7,
    printOptimized: true,
    preview: "/templates/creative-pro-preview.png",
    thumbnail: "/templates/creative-pro-thumb.png",
    colorScheme: COLOR_SCHEMES.purple,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["color-customizable", "icon-based"],
    isNew: true,
  },
  startup: {
    id: "startup",
    name: "Startup",
    description: "Dynamic template for fast-paced startup culture",
    category: "modern",
    style: "contemporary",
    layout: "single-column",
    tags: ["startup", "dynamic", "modern", "fast-paced", "tech"],
    bestFor: ["Startup roles", "Tech companies", "Fast-growing companies"],
    industries: ["Startups", "Technology", "E-commerce", "SaaS"],
    experienceLevel: ["entry", "mid"],
    atsScore: 8,
    printOptimized: true,
    preview: "/templates/startup-preview.png",
    thumbnail: "/templates/startup-thumb.png",
    colorScheme: COLOR_SCHEMES.teal,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "compact",
    features: ["ats-optimized", "one-page"],
  },
  contemporary: {
    id: "contemporary",
    name: "Contemporary",
    description: "Current design trends with clean lines",
    category: "modern",
    style: "contemporary",
    layout: "single-column",
    tags: ["contemporary", "trendy", "modern", "clean"],
    bestFor: ["Modern companies", "Mid-level professionals", "Career growth"],
    industries: ["Technology", "Media", "Consulting", "Services"],
    experienceLevel: ["mid", "senior"],
    atsScore: 9,
    printOptimized: true,
    preview: "/templates/contemporary-preview.png",
    thumbnail: "/templates/contemporary-thumb.png",
    colorScheme: COLOR_SCHEMES.slate,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["ats-optimized", "one-page", "two-page"],
  },
  twoColumnPro: {
    id: "twoColumnPro",
    name: "Two Column Pro",
    description: "Professional two-column layout with sidebar",
    category: "modern",
    style: "contemporary",
    layout: "two-column",
    tags: ["two-column", "sidebar", "professional", "organized"],
    bestFor: ["All professionals", "Skills-heavy roles", "Technical positions"],
    industries: ["All industries"],
    experienceLevel: ["entry", "mid", "senior"],
    atsScore: 8,
    printOptimized: true,
    preview: "/templates/two-column-pro-preview.png",
    thumbnail: "/templates/two-column-pro-thumb.png",
    colorScheme: COLOR_SCHEMES.indigo,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["ats-optimized"],
    isPopular: true,
  },
  timeline: {
    id: "timeline",
    name: "Timeline",
    description: "Career progression focused with timeline visualization",
    category: "modern",
    style: "contemporary",
    layout: "single-column",
    tags: ["timeline", "progression", "visual", "modern"],
    bestFor: ["Career changers", "Progressive roles", "Growth-focused"],
    industries: ["All industries"],
    experienceLevel: ["mid", "senior"],
    atsScore: 7,
    printOptimized: true,
    preview: "/templates/timeline-preview.png",
    thumbnail: "/templates/timeline-thumb.png",
    colorScheme: COLOR_SCHEMES.emerald,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["timeline-view"],
  },
  infographicLite: {
    id: "infographicLite",
    name: "Infographic Lite",
    description: "Subtle visual elements without overwhelming content",
    category: "creative",
    style: "creative",
    layout: "single-column",
    tags: ["infographic", "visual", "modern", "creative"],
    bestFor: ["Creative professionals", "Visual roles", "Modern industries"],
    industries: ["Design", "Marketing", "Media", "Technology"],
    experienceLevel: ["entry", "mid"],
    atsScore: 6,
    printOptimized: true,
    preview: "/templates/infographic-lite-preview.png",
    thumbnail: "/templates/infographic-lite-thumb.png",
    colorScheme: COLOR_SCHEMES.orange,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["icon-based", "color-customizable"],
  },
  portfolio: {
    id: "portfolio",
    name: "Portfolio",
    description: "Project showcase emphasis for creative professionals",
    category: "creative",
    style: "creative",
    layout: "single-column",
    tags: ["portfolio", "projects", "creative", "showcase"],
    bestFor: ["Designers", "Developers", "Creative professionals", "Project-based roles"],
    industries: ["Design", "Technology", "Media", "Creative Services"],
    experienceLevel: ["entry", "mid", "senior"],
    atsScore: 6,
    printOptimized: true,
    preview: "/templates/portfolio-preview.png",
    thumbnail: "/templates/portfolio-thumb.png",
    colorScheme: COLOR_SCHEMES.rose,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["portfolio-section", "projects-showcase"],
  },
  government: {
    id: "government",
    name: "Government",
    description: "Federal resume style with detailed formatting",
    category: "professional",
    style: "traditional",
    layout: "single-column",
    tags: ["government", "federal", "detailed", "traditional"],
    bestFor: ["Federal jobs", "Government positions", "Public sector"],
    industries: ["Government", "Public Sector", "Non-profit"],
    experienceLevel: ["mid", "senior"],
    atsScore: 10,
    printOptimized: true,
    preview: "/templates/government-preview.png",
    thumbnail: "/templates/government-thumb.png",
    colorScheme: COLOR_SCHEMES.neutral,
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "normal",
    features: ["ats-optimized", "two-page"],
  },
  // Phase 1 Continued - More Distinctive Templates
  professionalServices: {
    id: "professionalServices",
    name: "Professional Services",
    description: "Consulting and accounting focused with achievement metrics",
    category: "professional",
    style: "contemporary",
    layout: "single-column",
    tags: ["consulting", "accounting", "professional", "metrics"],
    bestFor: ["Consultants", "Accountants", "Professional services"],
    industries: ["Consulting", "Accounting", "Audit", "Advisory"],
    experienceLevel: ["mid", "senior"],
    atsScore: 9,
    printOptimized: true,
    preview: "/templates/professional-services-preview.png",
    thumbnail: "/templates/professional-services-thumb.png",
    colorScheme: COLOR_SCHEMES.blue,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["ats-optimized", "two-page"],
  },
  threeColumn: {
    id: "threeColumn",
    name: "Three Column",
    description: "Unique three-column layout with skills sidebar and highlights",
    category: "modern",
    style: "creative",
    layout: "two-column",
    tags: ["three-column", "sidebar", "highlights", "unique"],
    bestFor: ["Multi-talented professionals", "Skills-heavy roles", "Modern companies"],
    industries: ["Technology", "Creative", "Marketing"],
    experienceLevel: ["mid", "senior"],
    atsScore: 7,
    printOptimized: true,
    preview: "/templates/three-column-preview.png",
    thumbnail: "/templates/three-column-thumb.png",
    colorScheme: COLOR_SCHEMES.violet,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "compact",
    features: ["skills-visualization", "color-customizable"],
  },
  boldHeaders: {
    id: "boldHeaders",
    name: "Bold Headers",
    description: "Statement-making section headers with strong visual hierarchy",
    category: "creative",
    style: "bold",
    layout: "single-column",
    tags: ["bold", "statement", "modern", "strong"],
    bestFor: ["Confident professionals", "Leadership roles", "Making an impact"],
    industries: ["All industries"],
    experienceLevel: ["mid", "senior"],
    atsScore: 7,
    printOptimized: true,
    preview: "/templates/bold-headers-preview.png",
    thumbnail: "/templates/bold-headers-thumb.png",
    colorScheme: {
      primary: "#dc2626",
      secondary: "#991b1b",
      background: "#ffffff",
      text: "#111827",
      textLight: "#6b7280",
      border: "#e5e7eb",
    },
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["color-customizable"],
  },
  colorBlock: {
    id: "colorBlock",
    name: "Color Block",
    description: "Strategic color blocking for modern visual appeal",
    category: "creative",
    style: "creative",
    layout: "two-column",
    tags: ["color-block", "modern", "visual", "creative"],
    bestFor: ["Creative roles", "Modern companies", "Visual professionals"],
    industries: ["Design", "Marketing", "Media", "Tech"],
    experienceLevel: ["entry", "mid"],
    atsScore: 6,
    printOptimized: true,
    preview: "/templates/color-block-preview.png",
    thumbnail: "/templates/color-block-thumb.png",
    colorScheme: {
      primary: "#f59e0b",
      secondary: "#d97706",
      background: "#ffffff",
      text: "#111827",
      textLight: "#6b7280",
      border: "#e5e7eb",
    },
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["color-customizable", "icon-based"],
    isNew: true,
  },
  geometric: {
    id: "geometric",
    name: "Geometric",
    description: "Modern shapes and lines for contemporary appeal",
    category: "creative",
    style: "creative",
    layout: "single-column",
    tags: ["geometric", "shapes", "modern", "contemporary"],
    bestFor: ["Design-forward roles", "Tech companies", "Creative industries"],
    industries: ["Design", "Architecture", "Tech", "Startups"],
    experienceLevel: ["entry", "mid"],
    atsScore: 6,
    printOptimized: true,
    preview: "/templates/geometric-preview.png",
    thumbnail: "/templates/geometric-thumb.png",
    colorScheme: {
      primary: "#06b6d4",
      secondary: "#0891b2",
      background: "#ffffff",
      text: "#111827",
      textLight: "#6b7280",
      border: "#e5e7eb",
    },
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["color-customizable"],
  },
  borderAccent: {
    id: "borderAccent",
    name: "Border Accent",
    description: "Framed sections with colorful borders for emphasis",
    category: "modern",
    style: "contemporary",
    layout: "single-column",
    tags: ["border", "framed", "accent", "modern"],
    bestFor: ["Professional roles", "All experience levels", "Clear organization"],
    industries: ["All industries"],
    experienceLevel: ["entry", "mid", "senior"],
    atsScore: 8,
    printOptimized: true,
    preview: "/templates/border-accent-preview.png",
    thumbnail: "/templates/border-accent-thumb.png",
    colorScheme: COLOR_SCHEMES.emerald,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["ats-optimized", "color-customizable"],
    isPopular: true,
  },
  splitScreen: {
    id: "splitScreen",
    name: "Split Screen",
    description: "Distinct left-right content areas with contrasting backgrounds",
    category: "creative",
    style: "creative",
    layout: "two-column",
    tags: ["split", "two-tone", "contrast", "modern"],
    bestFor: ["Creative professionals", "Modern roles", "Visual impact"],
    industries: ["Design", "Marketing", "Media", "Tech"],
    experienceLevel: ["entry", "mid"],
    atsScore: 6,
    printOptimized: true,
    preview: "/templates/split-screen-preview.png",
    thumbnail: "/templates/split-screen-thumb.png",
    colorScheme: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      background: "#ffffff",
      text: "#111827",
      textLight: "#6b7280",
      border: "#e5e7eb",
    },
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "normal",
    features: ["color-customizable"],
  },
  magazineStyle: {
    id: "magazineStyle",
    name: "Magazine Style",
    description: "Editorial layout with multi-column text flow",
    category: "creative",
    style: "creative",
    layout: "two-column",
    tags: ["magazine", "editorial", "creative", "layout"],
    bestFor: ["Writers", "Editors", "Creative professionals", "Media roles"],
    industries: ["Media", "Publishing", "Journalism", "Content"],
    experienceLevel: ["entry", "mid", "senior"],
    atsScore: 5,
    printOptimized: true,
    preview: "/templates/magazine-style-preview.png",
    thumbnail: "/templates/magazine-style-thumb.png",
    colorScheme: {
      primary: "#4f46e5",
      secondary: "#4338ca",
      background: "#ffffff",
      text: "#111827",
      textLight: "#6b7280",
      border: "#e5e7eb",
    },
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "normal",
    features: ["color-customizable"],
  },
  compact: {
    id: "compact",
    name: "Compact",
    description: "Maximum information density for one-page resumes",
    category: "professional",
    style: "minimal",
    layout: "single-column",
    tags: ["compact", "dense", "one-page", "efficient"],
    bestFor: ["One-page requirement", "Entry-level", "Career switchers"],
    industries: ["All industries"],
    experienceLevel: ["entry", "mid"],
    atsScore: 9,
    printOptimized: true,
    preview: "/templates/compact-preview.png",
    thumbnail: "/templates/compact-thumb.png",
    colorScheme: COLOR_SCHEMES.neutral,
    typography: TYPOGRAPHY_PRESETS.modern,
    spacing: "compact",
    features: ["ats-optimized", "one-page"],
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Refined typography and generous spacing for sophistication",
    category: "professional",
    style: "minimal",
    layout: "single-column",
    tags: ["elegant", "refined", "sophisticated", "spacious"],
    bestFor: ["Senior roles", "Luxury brands", "Executive positions"],
    industries: ["Luxury", "Fashion", "Hospitality", "Executive"],
    experienceLevel: ["senior", "executive"],
    atsScore: 8,
    printOptimized: true,
    preview: "/templates/elegant-preview.png",
    thumbnail: "/templates/elegant-thumb.png",
    colorScheme: {
      primary: "#57534e",
      secondary: "#44403c",
      background: "#fafaf9",
      text: "#1c1917",
      textLight: "#78716c",
      border: "#e7e5e4",
    },
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "spacious",
    features: ["ats-optimized", "two-page"],
  },
  international: {
    id: "international",
    name: "International",
    description: "European CV style with photo support",
    category: "professional",
    style: "traditional",
    layout: "single-column",
    tags: ["international", "european", "cv", "photo"],
    bestFor: ["International jobs", "European positions", "Global roles"],
    industries: ["All industries"],
    experienceLevel: ["mid", "senior"],
    atsScore: 7,
    printOptimized: true,
    preview: "/templates/international-preview.png",
    thumbnail: "/templates/international-thumb.png",
    colorScheme: COLOR_SCHEMES.blue,
    typography: TYPOGRAPHY_PRESETS.classic,
    spacing: "normal",
    features: ["photo-support", "two-page"],
  },
};

/**
 * Template component registry
 * Note: New templates currently use existing template components as base.
 * Each will be replaced with custom implementations in future updates.
 */
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  // Original templates
  modern: {
    info: TEMPLATE_INFO.modern,
    component: ModernTemplate,
  },
  classic: {
    info: TEMPLATE_INFO.classic,
    component: ClassicTemplate,
  },
  minimal: {
    info: TEMPLATE_INFO.minimal,
    component: MinimalTemplate,
  },
  
  // Phase 1 templates with custom implementations
  executive: {
    info: TEMPLATE_INFO.executive,
    component: ExecutiveTemplate, // Custom executive template
  },
  academic: {
    info: TEMPLATE_INFO.academic,
    component: AcademicTemplate, // Custom academic CV template
  },
  corporate: {
    info: TEMPLATE_INFO.corporate,
    component: CorporateTemplate, // Conservative corporate template
  },
  techModern: {
    info: TEMPLATE_INFO.techModern,
    component: TechModernTemplate, // Custom tech modern template with sidebar
  },
  creativePro: {
    info: TEMPLATE_INFO.creativePro,
    component: CreativeProTemplate, // Custom creative template with gradient header
  },
  startup: {
    info: TEMPLATE_INFO.startup,
    component: StartupTemplate, // Custom startup template with compact layout
  },
  contemporary: {
    info: TEMPLATE_INFO.contemporary,
    component: ContemporaryTemplate, // Custom contemporary template with left borders
  },
  twoColumnPro: {
    info: TEMPLATE_INFO.twoColumnPro,
    component: TwoColumnTemplate, // Custom two-column template
  },
  timeline: {
    info: TEMPLATE_INFO.timeline,
    component: TimelineTemplate, // Custom timeline template
  },
  infographicLite: {
    info: TEMPLATE_INFO.infographicLite,
    component: InfographicLiteTemplate, // Custom infographic template with stats
  },
  portfolio: {
    info: TEMPLATE_INFO.portfolio,
    component: PortfolioTemplate, // Custom portfolio template with project cards
  },
  government: {
    info: TEMPLATE_INFO.government,
    component: GovernmentTemplate, // Custom government template with formal styling
  },
  
  // Phase 1B templates - custom implementations
  professionalServices: {
    info: TEMPLATE_INFO.professionalServices,
    component: ProfessionalServicesTemplate, // Custom professional services template
  },
  threeColumn: {
    info: TEMPLATE_INFO.threeColumn,
    component: ThreeColumnTemplate, // Custom three-column layout template
  },
  boldHeaders: {
    info: TEMPLATE_INFO.boldHeaders,
    component: BoldHeadersTemplate, // Custom bold headers template
  },
  colorBlock: {
    info: TEMPLATE_INFO.colorBlock,
    component: ColorBlockTemplate, // Custom color block template
  },
  geometric: {
    info: TEMPLATE_INFO.geometric,
    component: GeometricTemplate, // Custom geometric template with shapes
  },
  borderAccent: {
    info: TEMPLATE_INFO.borderAccent,
    component: BorderAccentTemplate, // Custom border accent template
  },
  splitScreen: {
    info: TEMPLATE_INFO.splitScreen,
    component: SplitScreenTemplate, // Custom split screen template
  },
  magazineStyle: {
    info: TEMPLATE_INFO.magazineStyle,
    component: MagazineStyleTemplate, // Custom magazine style template
  },
  compact: {
    info: TEMPLATE_INFO.compact,
    component: CompactTemplate, // Custom compact template
  },
  elegant: {
    info: TEMPLATE_INFO.elegant,
    component: ElegantTemplate, // Custom elegant template
  },
  international: {
    info: TEMPLATE_INFO.international,
    component: InternationalTemplate, // Custom international template
  },
};

/**
 * Get all template info
 */
export function getAllTemplates(): TemplateInfo[] {
  return Object.values(TEMPLATE_INFO);
}

/**
 * Get template info by ID
 */
export function getTemplateInfo(id: string): TemplateInfo | undefined {
  return TEMPLATE_INFO[id];
}

/**
 * Get template component by ID
 * Falls back to ModernTemplate if component not found
 */
export function getTemplateComponent(id: string) {
  return TEMPLATE_REGISTRY[id]?.component || ModernTemplate;
}

/**
 * Check if template exists
 */
export function templateExists(id: string): boolean {
  return id in TEMPLATE_INFO;
}

/**
 * Get template IDs
 */
export function getTemplateIds(): string[] {
  return Object.keys(TEMPLATE_INFO);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: TemplateInfo["category"]
): TemplateInfo[] {
  return getAllTemplates().filter((t) => t.category === category);
}

/**
 * Get templates by industry
 */
export function getTemplatesByIndustry(industry: string): TemplateInfo[] {
  return getAllTemplates().filter((t) => t.industries.includes(industry));
}

/**
 * Get templates by experience level
 */
export function getTemplatesByExperience(
  level: "entry" | "mid" | "senior" | "executive"
): TemplateInfo[] {
  return getAllTemplates().filter((t) => t.experienceLevel?.includes(level));
}
