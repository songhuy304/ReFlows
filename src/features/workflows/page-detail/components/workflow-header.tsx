"use client";

import { AgentChatTrigger } from "@/components/agent-chat";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface WorkflowHeaderProps {
  name: string;
  backHref?: string;
  isSaved?: boolean;
  isSaving?: boolean;
  isPublishing?: boolean;
  onSave?: () => void;
  onPublish?: () => void;
  className?: string;
}

function WorkflowHeader({
  name,
  backHref = "/workflows",
  isSaved = true,
  isSaving = false,
  isPublishing = false,
  onSave,
  onPublish,
  className,
}: WorkflowHeaderProps) {
  return (
    <div
      className={cn(
        "bg-sidebar flex h-12 shrink-0 items-center justify-between gap-3 border-b px-2 md:px-4",
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
        <Typography variant="h6" className="truncate inline-flex items-center gap-1">
          {name}
          <Icons.edit className="size-4 text-muted-foreground" />
        </Typography>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isSaved && !isSaving && (
          <span className="text-green-500 hidden items-center gap-1 text-xs sm:flex">
            <Icons.check className="size-3.5" />
            Saved
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          aria-label="Save changes"
        >
          <Icons.save className="size-4" />
          <span className="hidden sm:inline">Save changes</span>
        </Button>
        <Button
          size="sm"
          onClick={onPublish}
          isLoading={isPublishing}
          disabled={isSaving}
          aria-label="Publish"
        >
          <Icons.send className="size-4" />
          <span className="hidden sm:inline">Publish</span>
        </Button>

        <AgentChatTrigger />
      </div>
    </div>
  );
}

export { WorkflowHeader };
