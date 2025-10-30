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
        <div key={i} className="grid gap-2 rounded-md border p-4">
          <div className="grid gap-2">
            <Label>Certification</Label>
            <Input
              value={cert.name ?? ""}
              onChange={(e) => updateCertification(i, "name", e.target.value)}
              placeholder="Certification name"
            />
          </div>
          <div className="grid gap-2">
            <Label>Expiration</Label>
            <Input
              type="date"
              value={cert.expiration ?? ""}
              onChange={(e) => updateCertification(i, "expiration", e.target.value)}
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
