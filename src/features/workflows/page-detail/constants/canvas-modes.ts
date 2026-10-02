import { Icons, type Icon } from "@/components/icons";

export type CanvasMode = "select" | "pan";

export interface CanvasModeConfig {
  mode: CanvasMode;
  label: string;
  icon: Icon;
  shortcut: string;
}

export const CANVAS_MODES: CanvasModeConfig[] = [
  { mode: "select", label: "Select", icon: Icons.pointer, shortcut: "V" },
  { mode: "pan", label: "Hand", icon: Icons.hand, shortcut: "H" },
];
