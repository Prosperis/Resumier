import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TEMPLATES, type TemplateType } from "@/lib/types/templates";
import { TemplateGallery } from "./template-gallery";

interface TemplateSelectorProps {
  selected: TemplateType;
  onSelect: (template: TemplateType) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const selectedTemplate = TEMPLATES.find((t) => t.id === selected);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setGalleryOpen(true)} className="gap-2">
        <Sparkles className="h-4 w-4" />
        <span>Template: {selectedTemplate?.name}</span>
      </Button>

      <TemplateGallery
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        selected={selected}
        onSelect={onSelect}
      />
    </>
  );
}
