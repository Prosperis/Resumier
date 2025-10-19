import { Download, FileText, Printer } from "lucide-react"
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
import { printResume } from "./export-utils"

interface ExportMenuProps {
  resume: Resume
}

export function ExportMenu({ resume }: ExportMenuProps) {
  const { toast } = useToast()

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDownloadPDF} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>Download as PDF</span>
            <span className="text-xs text-muted-foreground">Via browser print dialog</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
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
