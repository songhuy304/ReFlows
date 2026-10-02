import { Icons, type Icon } from "@/components/icons";

export type ExportFormat = "pdf" | "png" | "svg" | "json";

export interface ExportFormatConfig {
  format: ExportFormat;
  label: string;
  icon: Icon;
}

export const EXPORT_FORMATS: ExportFormatConfig[] = [
  { format: "pdf", label: "Export as PDF", icon: Icons.fileTypePdf },
  { format: "png", label: "Export as PNG", icon: Icons.fileTypePng },
  { format: "svg", label: "Export as SVG", icon: Icons.fileTypeSvg },
  { format: "json", label: "Export as JSON", icon: Icons.fileTypeJson },
];
