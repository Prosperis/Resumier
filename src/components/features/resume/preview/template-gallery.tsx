/**
 * Template Gallery
 * Full-screen template selection portal with previews, filtering, and search
 */

import { useState, useMemo, useCallback, memo, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  TrendingUp,
  Award,
  Filter,
  Grid3x3,
  LayoutGrid,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Resume } from "@/lib/api/types";
import type { TemplateType, TemplateInfo, TemplateCategory } from "@/lib/types/templates";
import { getAllTemplates } from "./templates/template-registry";

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: TemplateType;
  onSelect: (template: TemplateType) => void;
  resume?: Resume; // Optional: for live preview
}

type ViewMode = "grid" | "list";
type FilterCategory = "all" | TemplateCategory;

const FAVORITES_STORAGE_KEY = "resumier-favorite-templates";

function useFavoriteTemplates() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.warn("Failed to save favorites to localStorage:", error);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((templateId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((templateId: string) => favorites.has(templateId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}

export function TemplateGallery({ open, onOpenChange, selected, onSelect }: TemplateGalleryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FilterCategory>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toggleFavorite, isFavorite, favorites } = useFavoriteTemplates();

  // Defer rendering of templates until after modal animation to avoid forced reflow
  const [isReady, setIsReady] = useState(false);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      // Defer template rendering until after the dialog animation
      readyTimeoutRef.current = setTimeout(() => {
        setIsReady(true);
      }, 50);
    } else {
      setIsReady(false);
      if (readyTimeoutRef.current) {
        clearTimeout(readyTimeoutRef.current);
      }
    }
    return () => {
      if (readyTimeoutRef.current) {
        clearTimeout(readyTimeoutRef.current);
      }
    };
  }, [open]);

  // Cache templates to prevent re-fetching
  const allTemplates = useMemo(() => getAllTemplates(), []);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = allTemplates;

    // Filter by favorites first (if enabled)
    if (showFavoritesOnly) {
      filtered = filtered.filter((t: TemplateInfo) => favorites.has(t.id));
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((t: TemplateInfo) => t.category === category);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (t: TemplateInfo) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
          t.industries.some((ind: string) => ind.toLowerCase().includes(searchLower)),
      );
    }

    return filtered;
  }, [allTemplates, category, search, showFavoritesOnly, favorites]);

  const handleSelectTemplate = useCallback(
    (templateId: string) => {
      onSelect(templateId as TemplateType);
      onOpenChange(false);
    },
    [onSelect, onOpenChange],
  );

  const categories: { id: FilterCategory; label: string; icon?: any }[] = [
    { id: "all", label: "All Templates" },
    { id: "professional", label: "Professional" },
    { id: "modern", label: "Modern" },
    { id: "creative", label: "Creative" },
    { id: "industry-specific", label: "Industry" },
    { id: "experience-level", label: "Experience" },
    { id: "specialized", label: "Specialized" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b dark:border-gray-700">
          <div>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-violet-600" />
              Choose Your Template
            </DialogTitle>
            <DialogDescription className="mt-1">
              Select from {allTemplates.length} professional resume templates
            </DialogDescription>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search templates by name, industry, or style..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Favorites Filter Toggle */}
            <Button
              variant={showFavoritesOnly ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="gap-2"
            >
              <Star
                className={`h-4 w-4 ${
                  showFavoritesOnly ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
                }`}
              />
              Favorites
              {favorites.size > 0 && (
                <span className="ml-1 text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded-full">
                  {favorites.size}
                </span>
              )}
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-56 border-r dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 py-4 px-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </p>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    category === cat.id
                      ? "bg-violet-100 dark:bg-violet-950 text-violet-900 dark:text-violet-200 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid/List */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="py-6">
              {/* Results Count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredTemplates.length} template
                  {filteredTemplates.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Empty State */}
              {filteredTemplates.length === 0 && isReady && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Filter className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No templates found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Loading State - shown briefly while deferring render */}
              {!isReady && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* Grid View */}
              {isReady && viewMode === "grid" && filteredTemplates.length > 0 && (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  style={{ contentVisibility: "auto" }}
                >
                  {filteredTemplates.map((template: TemplateInfo) => (
                    <MemoTemplateCard
                      key={template.id}
                      template={template}
                      selected={selected === template.id}
                      onSelect={() => handleSelectTemplate(template.id)}
                      isFavorite={isFavorite(template.id)}
                      onToggleFavorite={() => toggleFavorite(template.id)}
                    />
                  ))}
                </div>
              )}

              {/* List View */}
              {isReady && viewMode === "list" && filteredTemplates.length > 0 && (
                <div className="space-y-3" style={{ contentVisibility: "auto" }}>
                  {filteredTemplates.map((template: TemplateInfo) => (
                    <MemoTemplateListItem
                      key={template.id}
                      template={template}
                      selected={selected === template.id}
                      onSelect={() => handleSelectTemplate(template.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Template Preview Mini - Shows actual template layout
 * Memoized to prevent unnecessary re-renders
 * Simplified for performance - uses CSS instead of complex DOM
 */
const TemplatePreviewMini = memo(function TemplatePreviewMini({
  template,
}: {
  template: TemplateInfo;
}) {
  const colorScheme = template.colorScheme || {
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    background: "#ffffff",
    text: "#111827",
    textLight: "#6b7280",
    border: "#e5e7eb",
  };
  const { layout } = template;

  // Lightweight: use CSS gradient as background to simulate layout
  const bgStyle = {
    backgroundColor: colorScheme.background,
    backgroundImage:
      layout === "two-column"
        ? `linear-gradient(90deg, ${colorScheme.primary}15 65%, ${colorScheme.primary}25 65%)`
        : undefined,
  } as React.CSSProperties;

  // EXISTING TEMPLATES WITH COMPONENTS

  // Modern template - Two column with colored header (Full page)
  if (template.id === "modern") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight">
        {/* Colored header */}
        <div className="p-3 space-y-1" style={{ backgroundColor: colorScheme.primary }}>
          <div className="h-2 w-20 bg-white/90 rounded" />
          <div className="h-1 w-16 bg-white/70 rounded" />
        </div>
        {/* Two column content */}
        <div className="flex flex-1 gap-2 p-2">
          {/* Main content - 2/3 */}
          <div className="flex-[2] space-y-2">
            {/* Experience section */}
            <div className="space-y-1">
              <div
                className="h-1.5 w-14 rounded"
                style={{ backgroundColor: colorScheme.primary, opacity: 0.8 }}
              />
              <div className="h-1 w-full bg-gray-300 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
            </div>
            {/* Second experience entry */}
            <div className="space-y-1">
              <div className="h-1 w-full bg-gray-300 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
            </div>
            {/* Education section */}
            <div className="space-y-1">
              <div
                className="h-1.5 w-12 rounded"
                style={{ backgroundColor: colorScheme.primary, opacity: 0.8 }}
              />
              <div className="h-1 w-full bg-gray-300 rounded" />
              <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
            </div>
            {/* Projects section */}
            <div className="space-y-1">
              <div
                className="h-1.5 w-10 rounded"
                style={{ backgroundColor: colorScheme.primary, opacity: 0.8 }}
              />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
            </div>
          </div>
          {/* Sidebar - 1/3 */}
          <div className="flex-1 space-y-2">
            {/* Contact section */}
            <div className="space-y-1">
              <div
                className="h-1.5 w-10 rounded"
                style={{ backgroundColor: colorScheme.primary, opacity: 0.8 }}
              />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
            </div>
            {/* Skills section */}
            <div className="space-y-1">
              <div
                className="h-1.5 w-8 rounded"
                style={{ backgroundColor: colorScheme.primary, opacity: 0.8 }}
              />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
              <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
            </div>
            {/* Languages section */}
            <div className="space-y-1">
              <div
                className="h-1.5 w-11 rounded"
                style={{ backgroundColor: colorScheme.primary, opacity: 0.8 }}
              />
              <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
              <div className="h-0.5 w-2/3 bg-gray-200 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic template - Single column, centered header (Full page)
  if (template.id === "classic") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-3">
        {/* Centered header */}
        <div className="space-y-1 text-center border-b-2 border-gray-800 pb-2 mb-2">
          <div className="h-2.5 w-28 bg-gray-800 rounded mx-auto" />
          <div className="h-1 w-20 bg-gray-600 rounded mx-auto" />
          <div className="h-0.5 w-24 bg-gray-500 rounded mx-auto" />
        </div>
        {/* Single column content */}
        <div className="space-y-2">
          {/* Professional Summary */}
          <div className="space-y-1">
            <div className="h-1.5 w-20 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
          {/* Experience section */}
          <div className="space-y-1">
            <div className="h-1.5 w-18 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-1 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
          </div>
          {/* Second experience */}
          <div className="space-y-1">
            <div className="h-1 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
          </div>
          {/* Education section */}
          <div className="space-y-1">
            <div className="h-1.5 w-16 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-1 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
          {/* Skills section */}
          <div className="space-y-1">
            <div className="h-1.5 w-12 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
            <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Minimal template - Clean, lots of whitespace (Full page)
  if (template.id === "minimal") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-relaxed p-4">
        {/* Minimalist header */}
        <div className="space-y-1.5 mb-3">
          <div className="h-3 w-32 rounded" style={{ backgroundColor: colorScheme.text }} />
          <div className="h-1 w-24 bg-gray-400 rounded" />
          <div className="h-0.5 w-28 bg-gray-300 rounded" />
        </div>
        {/* Spacious content - more sections */}
        <div className="space-y-3">
          {/* Summary */}
          <div className="space-y-1">
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-11/12 bg-gray-200 rounded" />
          </div>
          {/* Experience */}
          <div className="space-y-1">
            <div className="h-1.5 w-20 bg-gray-700 rounded" />
            <div className="h-1 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
          {/* Second experience */}
          <div className="space-y-1">
            <div className="h-1 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-200 rounded" />
          </div>
          {/* Education */}
          <div className="space-y-1">
            <div className="h-1.5 w-18 bg-gray-700 rounded" />
            <div className="h-1 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
          </div>
          {/* Skills */}
          <div className="space-y-1">
            <div className="h-1.5 w-14 bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
            <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // NEW TEMPLATES - PHASE 1

  // Executive - Bold serif with thick border
  if (template.id === "executive") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-3 font-serif">
        {/* Thick border header */}
        <div className="border-b-4 border-gray-900 pb-2 mb-2">
          <div className="h-3 w-28 bg-gray-900 rounded mb-1" />
          <div className="h-1.5 w-20 bg-gray-600 rounded mb-1" />
          <div className="flex gap-2">
            <div className="h-0.5 w-10 bg-gray-600 rounded" />
            <div className="h-0.5 w-10 bg-gray-600 rounded" />
          </div>
        </div>
        {/* Executive Profile */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="h-1.5 w-18 bg-gray-900 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded italic" />
            <div className="h-0.5 w-full bg-gray-300 rounded italic" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-24 bg-gray-900 rounded" />
            <div className="h-1 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Academic - Centered with underlines
  if (template.id === "academic") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-3 font-serif">
        {/* Centered header with border */}
        <div className="text-center border-b-2 border-gray-400 pb-2 mb-2">
          <div className="h-2.5 w-24 bg-gray-900 rounded mx-auto mb-1" />
          <div className="h-1 w-20 bg-gray-600 rounded mx-auto mb-1" />
          <div className="h-0.5 w-16 bg-gray-500 rounded mx-auto" />
        </div>
        {/* CV Sections with underlines */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="h-1 w-16 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-14 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-3/4 bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-22 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-18 bg-gray-800 rounded border-b border-gray-800" />
            <div className="h-0.5 w-5/6 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Corporate - Ultra conservative with uppercase
  if (template.id === "corporate") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-3 font-serif">
        {/* Centered uppercase header */}
        <div className="text-center border-b border-gray-300 pb-2 mb-2">
          <div className="h-2 w-28 bg-gray-900 rounded mx-auto mb-1" />
          <div className="h-0.5 w-20 bg-gray-600 rounded mx-auto" />
        </div>
        {/* Conservative sections */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="h-1 w-20 bg-gray-800 rounded border-b border-gray-300" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-24 bg-gray-800 rounded border-b border-gray-300" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Tech Modern - Blue with sidebar and progress bars
  if (template.id === "techModern") {
    return (
      <div className="w-full h-full flex text-[4px] leading-tight">
        {/* Blue header */}
        <div className="absolute top-0 left-0 right-0 p-2 bg-blue-600">
          <div className="h-2 w-20 bg-white/90 rounded mb-0.5" />
          <div className="h-0.5 w-16 bg-white/70 rounded" />
        </div>
        <div className="flex gap-2 pt-10 p-2 w-full">
          {/* Main content */}
          <div className="flex-[2] space-y-2">
            <div className="space-y-1">
              <div className="h-1 w-12 bg-blue-600 rounded" />
              <div className="h-0.5 w-full bg-gray-300 rounded" />
              <div className="h-0.5 w-full bg-gray-200 rounded" />
            </div>
          </div>
          {/* Sidebar with skills */}
          <div className="flex-1 bg-gray-50 p-2 space-y-2">
            <div className="h-1 w-8 bg-blue-600 rounded" />
            <div className="space-y-1">
              <div className="h-0.5 w-full bg-gray-300 rounded" />
              <div className="h-1 w-4/5 bg-blue-600 rounded" />
              <div className="h-0.5 w-full bg-gray-300 rounded" />
              <div className="h-1 w-3/4 bg-blue-600 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Creative Professional - Gradient header with rounded elements
  if (template.id === "creativePro") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight">
        {/* Gradient header */}
        <div
          className="p-3 space-y-1"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="h-2 w-20 bg-white/90 rounded" />
          <div className="h-1 w-16 bg-white/70 rounded" />
        </div>
        <div className="p-2 space-y-2">
          {/* Colored badge-style summary */}
          <div className="p-2 bg-purple-50 rounded border-l-2 border-purple-600">
            <div className="h-0.5 w-full bg-purple-300 rounded" />
          </div>
          {/* Experience with colored dates */}
          <div className="space-y-1 pl-2 border-l-2 border-purple-200">
            <div className="h-1 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-12 bg-purple-600 rounded-full px-1" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          {/* Tags */}
          <div className="flex gap-1 flex-wrap">
            <div className="h-1 w-8 bg-purple-200 rounded-full" />
            <div className="h-1 w-6 bg-purple-200 rounded-full" />
            <div className="h-1 w-10 bg-purple-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Startup - Teal with compact dynamic layout
  if (template.id === "startup") {
    return (
      <div className="w-full h-full flex flex-col text-[3px] leading-tight p-2">
        {/* Compact header */}
        <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-teal-600">
          <div>
            <div className="h-2 w-16 bg-gray-900 rounded mb-0.5" />
            <div className="h-0.5 w-12 bg-teal-600 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-8 bg-gray-600 rounded" />
            <div className="h-0.5 w-8 bg-gray-600 rounded" />
          </div>
        </div>
        {/* Compact sections */}
        <div className="space-y-1.5">
          <div className="space-y-0.5">
            <div className="h-1 w-10 bg-teal-600 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-200 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-1">
            <div className="flex-1 p-1 bg-teal-50 rounded">
              <div className="h-0.5 w-full bg-teal-600 rounded" />
            </div>
            <div className="flex-1 p-1 bg-teal-50 rounded">
              <div className="h-0.5 w-full bg-teal-600 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contemporary - Slate with clean spacing
  if (template.id === "contemporary") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-3">
        {/* Clean header */}
        <div className="mb-3">
          <div className="h-2.5 w-24 bg-slate-800 rounded mb-1" />
          <div className="h-1 w-18 bg-slate-600 rounded mb-2" />
          <div className="flex gap-2">
            <div className="h-0.5 w-10 bg-slate-500 rounded" />
            <div className="h-0.5 w-12 bg-slate-500 rounded" />
          </div>
        </div>
        {/* Contemporary sections with side accents */}
        <div className="space-y-2">
          <div className="pl-2 border-l-2 border-slate-600 space-y-1">
            <div className="h-1.5 w-14 bg-slate-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-200 rounded" />
          </div>
          <div className="pl-2 border-l-2 border-slate-300 space-y-1">
            <div className="h-1.5 w-12 bg-slate-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Two Column Pro - Indigo with prominent sidebar
  if (template.id === "twoColumnPro") {
    return (
      <div className="w-full h-full flex gap-2 text-[4px] leading-tight p-2">
        {/* Sidebar */}
        <div className="w-1/3 bg-indigo-50 p-2 space-y-2">
          <div className="space-y-1">
            <div className="h-1.5 w-10 bg-indigo-700 rounded" />
            <div className="h-0.5 w-full bg-indigo-300 rounded" />
            <div className="h-0.5 w-3/4 bg-indigo-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-8 bg-indigo-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-12 bg-indigo-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 space-y-2">
          <div className="mb-2">
            <div className="h-2 w-20 bg-gray-900 rounded mb-1" />
            <div className="h-1 w-16 bg-gray-600 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-16 bg-indigo-700 rounded" />
            <div className="h-1 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Timeline - Emerald with timeline dots
  if (template.id === "timeline") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-3">
        {/* Header */}
        <div className="mb-2">
          <div className="h-2 w-20 bg-gray-900 rounded mb-1" />
          <div className="h-0.5 w-16 bg-emerald-600 rounded" />
        </div>
        {/* Timeline entries */}
        <div className="space-y-2 relative">
          {/* Timeline line */}
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-emerald-300" />

          <div className="pl-3 relative">
            <div className="absolute left-0 top-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            <div className="h-1 w-full bg-gray-700 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>

          <div className="pl-3 relative">
            <div className="absolute left-0 top-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <div className="h-1 w-full bg-gray-700 rounded mb-0.5" />
            <div className="h-0.5 w-4/5 bg-gray-300 rounded" />
          </div>

          <div className="pl-3 relative">
            <div className="absolute left-0 top-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <div className="h-1 w-full bg-gray-700 rounded mb-0.5" />
            <div className="h-0.5 w-3/4 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Infographic Lite - Orange with visual elements
  if (template.id === "infographicLite") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-2">
        {/* Header with icon placeholder */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
          <div>
            <div className="h-2 w-16 bg-gray-900 rounded mb-0.5" />
            <div className="h-0.5 w-12 bg-orange-600 rounded" />
          </div>
        </div>
        {/* Visual stats */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="p-1 bg-orange-50 rounded text-center">
            <div className="h-1.5 w-full bg-orange-600 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-orange-300 rounded" />
          </div>
          <div className="p-1 bg-orange-50 rounded text-center">
            <div className="h-1.5 w-full bg-orange-600 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-orange-300 rounded" />
          </div>
          <div className="p-1 bg-orange-50 rounded text-center">
            <div className="h-1.5 w-full bg-orange-600 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-orange-300 rounded" />
          </div>
        </div>
        {/* Content with icons */}
        <div className="space-y-1.5">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded" />
            <div className="flex-1 space-y-0.5">
              <div className="h-0.5 w-full bg-gray-700 rounded" />
              <div className="h-0.5 w-4/5 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-orange-400 rounded" />
            <div className="flex-1 space-y-0.5">
              <div className="h-0.5 w-full bg-gray-700 rounded" />
              <div className="h-0.5 w-3/4 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Portfolio - Rose with project cards
  if (template.id === "portfolio") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-2">
        {/* Header */}
        <div className="mb-2">
          <div className="h-2.5 w-20 bg-rose-600 rounded mb-1" />
          <div className="h-0.5 w-16 bg-gray-600 rounded" />
        </div>
        {/* Project cards */}
        <div className="space-y-1.5">
          <div className="p-1.5 bg-rose-50 rounded border border-rose-200">
            <div className="h-6 w-full bg-rose-200 rounded mb-1" />
            <div className="h-1 w-full bg-rose-700 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="p-1.5 bg-rose-50 rounded border border-rose-200">
            <div className="h-6 w-full bg-rose-200 rounded mb-1" />
            <div className="h-1 w-full bg-rose-700 rounded mb-0.5" />
            <div className="h-0.5 w-3/4 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Government - Federal style with detailed format
  if (template.id === "government") {
    return (
      <div className="w-full h-full flex flex-col text-[3px] leading-tight p-3 font-serif">
        {/* Government header */}
        <div className="text-center border-t-2 border-b-2 border-gray-700 py-1 mb-2">
          <div className="h-1.5 w-24 bg-gray-900 rounded mx-auto mb-0.5" />
          <div className="h-0.5 w-20 bg-gray-600 rounded mx-auto mb-0.5" />
          <div className="h-0.5 w-16 bg-gray-500 rounded mx-auto" />
        </div>
        {/* Detailed sections */}
        <div className="space-y-1.5">
          <div className="space-y-0.5">
            <div className="h-1 w-full bg-gray-800 rounded uppercase" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-300 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="h-1 w-full bg-gray-800 rounded uppercase" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="h-1 w-full bg-gray-800 rounded uppercase" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Professional Services - Consulting with metrics boxes
  if (template.id === "professionalServices") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-2">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 pb-2 border-b-2 border-blue-600">
          <div>
            <div className="h-2 w-20 bg-gray-900 rounded mb-0.5" />
            <div className="h-1 w-16 bg-blue-600 rounded" />
          </div>
          <div className="text-right space-y-0.5">
            <div className="h-0.5 w-10 bg-gray-600 rounded ml-auto" />
            <div className="h-0.5 w-12 bg-gray-600 rounded ml-auto" />
          </div>
        </div>
        {/* Achievement metrics */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="p-1 bg-blue-50 rounded border-l-2 border-blue-600">
            <div className="h-1.5 w-full bg-blue-700 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-blue-300 rounded" />
          </div>
          <div className="p-1 bg-blue-50 rounded border-l-2 border-blue-600">
            <div className="h-1.5 w-full bg-blue-700 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-blue-300 rounded" />
          </div>
          <div className="p-1 bg-blue-50 rounded border-l-2 border-blue-600">
            <div className="h-1.5 w-full bg-blue-700 rounded mb-0.5" />
            <div className="h-0.5 w-full bg-blue-300 rounded" />
          </div>
        </div>
        {/* Content */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="h-1.5 w-16 bg-blue-700 rounded" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="flex gap-1">
              <div className="h-0.5 w-8 bg-blue-200 rounded-full px-1" />
              <div className="h-0.5 w-10 bg-blue-200 rounded-full px-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Three Column - Unique 3-column layout
  if (template.id === "threeColumn") {
    return (
      <div className="w-full h-full flex gap-1 text-[3px] leading-tight p-1">
        {/* Left sidebar - Skills */}
        <div className="w-1/4 bg-violet-100 p-1.5 space-y-1">
          <div className="h-1 w-full bg-violet-700 rounded" />
          <div className="space-y-0.5">
            <div className="h-0.5 w-full bg-violet-400 rounded" />
            <div className="h-0.5 w-3/4 bg-violet-400 rounded" />
            <div className="h-0.5 w-full bg-violet-400 rounded" />
          </div>
        </div>
        {/* Center - Main content */}
        <div className="flex-1 p-1.5 space-y-1.5">
          <div>
            <div className="h-2 w-16 bg-gray-900 rounded mb-0.5" />
            <div className="h-0.5 w-12 bg-violet-600 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="h-1 w-12 bg-violet-600 rounded" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
        {/* Right sidebar - Highlights */}
        <div className="w-1/4 bg-violet-50 p-1.5 space-y-1">
          <div className="h-1 w-full bg-violet-700 rounded" />
          <div className="p-1 bg-violet-200 rounded">
            <div className="h-0.5 w-full bg-violet-700 rounded" />
          </div>
          <div className="p-1 bg-violet-200 rounded">
            <div className="h-0.5 w-full bg-violet-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Bold Headers - Statement-making headers
  if (template.id === "boldHeaders") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-3">
        {/* Name */}
        <div className="mb-2">
          <div className="h-4 w-28 bg-red-600 rounded mb-1" />
          <div className="h-0.5 w-16 bg-gray-600 rounded" />
        </div>
        {/* Bold section headers */}
        <div className="space-y-2">
          <div>
            <div className="h-2.5 w-20 bg-red-600 text-white rounded px-1 mb-1" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div>
            <div className="h-2.5 w-16 bg-red-600 text-white rounded px-1 mb-1" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-300 rounded" />
          </div>
          <div>
            <div className="h-2.5 w-12 bg-red-600 text-white rounded px-1 mb-1" />
            <div className="flex gap-1 flex-wrap">
              <div className="h-0.5 w-8 bg-gray-600 rounded" />
              <div className="h-0.5 w-10 bg-gray-600 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Color Block - Strategic color blocks
  if (template.id === "colorBlock") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight">
        {/* Top color block */}
        <div className="h-8 bg-amber-500 p-2 flex items-center">
          <div>
            <div className="h-2 w-20 bg-white rounded mb-0.5" />
            <div className="h-0.5 w-14 bg-white/80 rounded" />
          </div>
        </div>
        <div className="flex flex-1">
          {/* Main content */}
          <div className="flex-1 p-2 space-y-2">
            <div className="space-y-1">
              <div className="h-1.5 w-14 bg-amber-600 rounded" />
              <div className="h-0.5 w-full bg-gray-700 rounded" />
              <div className="h-0.5 w-full bg-gray-300 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-12 bg-amber-600 rounded" />
              <div className="h-0.5 w-full bg-gray-300 rounded" />
            </div>
          </div>
          {/* Side color block */}
          <div className="w-1/3 bg-amber-100 p-2 space-y-1.5">
            <div className="h-1 w-full bg-amber-700 rounded" />
            <div className="h-0.5 w-full bg-amber-400 rounded" />
            <div className="h-0.5 w-3/4 bg-amber-400 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Geometric - Modern shapes
  if (template.id === "geometric") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-2 relative">
        {/* Geometric shapes in background */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-200 opacity-30 rotate-45" />
        <div className="absolute bottom-0 left-2 w-8 h-8 bg-cyan-300 opacity-30 rounded-full" />

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-600 rotate-45" />
            <div>
              <div className="h-2 w-20 bg-gray-900 rounded mb-0.5" />
              <div className="h-0.5 w-16 bg-cyan-600 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="pl-2 border-l-4 border-cyan-600 space-y-1">
              <div className="h-1.5 w-14 bg-cyan-700 rounded" />
              <div className="h-0.5 w-full bg-gray-700 rounded" />
              <div className="h-0.5 w-4/5 bg-gray-300 rounded" />
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-cyan-500" />
              <div className="flex-1 space-y-0.5">
                <div className="h-0.5 w-full bg-gray-700 rounded" />
                <div className="h-0.5 w-3/4 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Border Accent - Framed sections
  if (template.id === "borderAccent") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-2">
        {/* Header */}
        <div className="mb-2 p-2 border-2 border-emerald-600 rounded">
          <div className="h-2 w-20 bg-gray-900 rounded mb-0.5" />
          <div className="h-0.5 w-16 bg-emerald-600 rounded" />
        </div>
        {/* Framed sections */}
        <div className="space-y-2">
          <div className="p-1.5 border-l-4 border-emerald-600 bg-emerald-50">
            <div className="h-1.5 w-12 bg-emerald-700 rounded mb-1" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="p-1.5 border-2 border-emerald-300 rounded">
            <div className="h-1.5 w-10 bg-emerald-700 rounded mb-1" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="p-1.5 border-l-4 border-emerald-400">
            <div className="h-1.5 w-8 bg-emerald-700 rounded mb-1" />
            <div className="h-0.5 w-3/4 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Split Screen - Two-tone layout
  if (template.id === "splitScreen") {
    return (
      <div className="w-full h-full flex text-[4px] leading-tight">
        {/* Dark left side */}
        <div className="w-2/5 bg-purple-900 text-white p-2 space-y-2">
          <div className="h-2.5 w-full bg-white rounded" />
          <div className="space-y-1">
            <div className="h-1 w-full bg-purple-300 rounded" />
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-purple-200 rounded" />
              <div className="h-0.5 w-3/4 bg-purple-200 rounded" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1 w-full bg-purple-300 rounded" />
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-purple-200 rounded" />
              <div className="h-0.5 w-4/5 bg-purple-200 rounded" />
            </div>
          </div>
        </div>
        {/* Light right side */}
        <div className="flex-1 bg-white p-2 space-y-2">
          <div className="space-y-1">
            <div className="h-1.5 w-16 bg-purple-700 rounded" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-14 bg-purple-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Magazine Style - Editorial columns
  if (template.id === "magazineStyle") {
    return (
      <div className="w-full h-full flex flex-col text-[3px] leading-tight p-2 font-serif">
        {/* Magazine header */}
        <div className="mb-2 pb-1 border-b-2 border-indigo-600">
          <div className="flex justify-between items-end">
            <div>
              <div className="h-2.5 w-20 bg-gray-900 rounded mb-0.5" />
              <div className="h-0.5 w-14 bg-indigo-600 rounded" />
            </div>
            <div className="h-0.5 w-10 bg-gray-500 rounded" />
          </div>
        </div>
        {/* Multi-column text */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-1 w-full bg-indigo-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-3/4 bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-full bg-indigo-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-5/6 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Compact - Maximum density
  if (template.id === "compact") {
    return (
      <div className="w-full h-full flex flex-col text-[2.5px] leading-tight p-2">
        {/* Compact header */}
        <div className="mb-1">
          <div className="h-1.5 w-20 bg-gray-900 rounded mb-0.5" />
          <div className="flex gap-2 text-[2px]">
            <div className="h-0.5 w-8 bg-gray-600 rounded" />
            <div className="h-0.5 w-8 bg-gray-600 rounded" />
            <div className="h-0.5 w-10 bg-gray-600 rounded" />
          </div>
        </div>
        {/* Dense sections */}
        <div className="space-y-1">
          <div className="space-y-0.5">
            <div className="h-1 w-10 bg-gray-800 rounded" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
            <div className="h-0.5 w-4/5 bg-gray-300 rounded" />
          </div>
          <div className="space-y-0.5">
            <div className="h-1 w-8 bg-gray-800 rounded" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="space-y-0.5">
              <div className="h-1 w-full bg-gray-800 rounded" />
              <div className="h-0.5 w-full bg-gray-300 rounded" />
            </div>
            <div className="space-y-0.5">
              <div className="h-1 w-full bg-gray-800 rounded" />
              <div className="h-0.5 w-full bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Elegant - Refined and spacious
  if (template.id === "elegant") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-relaxed p-4 font-serif bg-stone-50">
        {/* Elegant header */}
        <div className="text-center mb-4 pb-2 border-b border-stone-400">
          <div className="h-3 w-28 bg-stone-800 rounded mx-auto mb-1" />
          <div className="h-0.5 w-20 bg-stone-600 rounded mx-auto mb-1" />
          <div className="h-0.5 w-24 bg-stone-500 rounded mx-auto" />
        </div>
        {/* Spacious sections */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="h-1 w-20 bg-stone-800 rounded" />
            <div className="h-0.5 w-full bg-stone-400 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-24 bg-stone-800 rounded" />
            <div className="h-0.5 w-full bg-stone-600 rounded" />
            <div className="h-0.5 w-5/6 bg-stone-400 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // International - European CV with photo
  if (template.id === "international") {
    return (
      <div className="w-full h-full flex flex-col text-[4px] leading-tight p-2 font-serif">
        <div className="flex gap-2 mb-2">
          {/* Photo placeholder */}
          <div className="w-10 h-12 bg-blue-200 rounded border-2 border-blue-600" />
          {/* Header info */}
          <div className="flex-1">
            <div className="h-2 w-20 bg-gray-900 rounded mb-1" />
            <div className="space-y-0.5">
              <div className="h-0.5 w-full bg-gray-600 rounded" />
              <div className="h-0.5 w-3/4 bg-gray-600 rounded" />
              <div className="h-0.5 w-full bg-gray-600 rounded" />
            </div>
          </div>
        </div>
        {/* CV sections */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="h-1 w-full bg-blue-700 text-white px-1 rounded" />
            <div className="h-0.5 w-full bg-gray-700 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-1 w-full bg-blue-700 text-white px-1 rounded" />
            <div className="h-0.5 w-full bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Default/fallback preview for any other templates
  // Ultra-lightweight CSS-based preview
  return (
    <div className="w-full h-full flex flex-col p-3" style={bgStyle}>
      {/* Colored header band */}
      <div
        className="h-6 w-full rounded mb-3"
        style={{
          backgroundColor: colorScheme.primary,
          opacity: 0.2,
        }}
      />
      {/* Simple content lines */}
      <div className="space-y-2 flex-1">
        <div
          className="h-2 rounded"
          style={{
            backgroundColor: colorScheme.text,
            opacity: 0.3,
            width: "80%",
          }}
        />
        <div className="h-1 rounded" style={{ backgroundColor: colorScheme.text, opacity: 0.2 }} />
        <div
          className="h-1 rounded"
          style={{
            backgroundColor: colorScheme.text,
            opacity: 0.15,
            width: "90%",
          }}
        />
        <div
          className="h-1 rounded"
          style={{
            backgroundColor: colorScheme.text,
            opacity: 0.15,
            width: "75%",
          }}
        />
      </div>
    </div>
  );
});

/**
 * Template Card - Grid View
 */
interface TemplateCardProps {
  template: TemplateInfo;
  selected: boolean;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const TemplateCard = memo(function TemplateCard({
  template,
  selected,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: TemplateCardProps) {
  return (
    <div
      className={`group relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer flex flex-col h-full ${
        selected
          ? "border-violet-600 shadow-lg shadow-violet-200 dark:shadow-violet-900"
          : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-md"
      }`}
      onClick={onSelect}
    >
      {/* Preview - Actual Template Layout */}
      <div
        className="aspect-[4/3] relative overflow-hidden flex-shrink-0"
        style={{
          backgroundColor: template.colorScheme?.background || "#ffffff",
        }}
      >
        {/* Render template-specific preview */}
        <div className="absolute inset-0 w-full h-full">
          <TemplatePreviewMini template={template} />
        </div>

        {/* Favorite Star */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400 hover:text-yellow-400"
            }`}
          />
        </button>

        {/* Selected Checkmark */}
        {selected && (
          <div className="absolute top-3 left-3 bg-violet-600 text-white rounded-full p-1.5 shadow-lg z-10">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4 bg-white dark:bg-gray-800 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white truncate">
              {template.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
              {template.description}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {template.isPopular && (
            <Badge variant="secondary" className="text-xs gap-1">
              <TrendingUp className="h-3 w-3" />
              Popular
            </Badge>
          )}
          {template.isNew && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Sparkles className="h-3 w-3" />
              New
            </Badge>
          )}
          {template.atsScore >= 9 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Award className="h-3 w-3" />
              ATS {template.atsScore}/10
            </Badge>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {template.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

const MemoTemplateCard = TemplateCard;

/**
 * Template List Item - List View
 */
interface TemplateListItemProps {
  template: TemplateInfo;
  selected: boolean;
  onSelect: () => void;
}

const TemplateListItem = memo(function TemplateListItem({
  template,
  selected,
  onSelect,
}: TemplateListItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
        selected
          ? "border-violet-600 bg-violet-50 dark:bg-violet-950 dark:border-violet-500"
          : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500 hover:bg-gray-50 dark:hover:bg-gray-900"
      }`}
      onClick={onSelect}
    >
      {/* Mini Preview */}
      <div
        className="w-24 h-32 rounded border flex-shrink-0"
        style={{
          backgroundColor: template.colorScheme.background,
          borderColor: template.colorScheme.primary,
        }}
      >
        <div className="w-full h-full p-2 space-y-1">
          <div
            className="h-3 w-full rounded"
            style={{
              backgroundColor: template.colorScheme.primary,
              opacity: 0.3,
            }}
          />
          {[70, 85, 90, 75, 80, 95].map((width, i) => (
            <div
              key={i}
              className="h-1 rounded"
              style={{
                backgroundColor: template.colorScheme.text,
                opacity: 0.15,
                width: `${width}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{template.name}</h3>
          {selected && <Check className="h-5 w-5 text-violet-600 flex-shrink-0" />}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{template.description}</p>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Badges */}
          {template.isPopular && (
            <Badge variant="secondary" className="text-xs">
              Popular
            </Badge>
          )}
          {template.isNew && (
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          )}
          {template.atsScore >= 8 && (
            <Badge variant="outline" className="text-xs">
              ATS Score: {template.atsScore}/10
            </Badge>
          )}

          {/* Tags */}
          {template.tags.slice(0, 4).map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="capitalize">{template.style}</span>
          <span>•</span>
          <span className="capitalize">{template.layout.replace("-", " ")}</span>
          {template.bestFor.length > 0 && (
            <>
              <span>•</span>
              <span>Best for: {template.bestFor[0]}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const MemoTemplateListItem = TemplateListItem;
