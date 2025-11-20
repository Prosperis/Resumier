import {
  Code,
  Database,
  Download,
  FileCode,
  FileText,
  FileType,
  type LucideIcon,
  Printer,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Resume } from "@/lib/api/types";
import {
  downloadDOCX,
  downloadHTML,
  downloadJSON,
  downloadMarkdown,
  downloadPDFWithTemplate,
  downloadPlainText,
  printResume,
} from "./export-utils";

interface ExportMenuProps {
  resume: Resume;
}

type ExportFormat = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  handler: () => void | Promise<void>;
};

export function ExportMenu({ resume }: ExportMenuProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    printResume(resume);
    toast({
      title: "Opening print dialog",
      description: "You can save as PDF using your browser's print dialog",
    });
  };

  const handleDownloadPDF = async () => {
    try {
      await downloadPDFWithTemplate(resume);
      toast({
        title: "Print Dialog Opened",
        description:
          'Select "Save as PDF" in the print dialog to save your resume with perfect formatting.',
        duration: 5000,
      });
    } catch (error) {
      console.error("Error opening print dialog:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Print Failed",
        description: `Failed to open print dialog: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleExport = async (
    format: string,
    handler: () => void | Promise<void>,
  ) => {
    setIsExporting(true);
    try {
      await handler();
      toast({
        title: "Export successful",
        description: `Resume exported as ${format}`,
      });
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast({
        title: "Export failed",
        description: `Failed to export resume as ${format}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportFormats: ExportFormat[] = [
    {
      id: "pdf",
      label: "PDF",
      description: "Print to PDF - perfect style preservation",
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
      handler: () => downloadHTML(resume),
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
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Export Formats</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {exportFormats.map((format) => {
          const Icon = format.icon;
          return (
            <DropdownMenuItem
              key={format.id}
              onClick={() => handleExport(format.label, format.handler)}
              className="cursor-pointer"
              disabled={isExporting}
            >
              <Icon className="mr-2 h-4 w-4" />
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span>{format.label}</span>
                  {format.id === "pdf" && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1.5 py-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    >
                      Recommended
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  {format.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handlePrint}
          className="cursor-pointer"
          disabled={isExporting}
        >
          <Printer className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Print</span>
            <span className="text-muted-foreground text-xs">
              Open print preview
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
