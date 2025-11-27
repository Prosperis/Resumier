import { Palette, RotateCcw, Type, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useResumeStore,
  selectStyleCustomization,
  selectStyleActions,
  type CustomFont,
} from "@/stores/resume-store";
import {
  COLOR_SCHEMES,
  TYPOGRAPHY_PRESETS,
  type ColorScheme,
} from "@/lib/types/templates";
import { cn } from "@/lib/utils";

// Color theme options with display names
const COLOR_THEME_OPTIONS = [
  { value: "navy", label: "Navy", category: "Professional" },
  { value: "charcoal", label: "Charcoal", category: "Professional" },
  { value: "blue", label: "Blue", category: "Professional" },
  { value: "slate", label: "Slate", category: "Professional" },
  { value: "indigo", label: "Indigo", category: "Professional" },
  { value: "purple", label: "Purple", category: "Modern" },
  { value: "violet", label: "Violet", category: "Modern" },
  { value: "teal", label: "Teal", category: "Modern" },
  { value: "emerald", label: "Emerald", category: "Modern" },
  { value: "coral", label: "Coral", category: "Creative" },
  { value: "orange", label: "Orange", category: "Creative" },
  { value: "rose", label: "Rose", category: "Creative" },
  { value: "neutral", label: "Neutral", category: "Classic" },
];

// Custom theme constant
const CUSTOM_THEME = "custom";

// Font theme options with display names
const FONT_THEME_OPTIONS = [
  {
    value: "classic",
    label: "Classic",
    description: "Georgia + Arial",
  },
  {
    value: "modern",
    label: "Modern",
    description: "Inter",
  },
  {
    value: "creative",
    label: "Creative",
    description: "Montserrat + Open Sans",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Lato + Merriweather",
  },
  {
    value: "technical",
    label: "Technical",
    description: "Inter + Source Code Pro",
  },
];

// Common web-safe and Google fonts
const FONT_OPTIONS = [
  // Sans-serif
  { value: "Inter, sans-serif", label: "Inter", category: "Sans-serif" },
  { value: "Arial, sans-serif", label: "Arial", category: "Sans-serif" },
  {
    value: "Helvetica, sans-serif",
    label: "Helvetica",
    category: "Sans-serif",
  },
  {
    value: "Montserrat, sans-serif",
    label: "Montserrat",
    category: "Sans-serif",
  },
  {
    value: "Open Sans, sans-serif",
    label: "Open Sans",
    category: "Sans-serif",
  },
  { value: "Lato, sans-serif", label: "Lato", category: "Sans-serif" },
  { value: "Roboto, sans-serif", label: "Roboto", category: "Sans-serif" },
  { value: "Poppins, sans-serif", label: "Poppins", category: "Sans-serif" },
  {
    value: "Source Sans Pro, sans-serif",
    label: "Source Sans Pro",
    category: "Sans-serif",
  },
  // Serif
  { value: "Georgia, serif", label: "Georgia", category: "Serif" },
  {
    value: "Times New Roman, serif",
    label: "Times New Roman",
    category: "Serif",
  },
  { value: "Merriweather, serif", label: "Merriweather", category: "Serif" },
  { value: "Playfair Display, serif", label: "Playfair", category: "Serif" },
  { value: "Libre Baskerville, serif", label: "Baskerville", category: "Serif" },
];

interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

function ColorSwatch({ color, isSelected, onClick, label }: ColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
        isSelected
          ? "border-foreground ring-2 ring-primary ring-offset-2"
          : "border-transparent"
      )}
      style={{ backgroundColor: color }}
      title={label}
      aria-label={`Select ${label} color theme`}
    />
  );
}

interface CustomColorSwatchProps {
  color: string;
  isSelected: boolean;
  onChange: (color: string) => void;
}

function CustomColorSwatch({ color, isSelected, onChange }: CustomColorSwatchProps) {
  return (
    <div className="relative">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 w-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 appearance-none bg-transparent",
          isSelected
            ? "border-foreground ring-2 ring-primary ring-offset-2"
            : "border-dashed border-muted-foreground"
        )}
        style={{ backgroundColor: color }}
        title="Custom color"
        aria-label="Select custom color"
      />
      {/* Gradient overlay to indicate "custom" */}
      {!isSelected && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
            opacity: 0.7,
          }}
        />
      )}
    </div>
  );
}

interface ColorPickerRowProps {
  label: string;
  colorKey: keyof ColorScheme;
  value: string;
  onChange: (key: keyof ColorScheme, value: string) => void;
}

function ColorPickerRow({
  label,
  colorKey,
  value,
  onChange,
}: ColorPickerRowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(colorKey, e.target.value)}
          className="h-6 w-8 cursor-pointer rounded border border-input bg-transparent"
        />
        <span className="w-16 text-xs font-mono text-muted-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}

// Load a custom font into the document
async function loadCustomFont(font: CustomFont): Promise<void> {
  try {
    const fontFace = new FontFace(font.fontFamily, `url(${font.dataUrl})`);
    await fontFace.load();
    document.fonts.add(fontFace);
  } catch (error) {
    console.error(`Failed to load font ${font.name}:`, error);
  }
}

export function StyleCustomizer() {
  const [open, setOpen] = useState(false);
  const [isLoadingFont, setIsLoadingFont] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styleCustomization = useResumeStore(selectStyleCustomization);
  const styleActions = useResumeStore(selectStyleActions);

  // Ensure customFonts is always an array (handles persisted state migration)
  const customFonts = styleCustomization.customFonts || [];

  // Load custom fonts on mount and when they change
  useEffect(() => {
    customFonts.forEach(loadCustomFont);
  }, [customFonts]);

  // Get current effective colors (theme + overrides)
  const currentThemeColors =
    COLOR_SCHEMES[styleCustomization.colorTheme] || COLOR_SCHEMES.purple;
  const effectiveColors: ColorScheme = {
    ...currentThemeColors,
    ...styleCustomization.colorOverrides,
  };

  // Get current effective typography (theme + overrides)
  const currentThemeFonts =
    TYPOGRAPHY_PRESETS[styleCustomization.fontTheme] || TYPOGRAPHY_PRESETS.modern;

  // Combine built-in fonts with custom fonts
  const allFontOptions = [
    ...FONT_OPTIONS,
    ...customFonts.map((font) => ({
      value: `"${font.fontFamily}", sans-serif`,
      label: `${font.name} (Custom)`,
      category: "Custom" as const,
    })),
  ];

  const handleColorThemeChange = (theme: string) => {
    styleActions.setColorTheme(theme);
  };

  const handleColorOverride = (key: keyof ColorScheme, value: string) => {
    styleActions.setColorOverride(key, value);
  };

  const handleCustomColorChange = (color: string) => {
    // Set theme to custom and update the primary color
    styleActions.setColorTheme(CUSTOM_THEME);
    styleActions.setColorOverride("primary", color);
    // Also set a derived secondary color (slightly lighter)
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const lighterR = Math.min(255, r + 40);
    const lighterG = Math.min(255, g + 40);
    const lighterB = Math.min(255, b + 40);
    const secondaryColor = `#${lighterR.toString(16).padStart(2, "0")}${lighterG.toString(16).padStart(2, "0")}${lighterB.toString(16).padStart(2, "0")}`;
    styleActions.setColorOverride("secondary", secondaryColor);
  };

  // Get the current custom color (from overrides or default)
  const customColor = styleCustomization.colorOverrides.primary || "#8b5cf6";

  const handleFontThemeChange = (theme: string) => {
    styleActions.setFontTheme(theme);
  };

  const handleReset = () => {
    styleActions.resetStyleCustomization();
  };

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "font/ttf",
      "font/otf",
      "font/woff",
      "font/woff2",
      "application/x-font-ttf",
      "application/x-font-otf",
      "application/font-woff",
      "application/font-woff2",
    ];
    
    const extension = file.name.split(".").pop()?.toLowerCase();
    const isValidExtension = ["ttf", "otf", "woff", "woff2"].includes(extension || "");
    
    if (!validTypes.includes(file.type) && !isValidExtension) {
      alert("Please upload a valid font file (.ttf, .otf, .woff, .woff2)");
      return;
    }

    setIsLoadingFont(true);

    try {
      // Read file as data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Generate font family name from filename
      const fontName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "");
      const fontFamily = `Custom-${fontName}-${Date.now()}`;

      const customFont: CustomFont = {
        name: fontName,
        fontFamily,
        dataUrl,
      };

      // Load the font
      await loadCustomFont(customFont);

      // Add to store
      styleActions.addCustomFont(customFont);
    } catch (error) {
      console.error("Failed to upload font:", error);
      alert("Failed to load font. Please try a different file.");
    } finally {
      setIsLoadingFont(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveCustomFont = (fontName: string) => {
    styleActions.removeCustomFont(fontName);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Customize resume style"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Style</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Customize Style</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="colors" className="text-xs gap-1">
                <Palette className="h-3 w-3" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="fonts" className="text-xs gap-1">
                <Type className="h-3 w-3" />
                Fonts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4 mt-4">
              {/* Color Theme Quick Select */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Color Theme</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_THEME_OPTIONS.map((option) => (
                    <ColorSwatch
                      key={option.value}
                      color={COLOR_SCHEMES[option.value]?.primary || "#8b5cf6"}
                      isSelected={styleCustomization.colorTheme === option.value}
                      onClick={() => handleColorThemeChange(option.value)}
                      label={option.label}
                    />
                  ))}
                  {/* Custom color picker */}
                  <CustomColorSwatch
                    color={customColor}
                    isSelected={styleCustomization.colorTheme === CUSTOM_THEME}
                    onChange={handleCustomColorChange}
                  />
                </div>
              </div>

              {/* Individual Color Customization */}
              <div className="space-y-3 border-t pt-3">
                <Label className="text-xs font-medium">Fine-tune Colors</Label>
                <div className="space-y-2">
                  <ColorPickerRow
                    label="Primary"
                    colorKey="primary"
                    value={effectiveColors.primary}
                    onChange={handleColorOverride}
                  />
                  <ColorPickerRow
                    label="Secondary"
                    colorKey="secondary"
                    value={effectiveColors.secondary || effectiveColors.primary}
                    onChange={handleColorOverride}
                  />
                  <ColorPickerRow
                    label="Text"
                    colorKey="text"
                    value={effectiveColors.text}
                    onChange={handleColorOverride}
                  />
                  <ColorPickerRow
                    label="Light Text"
                    colorKey="textLight"
                    value={effectiveColors.textLight}
                    onChange={handleColorOverride}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-4 mt-4">
              {/* Font Theme Select */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Font Theme</Label>
                <Select
                  value={styleCustomization.fontTheme}
                  onValueChange={handleFontThemeChange}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select font theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_THEME_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-xs"
                      >
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Individual Font Customization */}
              <div className="space-y-3 border-t pt-3">
                <Label className="text-xs font-medium">Custom Fonts</Label>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Heading Font
                    </Label>
                    <Select
                      value={
                        (styleCustomization.fontOverrides
                          .headingFont as string) || currentThemeFonts.headingFont
                      }
                      onValueChange={(value) =>
                        styleActions.setFontOverride("headingFont", value)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select heading font" />
                      </SelectTrigger>
                      <SelectContent>
                        {allFontOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs"
                            style={{ fontFamily: option.value }}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Body Font
                    </Label>
                    <Select
                      value={
                        (styleCustomization.fontOverrides.bodyFont as string) ||
                        currentThemeFonts.bodyFont
                      }
                      onValueChange={(value) =>
                        styleActions.setFontOverride("bodyFont", value)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select body font" />
                      </SelectTrigger>
                      <SelectContent>
                        {allFontOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-xs"
                            style={{ fontFamily: option.value }}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Upload Custom Font */}
              <div className="space-y-3 border-t pt-3">
                <Label className="text-xs font-medium">Upload Custom Font</Label>
                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={handleFontUpload}
                    disabled={isLoadingFont}
                    className="h-8 text-xs cursor-pointer file:mr-2 file:cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Supports .ttf, .otf, .woff, .woff2
                  </p>
                </div>

                {/* List of custom fonts */}
                {customFonts.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Uploaded Fonts
                    </Label>
                    <div className="space-y-1">
                      {customFonts.map((font) => (
                        <div
                          key={font.fontFamily}
                          className="flex items-center justify-between rounded bg-muted px-2 py-1"
                        >
                          <span
                            className="text-xs truncate"
                            style={{ fontFamily: `"${font.fontFamily}", sans-serif` }}
                          >
                            {font.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCustomFont(font.name)}
                            className="h-5 w-5 p-0 hover:bg-destructive/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}

