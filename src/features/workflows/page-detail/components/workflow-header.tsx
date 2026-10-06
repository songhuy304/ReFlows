"use client";

import { AgentChatTrigger } from "@/components/agent-chat";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { WorkflowStatusBadge } from "../../components/workflow-status-badge";
import type { WorkflowStatus } from "../../types";
import type { ExportFormat } from "../constants/export-formats";
import type { WorkflowView } from "../constants/workflow-views";
import { EditableLabel } from "./editable-label";
import { WorkflowExportMenu } from "./workflow-export-menu";
import { WorkflowViewTabs } from "./workflow-view-tabs";

interface WorkflowHeaderProps {
  name: string;
  status?: WorkflowStatus;
  backHref?: string;
  isSaved?: boolean;
  isSaving?: boolean;
  isPublishing?: boolean;
  isRenaming?: boolean;
  view?: WorkflowView;
  onViewChange?: (view: WorkflowView) => void;
  onRename?: (name: string) => void;
  onSave?: () => void;
  onPublish?: () => void;
  onExport?: (format: ExportFormat) => void;
  className?: string;
}

interface WorkflowNameProps {
  name: string;
  isRenaming: boolean;
  onRename?: (name: string) => void;
}

function WorkflowName({ name, isRenaming, onRename }: WorkflowNameProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditableLabel
        value={name}
        className="h-8 min-w-0 rounded-md px-2 text-left text-sm font-semibold"
        onCommit={(next) => {
          setIsEditing(false);
          if (next !== name) onRename?.(next);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <button
      type="button"
      className="hover:bg-accent inline-flex min-w-0 items-center gap-1 rounded-md px-1.5 py-1 disabled:opacity-60"
      onClick={() => setIsEditing(true)}
      disabled={!onRename || isRenaming}
      aria-label="Rename workflow"
    >
      <Typography variant="h6" className="truncate">
        {name}
      </Typography>
      {isRenaming ? (
        <Icons.spinner className="text-muted-foreground size-4 shrink-0 animate-spin" />
      ) : (
        <Icons.edit className="text-muted-foreground size-4 shrink-0" />
      )}
    </button>
  );
}

function WorkflowHeader({
  name,
  status,
  backHref = "/workflows",
  isSaved = true,
  isSaving = false,
  isPublishing = false,
  isRenaming = false,
  view,
  onViewChange,
  onRename,
  onSave,
  onPublish,
  onExport,
  className,
}: WorkflowHeaderProps) {
  const isPublished = status === "PUBLISHED" && isSaved;

  return (
    <div
      className={cn(
        "bg-sidebar grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b px-2 md:px-4",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        <Button variant="ghost" size="icon" className="size-8 shrink-0" asChild>
          <Link href={backHref} aria-label="Back to workflows">
            <Icons.arrowLeft className="size-4" />
          </Link>
        </Button>
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-5"
        />
        <WorkflowName name={name} isRenaming={isRenaming} onRename={onRename} />
        {status && (
          <WorkflowStatusBadge status={status} className="hidden md:inline-flex" />
        )}
      </div>

      <WorkflowViewTabs value={view} onValueChange={onViewChange} />

      <div className="flex min-w-0 items-center justify-end gap-2">
        {!isSaving && (
          <span
            className={cn(
              "hidden items-center gap-1 text-xs sm:flex",
              isSaved ? "text-green-500" : "text-amber-500"
            )}
          >
            {isSaved ? (
              <>
                <Icons.check className="size-3.5" />
                Saved
              </>
            ) : (
              "Unsaved changes"
            )}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          disabled={isSaved || isPublishing}
          aria-label="Save changes"
        >
          <Icons.save className="size-4" />
          <span className="hidden sm:inline">Save changes</span>
        </Button>
        <Button
          size="sm"
          onClick={onPublish}
          isLoading={isPublishing}
          disabled={isSaving || isPublished}
          aria-label={isPublished ? "Published" : "Publish"}
        >
          <Icons.send className="size-4" />
          <span className="hidden sm:inline">
            {isPublished ? "Published" : "Publish"}
          </span>
        </Button>

        <WorkflowExportMenu onExport={onExport} />
        <AgentChatTrigger />
      </div>
    </div>
  );
}

export { WorkflowHeader };
