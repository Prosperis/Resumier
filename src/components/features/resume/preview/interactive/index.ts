/**
 * Interactive Resume Components
 * Export all interactive editing components
 */

export {
  InteractiveResumeProvider,
  useInteractiveResume,
  useOptionalInteractiveResume,
  DEFAULT_SECTION_ORDER,
  type EditableSectionType,
  type EditableSectionType as SectionType, // Alias for convenience
  type SelectedSection,
  type SectionSettings,
} from "./interactive-context";

export {
  EditableSection,
  EditableSectionHeader,
  EditableText,
  SectionWrapper,
  HiddenSectionPlaceholder,
  SortableSectionColumn,
  useDragState,
} from "./editable-section";

export { SectionEditorPopover, useSectionEditor } from "./section-editor-popover";

export { SectionEditorController } from "./section-editor-controller";

// Re-export editors for direct usage if needed
export * from "./editors";
