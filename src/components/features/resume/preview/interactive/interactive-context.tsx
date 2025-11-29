/**
 * Interactive Resume Context
 * Manages editing state and selection for the interactive resume preview
 */

import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import type {
  Resume,
  Experience,
  Education,
  Certification,
  Link,
  PersonalInfo,
  Skills,
} from "@/lib/api/types";

/**
 * Section types that can be edited in the resume
 */
export type EditableSectionType =
  | "personalInfo"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "links";

/**
 * Selected section state
 */
export interface SelectedSection {
  type: EditableSectionType;
  itemId?: string; // For array items like experience, education, etc.
  rect?: DOMRect; // Position for popover placement
}

/**
 * Interactive resume context value
 */
interface InteractiveResumeContextValue {
  // State
  isInteractive: boolean;
  selectedSection: SelectedSection | null;
  hoveredSection: SelectedSection | null;

  // Resume data
  resume: Resume;

  // Actions
  setInteractive: (interactive: boolean) => void;
  selectSection: (section: SelectedSection | null) => void;
  hoverSection: (section: SelectedSection | null) => void;
  clearSelection: () => void;

  // Data update handlers
  onUpdatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  onUpdateExperience: (id: string, data: Partial<Experience>) => void;
  onAddExperience: () => void;
  onDeleteExperience: (id: string) => void;
  onReorderExperience: (fromIndex: number, toIndex: number) => void;
  onUpdateEducation: (id: string, data: Partial<Education>) => void;
  onAddEducation: () => void;
  onDeleteEducation: (id: string) => void;
  onReorderEducation: (fromIndex: number, toIndex: number) => void;
  onUpdateSkills: (data: Partial<Skills>) => void;
  onUpdateCertification: (id: string, data: Partial<Certification>) => void;
  onAddCertification: () => void;
  onDeleteCertification: (id: string) => void;
  onReorderCertifications: (fromIndex: number, toIndex: number) => void;
  onUpdateLink: (id: string, data: Partial<Link>) => void;
  onAddLink: () => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (fromIndex: number, toIndex: number) => void;
}

const InteractiveResumeContext =
  createContext<InteractiveResumeContextValue | null>(null);

interface InteractiveResumeProviderProps {
  children: ReactNode;
  resume: Resume;
  isInteractive?: boolean;
  onUpdatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  onUpdateExperience: (id: string, data: Partial<Experience>) => void;
  onAddExperience: () => void;
  onDeleteExperience: (id: string) => void;
  onReorderExperience: (fromIndex: number, toIndex: number) => void;
  onUpdateEducation: (id: string, data: Partial<Education>) => void;
  onAddEducation: () => void;
  onDeleteEducation: (id: string) => void;
  onReorderEducation: (fromIndex: number, toIndex: number) => void;
  onUpdateSkills: (data: Partial<Skills>) => void;
  onUpdateCertification: (id: string, data: Partial<Certification>) => void;
  onAddCertification: () => void;
  onDeleteCertification: (id: string) => void;
  onReorderCertifications: (fromIndex: number, toIndex: number) => void;
  onUpdateLink: (id: string, data: Partial<Link>) => void;
  onAddLink: () => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (fromIndex: number, toIndex: number) => void;
}

export function InteractiveResumeProvider({
  children,
  resume,
  isInteractive: initialInteractive = true,
  onUpdatePersonalInfo,
  onUpdateExperience,
  onAddExperience,
  onDeleteExperience,
  onReorderExperience,
  onUpdateEducation,
  onAddEducation,
  onDeleteEducation,
  onReorderEducation,
  onUpdateSkills,
  onUpdateCertification,
  onAddCertification,
  onDeleteCertification,
  onReorderCertifications,
  onUpdateLink,
  onAddLink,
  onDeleteLink,
  onReorderLinks,
}: InteractiveResumeProviderProps) {
  const [isInteractive, setInteractive] = useState(initialInteractive);
  const [selectedSection, setSelectedSection] =
    useState<SelectedSection | null>(null);
  const [hoveredSection, setHoveredSection] = useState<SelectedSection | null>(
    null,
  );

  const selectSection = useCallback((section: SelectedSection | null) => {
    setSelectedSection(section);
  }, []);

  const hoverSection = useCallback((section: SelectedSection | null) => {
    setHoveredSection(section);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSection(null);
    setHoveredSection(null);
  }, []);

  const value: InteractiveResumeContextValue = {
    isInteractive,
    selectedSection,
    hoveredSection,
    resume,
    setInteractive,
    selectSection,
    hoverSection,
    clearSelection,
    onUpdatePersonalInfo,
    onUpdateExperience,
    onAddExperience,
    onDeleteExperience,
    onReorderExperience,
    onUpdateEducation,
    onAddEducation,
    onDeleteEducation,
    onReorderEducation,
    onUpdateSkills,
    onUpdateCertification,
    onAddCertification,
    onDeleteCertification,
    onReorderCertifications,
    onUpdateLink,
    onAddLink,
    onDeleteLink,
    onReorderLinks,
  };

  return (
    <InteractiveResumeContext.Provider value={value}>
      {children}
    </InteractiveResumeContext.Provider>
  );
}

export function useInteractiveResume() {
  const context = useContext(InteractiveResumeContext);
  if (!context) {
    throw new Error(
      "useInteractiveResume must be used within an InteractiveResumeProvider",
    );
  }
  return context;
}

/**
 * Hook to check if we're in an interactive context (optional)
 * Returns null if not in context, allowing non-interactive usage
 */
export function useOptionalInteractiveResume() {
  return useContext(InteractiveResumeContext);
}
