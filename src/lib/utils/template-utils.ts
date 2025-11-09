/**
 * Template Utilities
 * Helper functions for working with templates
 */

import type {
  TemplateInfo,
  TemplateFilterOptions,
  TemplateSortBy,
  TemplateSortOrder,
  TemplateConfig,
  ColorScheme,
  Typography,
} from "@/lib/types/templates";
import { COLOR_SCHEMES, TYPOGRAPHY_PRESETS } from "@/lib/types/templates";

/**
 * Filter templates based on criteria
 */
export function filterTemplates(
  templates: TemplateInfo[],
  filters: TemplateFilterOptions
): TemplateInfo[] {
  return templates.filter((template) => {
    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(template.category)) return false;
    }

    // Style filter
    if (filters.style && filters.style.length > 0) {
      if (!filters.style.includes(template.style)) return false;
    }

    // Layout filter
    if (filters.layout && filters.layout.length > 0) {
      if (!filters.layout.includes(template.layout)) return false;
    }

    // Industries filter
    if (filters.industries && filters.industries.length > 0) {
      const hasMatchingIndustry = filters.industries.some((industry) =>
        template.industries.includes(industry)
      );
      if (!hasMatchingIndustry) return false;
    }

    // Experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      if (!template.experienceLevel) return false;
      const hasMatchingLevel = filters.experienceLevel.some((level) =>
        template.experienceLevel?.includes(level)
      );
      if (!hasMatchingLevel) return false;
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      const hasMatchingFeature = filters.features.some((feature) =>
        template.features.includes(feature)
      );
      if (!hasMatchingFeature) return false;
    }

    // ATS score filter
    if (filters.atsScoreMin !== undefined) {
      if (template.atsScore < filters.atsScoreMin) return false;
    }

    // Premium filter
    if (filters.isPremium !== undefined) {
      if (template.isPremium !== filters.isPremium) return false;
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        template.industries.some((industry) =>
          industry.toLowerCase().includes(searchLower)
        );
      if (!matchesSearch) return false;
    }

    return true;
  });
}

/**
 * Sort templates
 */
export function sortTemplates(
  templates: TemplateInfo[],
  sortBy: TemplateSortBy,
  order: TemplateSortOrder = "asc"
): TemplateInfo[] {
  const sorted = [...templates];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "ats-score":
        comparison = a.atsScore - b.atsScore;
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "popular":
        // Popular templates first (assuming isPopular flag)
        comparison = (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        break;
      case "newest":
        // New templates first (assuming isNew flag)
        comparison = (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        break;
      default:
        comparison = 0;
    }

    return order === "asc" ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Get color scheme by name
 */
export function getColorScheme(name: string): ColorScheme {
  return COLOR_SCHEMES[name] || COLOR_SCHEMES.purple;
}

/**
 * Get typography preset by name
 */
export function getTypography(name: string): Typography {
  return TYPOGRAPHY_PRESETS[name] || TYPOGRAPHY_PRESETS.modern;
}

/**
 * Merge template config with defaults
 */
export function mergeTemplateConfig(
  defaultConfig: Partial<TemplateConfig>,
  userConfig?: TemplateConfig
): TemplateConfig {
  if (!userConfig) return defaultConfig as TemplateConfig;

  return {
    colorScheme: { ...defaultConfig.colorScheme, ...userConfig.colorScheme },
    typography: { ...defaultConfig.typography, ...userConfig.typography },
    spacing: userConfig.spacing || defaultConfig.spacing || "normal",
    showPhoto: userConfig.showPhoto ?? defaultConfig.showPhoto ?? false,
    showIcons: userConfig.showIcons ?? defaultConfig.showIcons ?? true,
    sections: { ...defaultConfig.sections, ...userConfig.sections },
    sectionOrder: userConfig.sectionOrder || defaultConfig.sectionOrder,
    pageCount: userConfig.pageCount || defaultConfig.pageCount || 1,
  };
}

/**
 * Calculate template match score for a user
 * Higher score = better match
 */
export function calculateTemplateMatchScore(
  template: TemplateInfo,
  userProfile: {
    industry?: string;
    experienceLevel?: "entry" | "mid" | "senior" | "executive";
    preferences?: {
      style?: string[];
      features?: string[];
    };
  }
): number {
  let score = 0;

  // Industry match (high weight)
  if (userProfile.industry) {
    if (template.industries.includes(userProfile.industry)) {
      score += 50;
    }
  }

  // Experience level match (medium weight)
  if (userProfile.experienceLevel) {
    if (template.experienceLevel?.includes(userProfile.experienceLevel)) {
      score += 30;
    }
  }

  // Style preference match (low weight)
  if (userProfile.preferences?.style) {
    if (userProfile.preferences.style.includes(template.style)) {
      score += 10;
    }
  }

  // Feature preference match (low weight)
  if (userProfile.preferences?.features) {
    const matchingFeatures = userProfile.preferences.features.filter(
      (feature) => template.features.includes(feature as any)
    );
    score += matchingFeatures.length * 5;
  }

  // ATS score bonus
  score += template.atsScore;

  return score;
}

/**
 * Get recommended templates for a user
 */
export function getRecommendedTemplates(
  templates: TemplateInfo[],
  userProfile: {
    industry?: string;
    experienceLevel?: "entry" | "mid" | "senior" | "executive";
    preferences?: {
      style?: string[];
      features?: string[];
    };
  },
  limit: number = 5
): TemplateInfo[] {
  const scored = templates.map((template) => ({
    template,
    score: calculateTemplateMatchScore(template, userProfile),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.template);
}

/**
 * Group templates by category
 */
export function groupTemplatesByCategory(
  templates: TemplateInfo[]
): Record<string, TemplateInfo[]> {
  return templates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, TemplateInfo[]>
  );
}

/**
 * Get popular templates
 */
export function getPopularTemplates(
  templates: TemplateInfo[],
  limit: number = 10
): TemplateInfo[] {
  return templates.filter((t) => t.isPopular).slice(0, limit);
}

/**
 * Get new templates
 */
export function getNewTemplates(
  templates: TemplateInfo[],
  limit: number = 10
): TemplateInfo[] {
  return templates.filter((t) => t.isNew).slice(0, limit);
}

/**
 * Get ATS-optimized templates
 */
export function getATSTemplates(
  templates: TemplateInfo[],
  minScore: number = 8
): TemplateInfo[] {
  return templates.filter((t) => t.atsScore >= minScore);
}
