/**
 * Interactive Resume Components
 * Export all interactive editing components
 */

export {
  InteractiveResumeProvider,
  useInteractiveResume,
  useOptionalInteractiveResume,
  type EditableSectionType,
  type SelectedSection,
} from "./interactive-context";

export {
  EditableSection,
  EditableSectionHeader,
  EditableText,
} from "./editable-section";

export {
  SectionEditorPopover,
  useSectionEditor,
} from "./section-editor-popover";

export { SectionEditorController } from "./section-editor-controller";

// Re-export editors for direct usage if needed
export * from "./editors";
