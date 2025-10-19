import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { experienceSchema } from "@/lib/validations/experience"
import { PlusIcon, XIcon } from "lucide-react"

type ExperienceFormValues = z.infer<typeof experienceSchema>

interface ExperienceFormDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: ExperienceFormValues) => void
	defaultValues?: ExperienceFormValues
	title?: string
	description?: string
}

export function ExperienceFormDialog({
	open,
	onOpenChange,
	onSubmit,
	defaultValues,
	title = "Add Experience",
	description = "Add your work experience details.",
}: ExperienceFormDialogProps) {
	const [highlights, setHighlights] = useState<string[]>(
		defaultValues?.highlights || [""]
	)

	const form = useForm<ExperienceFormValues>({
		resolver: zodResolver(experienceSchema),
		defaultValues: defaultValues || {
			company: "",
			position: "",
			startDate: "",
			endDate: "",
			current: false,
			description: "",
			highlights: [],
		},
	})

	const isCurrent = form.watch("current")

	const handleSubmit = (values: ExperienceFormValues) => {
		// Filter out empty highlights
		const filteredHighlights = highlights.filter((h) => h.trim() !== "")
		onSubmit({ ...values, highlights: filteredHighlights })
		onOpenChange(false)
		form.reset()
		setHighlights([""])
	}

	const addHighlight = () => {
		setHighlights([...highlights, ""])
	}

	const removeHighlight = (index: number) => {
		setHighlights(highlights.filter((_, i) => i !== index))
	}

	const updateHighlight = (index: number, value: string) => {
		const newHighlights = [...highlights]
		newHighlights[index] = value
		setHighlights(newHighlights)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="company"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company</FormLabel>
									<FormControl>
										<Input placeholder="Acme Inc." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="position"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Position</FormLabel>
									<FormControl>
										<Input placeholder="Software Engineer" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Date</FormLabel>
										<FormControl>
											<Input type="month" {...field} />
										</FormControl>
										<FormDescription>Format: YYYY-MM</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>End Date</FormLabel>
										<FormControl>
											<Input type="month" {...field} disabled={isCurrent} />
										</FormControl>
										<FormDescription>
											{isCurrent ? "Currently working" : "Format: YYYY-MM"}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="current"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked)
												if (checked) {
													form.setValue("endDate", "")
												}
											}}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>I currently work here</FormLabel>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Brief overview of your role and responsibilities..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-2">
							<FormLabel>Key Highlights</FormLabel>
							<FormDescription>
								Add bullet points for your achievements and responsibilities
							</FormDescription>
							{highlights.map((highlight, index) => (
								<div key={index} className="flex gap-2">
									<Input
										placeholder="Led a team of 5 engineers..."
										value={highlight}
										onChange={(e) => updateHighlight(index, e.target.value)}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeHighlight(index)}
										disabled={highlights.length === 1}
									>
										<XIcon className="h-4 w-4" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addHighlight}
								className="w-full"
							>
								<PlusIcon className="mr-2 h-4 w-4" />
								Add Highlight
							</Button>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
