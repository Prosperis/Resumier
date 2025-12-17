/**
 * Custom i18n hooks for type-safe translations
 */
import { useCallback } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";

import {
  changeLanguage,
  getCurrentDirection,
  getLanguageByCode,
  supportedLanguages,
} from "@/lib/i18n";
import type { Language } from "@/lib/i18n/types";

/**
 * Hook for accessing translations with namespace support
 *
 * @example
 * ```tsx
 * // Use common namespace (default)
 * const { t } = useAppTranslation();
 * <span>{t("actions.save")}</span>
 *
 * // Use specific namespace
 * const { t } = useAppTranslation("dashboard");
 * <h1>{t("title")}</h1>
 *
 * // With interpolation
 * <span>{t("resumeCard.lastModified", { date: "Dec 17, 2025" })}</span>
 * ```
 */
export function useAppTranslation(
  namespace: "common" | "dashboard" | "editor" | "templates" | "validation" | "settings" = "common",
) {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  return {
    t,
    i18n,
    ready,
    currentLanguage: i18n.language,
    isRTL: getCurrentDirection() === "rtl",
  };
}

/**
 * Hook for language management
 *
 * @example
 * ```tsx
 * const { currentLanguage, languages, setLanguage, isRTL } = useLanguage();
 *
 * <select value={currentLanguage.code} onChange={(e) => setLanguage(e.target.value)}>
 *   {languages.map((lang) => (
 *     <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
 *   ))}
 * </select>
 * ```
 */
export function useLanguage() {
  const { i18n } = useI18nTranslation();

  const currentLanguage: Language = getLanguageByCode(i18n.language) || supportedLanguages[0];

  const setLanguage = useCallback(async (langCode: string) => {
    await changeLanguage(langCode);
  }, []);

  return {
    /** Current active language configuration */
    currentLanguage,
    /** All supported languages */
    languages: supportedLanguages,
    /** Change the application language */
    setLanguage,
    /** Whether current language is RTL */
    isRTL: currentLanguage.dir === "rtl",
    /** Current language code */
    languageCode: i18n.language,
  };
}

/**
 * Hook for formatting dates according to current locale
 *
 * @example
 * ```tsx
 * const { formatDate, formatRelativeTime } = useDateFormatter();
 *
 * <span>{formatDate(new Date())}</span>
 * <span>{formatRelativeTime(pastDate)}</span>
 * ```
 */
export function useDateFormatter() {
  const { i18n, t } = useI18nTranslation("common");

  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "medium",
        ...options,
      }).format(dateObj);
    },
    [i18n.language],
  );

  const formatDateTime = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "medium",
        timeStyle: "short",
        ...options,
      }).format(dateObj);
    },
    [i18n.language],
  );

  const formatRelativeTime = useCallback(
    (date: Date | string) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);

      if (diffMinutes < 1) {
        return t("time.justNow");
      }
      if (diffMinutes < 60) {
        return t("time.minutesAgo", { count: diffMinutes });
      }
      if (diffHours < 24) {
        return t("time.hoursAgo", { count: diffHours });
      }
      if (diffDays < 7) {
        return t("time.daysAgo", { count: diffDays });
      }
      if (diffWeeks < 4) {
        return t("time.weeksAgo", { count: diffWeeks });
      }
      return t("time.monthsAgo", { count: diffMonths });
    },
    [t],
  );

  return {
    formatDate,
    formatDateTime,
    formatRelativeTime,
  };
}

/**
 * Hook for formatting numbers according to current locale
 *
 * @example
 * ```tsx
 * const { formatNumber, formatCurrency, formatPercent } = useNumberFormatter();
 *
 * <span>{formatNumber(1234567)}</span>
 * <span>{formatCurrency(99.99, "USD")}</span>
 * <span>{formatPercent(0.85)}</span>
 * ```
 */
export function useNumberFormatter() {
  const { i18n } = useI18nTranslation();

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(i18n.language, options).format(value);
    },
    [i18n.language],
  );

  const formatCurrency = useCallback(
    (value: number, currency: string = "USD") => {
      return new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency,
      }).format(value);
    },
    [i18n.language],
  );

  const formatPercent = useCallback(
    (value: number, decimals: number = 0) => {
      return new Intl.NumberFormat(i18n.language, {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);
    },
    [i18n.language],
  );

  return {
    formatNumber,
    formatCurrency,
    formatPercent,
  };
}
