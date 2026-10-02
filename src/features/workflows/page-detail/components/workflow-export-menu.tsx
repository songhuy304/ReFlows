"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EXPORT_FORMATS, type ExportFormat } from "../constants/export-formats";

interface WorkflowExportMenuProps {
  onExport?: (format: ExportFormat) => void;
  disabled?: boolean;
}

function WorkflowExportMenu({ onExport, disabled }: WorkflowExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} aria-label="Export">
          <Icons.download className="size-4" />
          <span className="hidden sm:inline">Export</span>
          <Icons.chevronDown className="text-muted-foreground size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {EXPORT_FORMATS.map((item) => (
          <DropdownMenuItem key={item.format} onSelect={() => onExport?.(item.format)}>
            <item.icon className="size-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { WorkflowExportMenu };
