import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Resume } from "@/lib/api/types";
import { COLOR_SCHEMES, TYPOGRAPHY_PRESETS, type TemplateType } from "@/lib/types/templates";
import { useResumeStore, selectStyleCustomization, type CustomFont } from "@/stores/resume-store";
import { getTemplateComponent, getTemplateInfo } from "./templates/template-registry";

// Track loaded fonts to avoid duplicate loading
const loadedFonts = new Set<string>();

// Load custom font into document (optimized to avoid reflow)
async function loadCustomFont(font: CustomFont): Promise<void> {
  // Skip if already loaded (using our own cache to avoid document.fonts.check which triggers reflow)
  if (loadedFonts.has(font.fontFamily)) {
    return;
  }

  try {
    const fontFace = new FontFace(font.fontFamily, `url(${font.dataUrl})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    loadedFonts.add(font.fontFamily);
  } catch (error) {
    console.error(`Failed to load font ${font.name}:`, error);
  }
}

interface ResumePreviewProps {
  resume: Resume;
  template: TemplateType;
}

// Template loading skeleton
function TemplateLoadingSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[21cm] space-y-8 bg-white p-16 shadow-lg"
      style={{ colorScheme: "light" }}
    >
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function ResumePreview({ resume, template }: ResumePreviewProps) {
  // Get the template component and metadata from the registry
  const TemplateComponent = getTemplateComponent(template);
  const templateInfo = getTemplateInfo(template);

  // Get style customization from store
  const styleCustomization = useResumeStore(selectStyleCustomization);

  // Load custom fonts when they change (with fallback for persisted state migration)
  const customFonts = styleCustomization.customFonts || [];
  useEffect(() => {
    customFonts.forEach(loadCustomFont);
  }, [customFonts]);

  // Get base colors from selected theme (with fallback to template default)
  // For "custom" theme, use neutral as base and let overrides define the colors
  const baseColorScheme =
    styleCustomization.colorTheme === "custom"
      ? COLOR_SCHEMES.neutral
      : COLOR_SCHEMES[styleCustomization.colorTheme] ||
        templateInfo?.colorScheme ||
        COLOR_SCHEMES.purple;

  // Get base typography from selected theme (with fallback to template default)
  const baseTypography =
    TYPOGRAPHY_PRESETS[styleCustomization.fontTheme] ||
    templateInfo?.typography ||
    TYPOGRAPHY_PRESETS.modern;

  // Create config by merging: template defaults < theme presets < user overrides
  const config = {
    colorScheme: {
      ...baseColorScheme,
      ...styleCustomization.colorOverrides,
    },
    typography: {
      ...baseTypography,
      ...styleCustomization.fontOverrides,
    },
    spacing: templateInfo?.spacing,
  };

  return (
    <div className="mx-auto w-full max-w-[21cm] bg-white shadow-xl">
      {/* Remove dark mode context for resume display */}
      <div className="resume-light-mode light print:bg-white print:p-0">
        <Suspense fallback={<TemplateLoadingSkeleton />}>
          <TemplateComponent resume={resume} config={config} />
        </Suspense>
      </div>
    </div>
  );
}
