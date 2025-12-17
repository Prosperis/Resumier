/**
 * Internationalization type definitions
 * Provides type safety for translations with autocomplete support
 */

export interface Language {
	code: string;
	name: string;
	nativeName: string;
	dir: "ltr" | "rtl";
}

// Common translations type
export interface CommonTranslations {
	appName: string;
	tagline: string;
	actions: {
		save: string;
		cancel: string;
		delete: string;
		edit: string;
		add: string;
		create: string;
		update: string;
		download: string;
		export: string;
		import: string;
		preview: string;
		duplicate: string;
		close: string;
		confirm: string;
		back: string;
		next: string;
		submit: string;
		reset: string;
		search: string;
		filter: string;
		sort: string;
		clear: string;
		select: string;
		upload: string;
		remove: string;
		retry: string;
		continue: string;
		skip: string;
	};
	status: {
		loading: string;
		saving: string;
		saved: string;
		error: string;
		success: string;
		pending: string;
		processing: string;
		complete: string;
	};
	navigation: {
		dashboard: string;
		settings: string;
		profile: string;
		help: string;
		logout: string;
		login: string;
		signUp: string;
		home: string;
	};
	errors: {
		generic: string;
		notFound: string;
		unauthorized: string;
		networkError: string;
		validationError: string;
		serverError: string;
	};
	confirmation: {
		deleteTitle: string;
		deleteMessage: string;
		unsavedChanges: string;
	};
	time: {
		justNow: string;
		minutesAgo: string;
		hoursAgo: string;
		daysAgo: string;
		weeksAgo: string;
		monthsAgo: string;
	};
}

// Dashboard translations type
export interface DashboardTranslations {
	title: string;
	subtitle: string;
	newResume: string;
	noResumes: {
		title: string;
		description: string;
		cta: string;
	};
	resumeCard: {
		lastModified: string;
		created: string;
		template: string;
		untitled: string;
	};
	filters: {
		all: string;
		recent: string;
		favorites: string;
	};
	sort: {
		label: string;
		dateModified: string;
		dateCreated: string;
		name: string;
	};
	search: {
		placeholder: string;
		noResults: string;
	};
	stats: {
		totalResumes: string;
		totalResumes_plural: string;
	};
	tabs: {
		resumes: string;
		templates: string;
	};
	actions: {
		viewAll: string;
		createNew: string;
	};
}

// Editor translations type
export interface EditorTranslations {
	sections: {
		personalInfo: {
			title: string;
			description: string;
		};
		summary: {
			title: string;
			description: string;
			placeholder: string;
		};
		experience: {
			title: string;
			description: string;
			addButton: string;
		};
		education: {
			title: string;
			description: string;
			addButton: string;
		};
		skills: {
			title: string;
			description: string;
			addButton: string;
		};
		certifications: {
			title: string;
			description: string;
			addButton: string;
		};
		links: {
			title: string;
			description: string;
			addButton: string;
		};
	};
	fields: {
		name: string;
		email: string;
		phone: string;
		location: string;
		website: string;
		linkedin: string;
		github: string;
		company: string;
		position: string;
		startDate: string;
		endDate: string;
		current: string;
		description: string;
		institution: string;
		degree: string;
		field: string;
		gpa: string;
		skillName: string;
		skillLevel: string;
		certName: string;
		certIssuer: string;
		certDate: string;
		certExpiry: string;
		linkLabel: string;
		linkUrl: string;
		summary: string;
		title: string;
	};
	placeholders: {
		name: string;
		email: string;
		phone: string;
		location: string;
		company: string;
		position: string;
		institution: string;
		degree: string;
		skillName: string;
		summary: string;
	};
	toolbar: {
		template: string;
		export: string;
		save: string;
		autoSave: string;
		undo: string;
		redo: string;
		preview: string;
		download: string;
		print: string;
	};
	exportOptions: {
		pdf: string;
		docx: string;
		json: string;
		png: string;
	};
	messages: {
		saved: string;
		exportSuccess: string;
		exportError: string;
		deleteSuccess: string;
		reorderSuccess: string;
		updateSuccess: string;
		createSuccess: string;
	};
	skillLevels: {
		beginner: string;
		intermediate: string;
		advanced: string;
		expert: string;
	};
}

// Validation translations type
export interface ValidationTranslations {
	required: string;
	email: string;
	url: string;
	phone: string;
	minLength: string;
	maxLength: string;
	date: {
		invalid: string;
		future: string;
		endBeforeStart: string;
	};
	gpa: {
		invalid: string;
		format: string;
	};
}

// Templates translations type
export interface TemplatesTranslations {
	title: string;
	subtitle: string;
	categories: {
		all: string;
		professional: string;
		creative: string;
		modern: string;
		simple: string;
		academic: string;
	};
	preview: string;
	select: string;
	current: string;
	popular: string;
	new: string;
}

// Settings translations type
export interface SettingsTranslations {
	title: string;
	subtitle: string;
	sections: {
		appearance: {
			title: string;
			description: string;
			theme: string;
			themeLight: string;
			themeDark: string;
			themeSystem: string;
			language: string;
		};
		account: {
			title: string;
			description: string;
			email: string;
			password: string;
			changePassword: string;
			deleteAccount: string;
		};
		data: {
			title: string;
			description: string;
			exportData: string;
			importData: string;
			clearData: string;
			clearDataWarning: string;
		};
		notifications: {
			title: string;
			description: string;
			email: string;
			browser: string;
		};
	};
	saved: string;
}

// Combined translation resources
export interface TranslationResources {
	common: CommonTranslations;
	dashboard: DashboardTranslations;
	editor: EditorTranslations;
	validation: ValidationTranslations;
	templates: TemplatesTranslations;
	settings: SettingsTranslations;
}

// Extend i18next types for autocomplete
declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "common";
		resources: TranslationResources;
	}
}

