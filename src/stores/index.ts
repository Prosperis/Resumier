// Store exports

export { useAnimationStore } from "./animation-store";
export type { User } from "./auth-store";
export {
  selectAuthActions,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
  useAuthStore,
} from "./auth-store";
export type {
  // API types (re-exported from @/lib/api/types)
  Certification,
  Education,
  Experience,
  ExperienceFormat,
  Link,
  LinkType,
  NameOrder,
  PersonalInfo,
  PhoneFormat,
  ResumeContent,
  Skills,
  SkillWithLevel,
  // Store-specific types
  CustomFont,
  JobInfo,
  ResumeDocument,
  StyleCustomization,
  UserInfo,
  WorkExperience,
  // Legacy types (deprecated, for backward compatibility)
  LegacyCertification,
  LegacyEducation,
  LegacyLink,
  LegacySkill,
} from "./resume-store";
export {
  selectContent,
  selectContentActions,
  selectDocuments,
  selectDocumentsActions,
  selectJobInfo,
  selectJobInfoActions,
  selectJobs,
  selectJobsActions,
  selectUserInfo,
  selectUserInfoActions,
  useResumeStore,
} from "./resume-store";
export type { HistoryChange, HistoryEntry, HistorySection, HistoryValue } from "./history-store";
export {
  getFieldLabel,
  selectCanRedo,
  selectCanUndo,
  selectCurrentIndex,
  selectHistoryActions,
  selectHistoryEntries,
  selectIsPreviewingHistory,
  selectPreviewEntry,
  useHistoryStore,
} from "./history-store";
export type { Theme } from "./theme-store";
export { selectSetTheme, selectTheme, selectToggleTheme, useThemeStore } from "./theme-store";
export {
  defaultProfileContent,
  selectActiveProfile,
  selectActiveProfileId,
  selectProfileActions,
  selectProfiles,
  useProfileStore,
} from "./profile-store";
export type { UserSettings } from "./settings-store";
export {
  selectAutoSave,
  selectAutoSaveInterval,
  selectReducedMotion,
  selectSettings,
  selectTheme as selectSettingsTheme,
  useSettingsStore,
} from "./settings-store";
export type { Notification, PersonalInfoSection, ResumeBuilderSection } from "./ui-store";
export {
  selectActiveDialog,
  selectDialogActions,
  selectDialogData,
  selectGlobalLoading,
  selectNotificationActions,
  selectNotifications,
  selectPersonalInfoSection,
  selectResumeBuilderSection,
  selectSetPersonalInfoSection,
  selectSetResumeBuilderSection,
  selectSidebarActions,
  selectSidebarCollapsed,
  selectSidebarOpen,
  selectToggleResumeBuilderSection,
  useUIStore,
} from "./ui-store";
