"use client";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Panel } from "@xyflow/react";
import type { DragEvent, ReactNode } from "react";
import { CANVAS_MODES, type CanvasMode } from "../constants/canvas-modes";
import { SHAPE_DRAG_MIME, SHAPES, type ShapeType } from "../constants/shapes";

interface CanvasToolbarProps {
  mode: CanvasMode;
  onModeChange: (mode: CanvasMode) => void;
  onAddShape: (shape: ShapeType) => void;
}

interface ToolTooltipProps {
  label: string;
  shortcut: string;
  children: ReactNode;
}

function ToolTooltip({ label, shortcut, children }: ToolTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-2">
        {label}
        <Kbd>{shortcut}</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}

function handleDragStart(event: DragEvent<HTMLButtonElement>, shape: ShapeType) {
  event.dataTransfer.setData(SHAPE_DRAG_MIME, shape);
  event.dataTransfer.effectAllowed = "move";
}

function CanvasToolbar({ mode, onModeChange, onAddShape }: CanvasToolbarProps) {
  return (
    <Panel
      position="center-left"
      className="bg-background/80 supports-backdrop-filter:bg-background/60 flex flex-col gap-1 rounded-lg border p-1 shadow-sm backdrop-blur"
    >
      {CANVAS_MODES.map((item) => (
        <ToolTooltip key={item.mode} label={item.label} shortcut={item.shortcut}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-8",
              mode === item.mode && "bg-accent text-accent-foreground"
            )}
            onClick={() => onModeChange(item.mode)}
            aria-label={item.label}
            aria-keyshortcuts={item.shortcut}
            aria-pressed={mode === item.mode}
          >
            <item.icon className="size-4" />
          </Button>
        </ToolTooltip>
      ))}

      <Separator className="my-0.5" />

      {SHAPES.map((shape) => (
        <ToolTooltip key={shape.type} label={shape.label} shortcut={shape.shortcut}>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={(event) => handleDragStart(event, shape.type)}
            onClick={() => onAddShape(shape.type)}
            aria-label={`Add ${shape.label}`}
            aria-keyshortcuts={shape.shortcut}
          >
            <shape.icon className="size-4" />
          </Button>
        </ToolTooltip>
      ))}
    </Panel>
  );
}

export { CanvasToolbar };
