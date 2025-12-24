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
  updateSkill: (i: number, field: keyof Skill, value: string | number) => void;
  removeSkill: (i: number) => void;
}

export function SkillsSection({ skills, addSkill, updateSkill, removeSkill }: SkillsProps) {
  return (
    <div className="grid gap-4">
      {skills.map((skill, i) => (
        <div key={skill.id || i} className="grid gap-2 rounded-md border p-4">
          <div className="grid gap-2">
            <Label>Skill</Label>
            <Input
              value={skill.name ?? ""}
              onChange={(e) => updateSkill(i, "name", e.target.value)}
              placeholder="Skill name"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label>Level (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={skill.level ?? ""}
                onChange={(e) => updateSkill(i, "level", parseInt(e.target.value) || 0)}
                placeholder="5"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={skill.category ?? ""}
                onValueChange={(value) => updateSkill(i, "category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="languages">Languages</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="soft">Soft Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => removeSkill(i)}>
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
