import { ExternalLink, Github, Linkedin, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { LinkFormData } from "@/lib/validations/links"

interface LinkListProps {
  links: LinkFormData[]
  onEdit: (link: LinkFormData) => void
  onDelete: (id: string) => void
}

function getLinkIcon(type: LinkFormData["type"]) {
  switch (type) {
    case "linkedin":
      return <Linkedin className="h-4 w-4" />
    case "github":
      return <Github className="h-4 w-4" />
    case "portfolio":
      return <ExternalLink className="h-4 w-4" />
    case "other":
      return <LinkIcon className="h-4 w-4" />
    default:
      return <LinkIcon className="h-4 w-4" />
  }
}

function getLinkTypeLabel(type: LinkFormData["type"]) {
  switch (type) {
    case "linkedin":
      return "LinkedIn"
    case "github":
      return "GitHub"
    case "portfolio":
      return "Portfolio"
    case "other":
      return "Other"
    default:
      return type
  }
}

export function LinkList({ links, onEdit, onDelete }: LinkListProps) {
  if (links.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No links added yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your portfolio, LinkedIn, GitHub, or other professional links
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <Card key={link.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {getLinkIcon(link.type)}
                  <h3 className="font-semibold">{link.label}</h3>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                    {getLinkTypeLabel(link.type)}
                  </span>
                </div>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {link.url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(link)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(link.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
