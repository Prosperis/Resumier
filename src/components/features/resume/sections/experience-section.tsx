import { ChevronDown, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { WorkExperience } from "@/hooks/use-resume-store"

interface ExperienceProps {
  experiences: WorkExperience[]
  awardInputs: Record<number, string>
  addExperience: () => void
  updateExperience: (
    i: number,
    field: keyof WorkExperience,
    value: string | string[] | boolean,
  ) => void
  removeExperience: (i: number) => void
  setAwardInput: (i: number, value: string) => void
  addExperienceAward: (i: number) => void
  removeExperienceAward: (i: number, j: number) => void
}

export function ExperienceSection({
  experiences,
  awardInputs,
  addExperience,
  updateExperience,
  removeExperience,
  setAwardInput,
  addExperienceAward,
  removeExperienceAward,
}: ExperienceProps) {
  return (
    <div className="grid gap-4">
      {experiences.map((exp, i) => (
        <Collapsible key={i} defaultOpen={!exp.company} className="rounded-md border">
          <div className="flex items-center justify-between gap-2 p-2">
            <span className="font-medium">{exp.company || `Experience ${i + 1}`}</span>
            <div className="flex gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(i)}>
                <Trash className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
          <CollapsibleContent className="grid gap-2 border-t p-4">
            <div className="grid gap-2">
              <Label>Company</Label>
              <Input
                value={exp.company ?? ""}
                onChange={(e) => updateExperience(i, "company", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={exp.title ?? ""}
                onChange={(e) => updateExperience(i, "title", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={exp.startDate ?? ""}
                  onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={exp.endDate ?? ""}
                  onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                  disabled={exp.current}
                  placeholder={exp.current ? "Present" : undefined}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  id={`current-${i}`}
                  type="checkbox"
                  checked={exp.current ?? false}
                  onChange={(e) => updateExperience(i, "current", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor={`current-${i}`}>Current</Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={exp.description ?? ""}
                onChange={(e) => updateExperience(i, "description", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Awards</Label>
              <div className="flex gap-2">
                <Input
                  value={awardInputs[i] ?? ""}
                  onChange={(e) => setAwardInput(i, e.target.value)}
                  placeholder="Add award"
                />
                <Button type="button" onClick={() => addExperienceAward(i)}>
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
              <ul className="grid gap-2">
                {(exp.awards ?? []).map((award, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span className="flex-1">{award}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperienceAward(i, j)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(i)}>
              <Trash className="mr-2 h-4 w-4" /> Remove
            </Button>
          </CollapsibleContent>
        </Collapsible>
      ))}
      <Button type="button" variant="outline" onClick={addExperience}>
        <Plus className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  )
}
