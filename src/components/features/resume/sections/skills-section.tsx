import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Skill } from "@/stores";

interface SkillsProps {
  skills: Skill[];
  addSkill: () => void;
  updateSkill: (i: number, field: keyof Skill, value: string) => void;
  removeSkill: (i: number) => void;
}

export function SkillsSection({
  skills,
  addSkill,
  updateSkill,
  removeSkill,
}: SkillsProps) {
  return (
    <div className="grid gap-4">
      {skills.map((skill, i) => (
        <div key={i} className="grid gap-2 rounded-md border p-4">
          <div className="grid gap-2">
            <Label>Skill</Label>
            <Input
              value={skill.name ?? ""}
              onChange={(e) => updateSkill(i, "name", e.target.value)}
              placeholder="Skill name"
            />
          </div>
          <div className="grid gap-2">
            <Label>Years of Experience</Label>
            <Input
              type="number"
              min="0"
              value={skill.years ?? ""}
              onChange={(e) => updateSkill(i, "years", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <Label>Proficiency</Label>
            <Select
              value={skill.proficiency ?? ""}
              onValueChange={(value) => updateSkill(i, "proficiency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
                {[...Array(10)].map((_, idx) => {
                  const val = (idx + 1).toString();
                  return (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => removeSkill(i)}
          >
            <Trash className="mr-2 h-4 w-4" /> Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addSkill}>
        <Plus className="mr-2 h-4 w-4" /> Add Skill
      </Button>
    </div>
  );
}
