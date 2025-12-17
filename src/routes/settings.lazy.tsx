import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/app/theme-provider";
import { DemoModeInfo } from "@/components/features/demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuthStore, useSettingsStore } from "@/stores";

export const Route = createLazyFileRoute("/settings")({
	component: SettingsComponent,
});

function SettingsComponent() {
	const router = useRouter();
	const { settings, updateSettings, resetSettings } = useSettingsStore();
	const { user, isGuest, isDemo } = useAuthStore();
	const { theme, setTheme } = useTheme();
	const { t } = useTranslation("settings");
	const { t: tCommon } = useTranslation("common");

	const handleThemeChange = (value: "light" | "dark" | "system") => {
		// Update both the theme provider and settings store
		setTheme(value);
		updateSettings({ theme: value });
	};

	const handleResetSettings = () => {
		if (window.confirm(tCommon("confirmation.deleteMessage"))) {
			resetSettings();
			// Also reset theme to system default
			setTheme("system");
		}
	};

	const handleGoBack = () => {
		// Use router history to go back to the previous page
		router.history.back();
	};

	// Get account status text
	const getAccountStatus = () => {
		if (isDemo) return t("sections.account.demoMode");
		if (isGuest) return t("sections.account.guestUser");
		return t("sections.account.authenticated");
	};

	const getAccountDescription = () => {
		if (isGuest) return t("sections.account.guestMode");
		return t("sections.account.loggedInAs", { email: user?.email || "User" });
	};

	return (
		<div className="container mx-auto max-w-4xl p-4 md:p-8">
			<div className="mb-8">
				<div className="mb-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleGoBack}
						className="gap-2 text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-4" />
						{tCommon("actions.back")}
					</Button>
				</div>
				<h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
				<p className="text-muted-foreground">{t("subtitle")}</p>
			</div>

			<div className="space-y-6">
				{/* Account Section */}
				<Card>
					<CardHeader>
						<CardTitle>{t("sections.account.title")}</CardTitle>
						<CardDescription>{getAccountDescription()}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label>{t("sections.account.status")}</Label>
								<p className="text-sm text-muted-foreground">{getAccountStatus()}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Demo Mode Section */}
				{(isGuest || isDemo) && <DemoModeInfo />}

				{/* Appearance Section */}
				<Card>
					<CardHeader>
						<CardTitle>{t("sections.appearance.title")}</CardTitle>
						<CardDescription>{t("sections.appearance.description")}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="theme">{t("sections.appearance.theme")}</Label>
								<p className="text-sm text-muted-foreground">
									{t("sections.appearance.selectTheme")}
								</p>
							</div>
							<Select value={theme} onValueChange={handleThemeChange}>
								<SelectTrigger id="theme" className="w-[180px]">
									<SelectValue placeholder={t("sections.appearance.theme")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">{t("sections.appearance.themeLight")}</SelectItem>
									<SelectItem value="dark">{t("sections.appearance.themeDark")}</SelectItem>
									<SelectItem value="system">{t("sections.appearance.themeSystem")}</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="language">{t("sections.appearance.language")}</Label>
								<p className="text-sm text-muted-foreground">
									{t("sections.appearance.selectLanguage")}
								</p>
							</div>
							<LanguageSwitcher variant="outline" size="default" />
						</div>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="reducedMotion">{t("sections.appearance.reducedMotion")}</Label>
								<p className="text-sm text-muted-foreground">
									{t("sections.appearance.reducedMotionDescription")}
								</p>
							</div>
							<Switch
								id="reducedMotion"
								checked={settings.reducedMotion}
								onCheckedChange={(checked: boolean) => updateSettings({ reducedMotion: checked })}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Editor Preferences */}
				<Card>
					<CardHeader>
						<CardTitle>{t("sections.editor.title")}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="autoSave">{t("sections.editor.autoSave")}</Label>
								<p className="text-sm text-muted-foreground">
									{t("sections.editor.autoSaveDescription")}
								</p>
							</div>
							<Switch
								id="autoSave"
								checked={settings.autoSave}
								onCheckedChange={(checked: boolean) => updateSettings({ autoSave: checked })}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Export Settings */}
				<Card>
					<CardHeader>
						<CardTitle>{t("sections.data.title")}</CardTitle>
						<CardDescription>{t("sections.data.description")}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="promptExportFilename">{t("sections.export.promptFilename")}</Label>
								<p className="text-sm text-muted-foreground">
									{t("sections.export.promptFilenameDescription")}
								</p>
							</div>
							<Switch
								id="promptExportFilename"
								checked={settings.promptExportFilename}
								onCheckedChange={(checked: boolean) =>
									updateSettings({ promptExportFilename: checked })
								}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Reset Settings */}
				<Card>
					<CardHeader>
						<CardTitle>{t("sections.reset.title")}</CardTitle>
						<CardDescription>{t("sections.reset.description")}</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" onClick={handleResetSettings} className="w-full sm:w-auto">
							<RotateCcw className="mr-2 h-4 w-4" />
							{tCommon("actions.reset")}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
