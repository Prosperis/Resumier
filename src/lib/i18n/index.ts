/**
 * Internationalization (i18n) configuration
 * Uses react-i18next with lazy-loaded translation files
 */
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import type { Language } from "./types";

// Import translation files directly for bundling
import commonEn from "./locales/en/common.json";
import dashboardEn from "./locales/en/dashboard.json";
import editorEn from "./locales/en/editor.json";
import settingsEn from "./locales/en/settings.json";
import templatesEn from "./locales/en/templates.json";
import validationEn from "./locales/en/validation.json";

import commonEs from "./locales/es/common.json";
import dashboardEs from "./locales/es/dashboard.json";
import editorEs from "./locales/es/editor.json";
import settingsEs from "./locales/es/settings.json";
import templatesEs from "./locales/es/templates.json";
import validationEs from "./locales/es/validation.json";

/**
 * Supported languages configuration
 * Each language includes display names and text direction
 */
export const supportedLanguages: Language[] = [
	{ code: "en", name: "English", nativeName: "English", dir: "ltr" },
	{ code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
	// Future languages to add:
	// { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
	// { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
	// { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr" },
	// { code: "zh", name: "Chinese", nativeName: "中文", dir: "ltr" },
	// { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
	// { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr" },
];

/**
 * Translation resources bundled with the app
 */
const resources = {
	en: {
		common: commonEn,
		dashboard: dashboardEn,
		editor: editorEn,
		templates: templatesEn,
		validation: validationEn,
		settings: settingsEn,
	},
	es: {
		common: commonEs,
		dashboard: dashboardEs,
		editor: editorEs,
		templates: templatesEs,
		validation: validationEs,
		settings: settingsEs,
	},
};

/**
 * Initialize i18next with React integration
 */
i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		supportedLngs: supportedLanguages.map((l) => l.code),

		// Namespace configuration
		ns: ["common", "dashboard", "editor", "templates", "validation", "settings"],
		defaultNS: "common",

		// Language detection
		detection: {
			order: ["localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"],
			lookupLocalStorage: "resumier-language",
		},

		// Interpolation settings
		interpolation: {
			escapeValue: false, // React already escapes by default
		},

		// React specific
		react: {
			useSuspense: true,
		},
	});

/**
 * Get language configuration by code
 */
export function getLanguageByCode(code: string): Language | undefined {
	return supportedLanguages.find((lang) => lang.code === code);
}

/**
 * Get current language direction (ltr or rtl)
 */
export function getCurrentDirection(): "ltr" | "rtl" {
	const lang = getLanguageByCode(i18n.language);
	return lang?.dir || "ltr";
}

/**
 * Change language and update document direction
 */
export async function changeLanguage(langCode: string): Promise<void> {
	await i18n.changeLanguage(langCode);

	// Update document attributes for RTL support
	const lang = getLanguageByCode(langCode);
	if (lang) {
		document.documentElement.dir = lang.dir;
		document.documentElement.lang = langCode;
	}
}

export default i18n;
export { supportedLanguages as languages };

