/**
 * Profile-specific Skills Form component
 */

import { SkillsForm } from "@/components/features/resume/forms/skills-form";
import type { Skills } from "@/lib/api/types";

interface ProfileSkillsFormProps {
  profileId: string;
  skills: Skills;
}

export function ProfileSkillsForm(props: ProfileSkillsFormProps) {
  return <SkillsForm {...props} resumeId={props.profileId} />;
}

