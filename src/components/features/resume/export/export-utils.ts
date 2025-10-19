import type { Resume } from "@/lib/api/types"

/**
 * Print the resume using browser's print dialog
 * This creates a PDF through the browser's print-to-PDF functionality
 */
export function printResume(resumeTitle: string) {
  // Set page title for PDF filename suggestion
  const originalTitle = document.title
  document.title = resumeTitle

  // Trigger print dialog
  window.print()

  // Restore original title after print
  setTimeout(() => {
    document.title = originalTitle
  }, 1000)
}

/**
 * Open print preview
 */
export function openPrintPreview() {
  window.print()
}

/**
 * Download resume as HTML file
 */
export function downloadHTML(resume: Resume, htmlContent: string) {
  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${resume.title}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Copy resume content to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    return false
  }
}

/**
 * Format date for resume display
 */
export function formatResumeDate(dateString: string): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}
