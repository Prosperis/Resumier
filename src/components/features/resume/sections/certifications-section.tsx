import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Certification } from "@/stores";

interface CertProps {
  certifications: Certification[];
  addCertification: () => void;
  updateCertification: (i: number, field: keyof Certification, value: string) => void;
  removeCertification: (i: number) => void;
}

export function CertificationsSection({
  certifications,
  addCertification,
  updateCertification,
  removeCertification,
}: CertProps) {
  return (
    <div className="grid gap-4">
      {certifications.map((cert, i) => (
        <div key={cert.id || i} className="grid gap-2 rounded-md border p-4">
          <div className="grid gap-2">
            <Label>Certification Name</Label>
            <Input
              value={cert.name ?? ""}
              onChange={(e) => updateCertification(i, "name", e.target.value)}
              placeholder="AWS Solutions Architect"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Issuer</Label>
              <Input
                value={cert.issuer ?? ""}
                onChange={(e) => updateCertification(i, "issuer", e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>
            <div className="grid gap-2">
              <Label>Date Obtained</Label>
              <Input
                type="date"
                value={cert.date ?? ""}
                onChange={(e) => updateCertification(i, "date", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Expiry Date (optional)</Label>
              <Input
                type="date"
                value={cert.expiryDate ?? ""}
                onChange={(e) => updateCertification(i, "expiryDate", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Credential ID (optional)</Label>
              <Input
                value={cert.credentialId ?? ""}
                onChange={(e) => updateCertification(i, "credentialId", e.target.value)}
                placeholder="ABC123XYZ"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Credential URL (optional)</Label>
            <Input
              value={cert.url ?? ""}
              onChange={(e) => updateCertification(i, "url", e.target.value)}
              placeholder="https://credentials.example.com/verify/..."
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeCertification(i)}>
            <Trash className="mr-2 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addCertification}>
        <Plus className="mr-2 h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
}
