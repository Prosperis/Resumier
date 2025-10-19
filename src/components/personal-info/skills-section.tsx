import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import type { Skill } from "@/hooks/use-resume-store"

interface SkillsProps {
  skills: Skill[]
  addSkill: () => void
  updateSkill: (i: number, field: keyof Skill, value: string) => void
  removeSkill: (i: number) => void
}

export function SkillsSection({ skills, addSkill, updateSkill, removeSkill }: SkillsProps) {
  return (
    <div className="grid gap-4">
      {skills.map((skill, i) => (
        <div key={i} className="border p-4 rounded-md grid gap-2">
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
              onChange={(e) => updateSkill(i, "proficiency", e.target.value)}
            >
              <option value="">Select</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="professional">Professional</option>
              <option value="expert">Expert</option>
              {[...Array(10)].map((_, idx) => {
                const val = (idx + 1).toString()
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                )
              })}
            </Select>
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
  )
}
