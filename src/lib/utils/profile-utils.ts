/**
 * Profile Content Utilities
 * Helper functions for working with profiles and resumes
 */

import type {
  Profile,
  ProfileContent,
  ProfileLink,
  ResumeOverrides,
  SectionSelection,
} from "@/lib/api/profile-types";
import type {
  Certification,
  Education,
  Experience,
  Link,
  PersonalInfo,
  ResumeContent,
  Skills,
} from "@/lib/api/types";

/**
 * Merge profile content with resume overrides to get the final resume content
 *
 * @param profile The source profile
 * @param profileLink The profile link configuration from the resume
 * @returns The merged resume content
 */
export function mergeProfileWithOverrides(
  profile: Profile,
  profileLink: ProfileLink,
): ResumeContent {
  const { selection, overrides } = profileLink;
  const profileContent = profile.content;

  // Start with empty content
  const result: ResumeContent = {
    personalInfo: getPersonalInfo(profileContent, selection, overrides),
    experience: getExperience(profileContent, selection, overrides),
    education: getEducation(profileContent, selection, overrides),
    skills: getSkills(profileContent, selection, overrides),
    certifications: getCertifications(profileContent, selection, overrides),
    links: getLinks(profileContent, selection, overrides),
  };

  return result;
}

/**
 * Get personal info, applying overrides if present
 */
function getPersonalInfo(
  profileContent: ProfileContent,
  selection: SectionSelection,
  overrides?: ResumeOverrides,
): PersonalInfo {
  // If personal info is excluded, return empty
  if (selection.includePersonalInfo === false) {
    return {
      firstName: "",
      lastName: "",
      nameOrder: "firstLast",
      email: "",
      phone: "",
      location: "",
      summary: selection.includeSummary === false ? "" : profileContent.personalInfo.summary,
    };
  }

  // Start with profile personal info
  const base = { ...profileContent.personalInfo };

  // Handle summary separately
  if (selection.includeSummary === false) {
    base.summary = "";
  }

  // Apply overrides
  if (overrides?.personalInfo) {
    return { ...base, ...overrides.personalInfo };
  }

  return base;
}

/**
 * Get experiences based on selection and overrides
 */
function getExperience(
  profileContent: ProfileContent,
  selection: SectionSelection,
  overrides?: ResumeOverrides,
): Experience[] {
  // If section is excluded
  if (selection.experienceIds === null) {
    // Only return additional experiences from overrides
    return overrides?.additionalExperience || [];
  }

  // Get selected experiences (empty array = all)
  let experiences: Experience[];
  if (!selection.experienceIds || selection.experienceIds.length === 0) {
    experiences = [...profileContent.experience];
  } else {
    experiences = profileContent.experience.filter((exp) =>
      selection.experienceIds!.includes(exp.id),
    );
  }

  // Apply per-item overrides
  if (overrides?.experienceOverrides) {
    experiences = experiences.map((exp) => {
      const override = overrides.experienceOverrides![exp.id];
      return override ? { ...exp, ...override } : exp;
    });
  }

  // Add additional experiences from overrides
  if (overrides?.additionalExperience) {
    experiences = [...experiences, ...overrides.additionalExperience];
  }

  return experiences;
}

/**
 * Get education based on selection and overrides
 */
function getEducation(
  profileContent: ProfileContent,
  selection: SectionSelection,
  overrides?: ResumeOverrides,
): Education[] {
  // If section is excluded
  if (selection.educationIds === null) {
    return overrides?.additionalEducation || [];
  }

  // Get selected education (empty array = all)
  let education: Education[];
  if (!selection.educationIds || selection.educationIds.length === 0) {
    education = [...profileContent.education];
  } else {
    education = profileContent.education.filter((edu) => selection.educationIds!.includes(edu.id));
  }

  // Apply per-item overrides
  if (overrides?.educationOverrides) {
    education = education.map((edu) => {
      const override = overrides.educationOverrides![edu.id];
      return override ? { ...edu, ...override } : edu;
    });
  }

  // Add additional education from overrides
  if (overrides?.additionalEducation) {
    education = [...education, ...overrides.additionalEducation];
  }

  return education;
}

/**
 * Get skills based on selection and overrides
 */
function getSkills(
  profileContent: ProfileContent,
  selection: SectionSelection,
  overrides?: ResumeOverrides,
): Skills {
  // If section is excluded
  if (selection.skills === null) {
    return overrides?.additionalSkills
      ? {
          technical: overrides.additionalSkills.technical || [],
          languages: overrides.additionalSkills.languages || [],
          tools: overrides.additionalSkills.tools || [],
          soft: overrides.additionalSkills.soft || [],
        }
      : {
          technical: [],
          languages: [],
          tools: [],
          soft: [],
        };
  }

  const result: Skills = {
    technical: [],
    languages: [],
    tools: [],
    soft: [],
  };

  // Helper to filter skills by name
  const filterSkills = (
    skills: (string | { name: string; level: number })[],
    selectedNames?: string[] | null,
  ) => {
    if (selectedNames === null) return []; // Excluded
    if (!selectedNames || selectedNames.length === 0) return skills; // All
    return skills.filter((skill) => {
      const name = typeof skill === "string" ? skill : skill.name;
      return selectedNames.includes(name);
    });
  };

  // Apply selection
  result.technical = filterSkills(profileContent.skills.technical, selection.skills?.technical);
  result.languages = filterSkills(profileContent.skills.languages, selection.skills?.languages);
  result.tools = filterSkills(profileContent.skills.tools, selection.skills?.tools);
  result.soft = filterSkills(profileContent.skills.soft, selection.skills?.soft);

  // Add additional skills from overrides
  if (overrides?.additionalSkills) {
    if (overrides.additionalSkills.technical) {
      result.technical = [...result.technical, ...overrides.additionalSkills.technical];
    }
    if (overrides.additionalSkills.languages) {
      result.languages = [...result.languages, ...overrides.additionalSkills.languages];
    }
    if (overrides.additionalSkills.tools) {
      result.tools = [...result.tools, ...overrides.additionalSkills.tools];
    }
    if (overrides.additionalSkills.soft) {
      result.soft = [...result.soft, ...overrides.additionalSkills.soft];
    }
  }

  return result;
}

/**
 * Get certifications based on selection and overrides
 */
function getCertifications(
  profileContent: ProfileContent,
  selection: SectionSelection,
  overrides?: ResumeOverrides,
): Certification[] {
  // If section is excluded
  if (selection.certificationIds === null) {
    return overrides?.additionalCertifications || [];
  }

  // Get selected certifications (empty array = all)
  let certifications: Certification[];
  if (!selection.certificationIds || selection.certificationIds.length === 0) {
    certifications = [...profileContent.certifications];
  } else {
    certifications = profileContent.certifications.filter((cert) =>
      selection.certificationIds!.includes(cert.id),
    );
  }

  // Add additional certifications from overrides
  if (overrides?.additionalCertifications) {
    certifications = [...certifications, ...overrides.additionalCertifications];
  }

  return certifications;
}

/**
 * Get links based on selection and overrides
 */
function getLinks(
  profileContent: ProfileContent,
  selection: SectionSelection,
  overrides?: ResumeOverrides,
): Link[] {
  // If section is excluded
  if (selection.linkIds === null) {
    return overrides?.additionalLinks || [];
  }

  // Get selected links (empty array = all)
  let links: Link[];
  if (!selection.linkIds || selection.linkIds.length === 0) {
    links = [...profileContent.links];
  } else {
    links = profileContent.links.filter((link) => selection.linkIds!.includes(link.id));
  }

  // Add additional links from overrides
  if (overrides?.additionalLinks) {
    links = [...links, ...overrides.additionalLinks];
  }

  return links;
}

/**
 * Check if a resume is linked to a profile
 */
export function isLinkedToProfile(resume: { profileLink?: ProfileLink } | undefined): boolean {
  return !!resume?.profileLink?.profileId;
}

/**
 * Get the profile ID a resume is linked to
 */
export function getLinkedProfileId(
  resume: { profileLink?: ProfileLink } | undefined,
): string | null {
  return resume?.profileLink?.profileId || null;
}
