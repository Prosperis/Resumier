import {
  Code,
  Database,
  Download,
  FileCode,
  FileText,
  FileType,
  type LucideIcon,
  Printer,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Resume } from "@/lib/api/types"
import {
  downloadDOCX,
  downloadHTML,
  downloadJSON,
  downloadMarkdown,
  downloadPlainText,
  printResume,
} from "./export-utils"

interface ExportMenuProps {
  resume: Resume
}

type ExportFormat = {
  id: string
  label: string
  description: string
  icon: LucideIcon
  handler: () => void | Promise<void>
}

export function ExportMenu({ resume }: ExportMenuProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handlePrint = () => {
    printResume(resume.title)
    toast({
      title: "Opening print dialog",
      description: "You can save as PDF using your browser's print dialog",
    })
  }

  const handleDownloadPDF = () => {
    // For now, this just opens print dialog
    // Users can use "Save as PDF" option in their browser
    toast({
      title: "Download PDF",
      description: "Use your browser's print dialog and select 'Save as PDF'",
    })
    printResume(resume.title)
  }

  const handleExport = async (format: string, handler: () => void | Promise<void>) => {
    setIsExporting(true)
    try {
      await handler()
      toast({
        title: "Export successful",
        description: `Resume exported as ${format}`,
      })
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error)
      toast({
        title: "Export failed",
        description: `Failed to export resume as ${format}`,
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportFormats: ExportFormat[] = [
    {
      id: "pdf",
      label: "PDF",
      description: "Via browser print dialog",
      icon: FileText,
      handler: handleDownloadPDF,
    },
    {
      id: "docx",
      label: "Word Document",
      description: "DOCX format for editing",
      icon: FileType,
      handler: () => downloadDOCX(resume),
    },
    {
      id: "html",
      label: "HTML",
      description: "Web page with styles",
      icon: FileCode,
      handler: () =>
        downloadHTML(
          resume,
          `<h1>${resume.content.personalInfo.name}</h1><p>Resume content here</p>`,
        ),
    },
    {
      id: "markdown",
      label: "Markdown",
      description: "Developer-friendly format",
      icon: Code,
      handler: () => downloadMarkdown(resume),
    },
    {
      id: "txt",
      label: "Plain Text",
      description: "Universal compatibility",
      icon: FileText,
      handler: () => downloadPlainText(resume),
    },
    {
      id: "json",
      label: "JSON",
      description: "Structured data export",
      icon: Database,
      handler: () => downloadJSON(resume),
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Export Formats</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {exportFormats.map((format) => {
          const Icon = format.icon
          return (
            <DropdownMenuItem
              key={format.id}
              onClick={() => handleExport(format.label, format.handler)}
              className="cursor-pointer"
              disabled={isExporting}
            >
              <Icon className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span>{format.label}</span>
                <span className="text-xs text-muted-foreground">{format.description}</span>
              </div>
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handlePrint} className="cursor-pointer" disabled={isExporting}>
          <Printer className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>Print</span>
            <span className="text-xs text-muted-foreground">Open print preview</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
