import { CalendarIcon, EditIcon, ExternalLinkIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Certification } from "@/lib/api/types"

interface CertificationListProps {
  certifications: Certification[]
  onEdit: (certification: Certification) => void
  onDelete: (id: string) => void
}

export function CertificationList({ certifications, onEdit, onDelete }: CertificationListProps) {
  if (certifications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No certifications added yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click "Add Certification" to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (date: string) => {
    if (!date) return ""
    const [year, month] = date.split("-")
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`
  }

  return (
    <div className="space-y-4">
      {certifications.map((cert) => (
        <Card key={cert.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{cert.name}</h3>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      aria-label={`View ${cert.name} credential`}
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>Issued {formatDate(cert.date)}</span>
                  {cert.expiryDate && <span> · Expires {formatDate(cert.expiryDate)}</span>}
                </div>
                {cert.credentialId && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Credential ID: {cert.credentialId}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(cert)}
                  aria-label={`Edit ${cert.name} certification`}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(cert.id)}
                  aria-label={`Delete ${cert.name} certification`}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
