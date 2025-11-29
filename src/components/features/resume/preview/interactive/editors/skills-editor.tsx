/**
 * Skills Inline Editor
 * Compact editor for skills that appears in the popover
 */

import { useEffect, useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Skills, SkillWithLevel } from "@/lib/api/types";

interface SkillsEditorProps {
  data: Skills;
  onChange: (data: Partial<Skills>) => void;
}

// Helper to get skill name
function getSkillName(skill: string | SkillWithLevel): string {
  return typeof skill === "string" ? skill : skill.name;
}

// Skill input component
interface SkillInputProps {
  skills: (string | SkillWithLevel)[];
  onChange: (skills: (string | SkillWithLevel)[]) => void;
  placeholder?: string;
}

function SkillInput({ skills, onChange, placeholder }: SkillInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !skills.some((s) => getSkillName(s) === trimmed)) {
      onChange([...skills, trimmed]);
      setInputValue("");
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    onChange(newSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs gap-1 pr-1">
            {getSkillName(skill)}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type a skill and press Enter"}
          className="h-7 text-xs flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={addSkill}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function SkillsEditor({ data, onChange }: SkillsEditorProps) {
  const [skills, setSkills] = useState<Skills>({
    technical: data.technical || [],
    languages: data.languages || [],
    tools: data.tools || [],
    soft: data.soft || [],
  });

  // Sync changes to parent
  useEffect(() => {
    onChange(skills);
  }, [skills, onChange]);

  const updateCategory = useCallback(
    (category: keyof Skills, newSkills: (string | SkillWithLevel)[]) => {
      setSkills((prev) => ({
        ...prev,
        [category]: newSkills,
      }));
    },
    [],
  );

  return (
    <div className="space-y-4">
      {/* Technical Skills */}
      <div className="space-y-1">
        <Label className="text-xs font-medium">Technical Skills</Label>
        <SkillInput
          skills={skills.technical}
          onChange={(newSkills) => updateCategory("technical", newSkills)}
          placeholder="React, TypeScript, Python..."
        />
      </div>

      {/* Programming Languages */}
      <div className="space-y-1">
        <Label className="text-xs font-medium">Languages</Label>
        <SkillInput
          skills={skills.languages}
          onChange={(newSkills) => updateCategory("languages", newSkills)}
          placeholder="JavaScript, Python, Go..."
        />
      </div>

      {/* Tools */}
      <div className="space-y-1">
        <Label className="text-xs font-medium">Tools & Frameworks</Label>
        <SkillInput
          skills={skills.tools}
          onChange={(newSkills) => updateCategory("tools", newSkills)}
          placeholder="Git, Docker, AWS..."
        />
      </div>

      {/* Soft Skills */}
      <div className="space-y-1">
        <Label className="text-xs font-medium">Soft Skills</Label>
        <SkillInput
          skills={skills.soft}
          onChange={(newSkills) => updateCategory("soft", newSkills)}
          placeholder="Leadership, Communication..."
        />
      </div>
    </div>
  );
}
