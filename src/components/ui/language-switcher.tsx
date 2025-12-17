/**
 * Language Switcher component
 * Allows users to change the application language
 */
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeLanguage, supportedLanguages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
	/** Show full language name on larger screens */
	showLabel?: boolean;
	/** Additional CSS classes */
	className?: string;
	/** Button variant */
	variant?: "default" | "outline" | "ghost" | "secondary";
	/** Button size */
	size?: "default" | "sm" | "lg" | "icon";
}

export function LanguageSwitcher({
	showLabel = true,
	className,
	variant = "ghost",
	size = "sm",
}: LanguageSwitcherProps) {
	const { i18n } = useTranslation();

	const currentLanguage = supportedLanguages.find((lang) => lang.code === i18n.language);

	const handleLanguageChange = async (langCode: string) => {
		await changeLanguage(langCode);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={variant} size={size} className={cn("gap-2", className)}>
					<Globe className="h-4 w-4" />
					{showLabel && (
						<span className="hidden sm:inline">{currentLanguage?.nativeName || "English"}</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-[160px]">
				{supportedLanguages.map((lang) => (
					<DropdownMenuItem
						key={lang.code}
						onClick={() => handleLanguageChange(lang.code)}
						className={cn(
							"cursor-pointer justify-between",
							i18n.language === lang.code && "bg-accent",
						)}
					>
						<span>{lang.nativeName}</span>
						<span className="text-muted-foreground text-xs">({lang.name})</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

