import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Education } from "@/stores";

interface EducationProps {
  education: Education[];
  addEducation: () => void;
  updateEducation: (i: number, field: keyof Education, value: string | boolean) => void;
  removeEducation: (i: number) => void;
}

export function EducationSection({
  education,
  addEducation,
  updateEducation,
  removeEducation,
}: EducationProps) {
  return (
    <div className="grid gap-4">
      {education.map((ed, i) => (
        <div key={ed.id || i} className="grid gap-2 rounded-md border p-4">
          <div className="grid gap-2">
            <Label>Institution</Label>
            <Input
              value={ed.institution ?? ""}
              onChange={(e) => updateEducation(i, "institution", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Degree</Label>
              <Input
                value={ed.degree ?? ""}
                onChange={(e) => updateEducation(i, "degree", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Field of Study</Label>
              <Input
                value={ed.field ?? ""}
                onChange={(e) => updateEducation(i, "field", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={ed.startDate ?? ""}
                onChange={(e) => updateEducation(i, "startDate", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={ed.endDate ?? ""}
                onChange={(e) => updateEducation(i, "endDate", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>GPA (optional)</Label>
              <Input
                value={ed.gpa ?? ""}
                onChange={(e) => updateEducation(i, "gpa", e.target.value)}
                placeholder="3.8"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id={`edu-current-${i}`}
                type="checkbox"
                checked={ed.current ?? false}
                onChange={(e) => updateEducation(i, "current", e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor={`edu-current-${i}`}>Currently Enrolled</Label>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeEducation(i)}>
            <Trash className="mr-2 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addEducation}>
        <Plus className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  );
}
