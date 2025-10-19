import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TEMPLATES, type TemplateType } from "@/lib/types/templates"

interface TemplateSelectorProps {
  selected: TemplateType
  onSelect: (template: TemplateType) => void
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const selectedTemplate = TEMPLATES.find((t) => t.id === selected)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Template: {selectedTemplate?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {TEMPLATES.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="flex items-start gap-3 cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{template.name}</span>
                {selected === template.id && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
