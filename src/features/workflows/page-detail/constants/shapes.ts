import { Icons, type Icon } from "@/components/icons";

export type ShapeType = "rectangle" | "rounded" | "circle" | "diamond" | "text";

export interface ShapeConfig {
  type: ShapeType;
  label: string;
  icon: Icon;
  shortcut: string;
  defaultLabel: string;
  width: number;
  height: number;
}

export const SHAPES: ShapeConfig[] = [
  {
    type: "rectangle",
    label: "Rectangle",
    icon: Icons.shapeRectangle,
    shortcut: "1",
    defaultLabel: "Step",
    width: 160,
    height: 64,
  },
  {
    type: "rounded",
    label: "Rounded rectangle",
    icon: Icons.shapeRounded,
    shortcut: "2",
    defaultLabel: "Action",
    width: 160,
    height: 64,
  },
  {
    type: "circle",
    label: "Circle",
    icon: Icons.circle,
    shortcut: "3",
    defaultLabel: "Start / End",
    width: 96,
    height: 96,
  },
  {
    type: "diamond",
    label: "Diamond (decision)",
    icon: Icons.shapeDiamond,
    shortcut: "4",
    defaultLabel: "Condition?",
    width: 140,
    height: 100,
  },
  {
    type: "text",
    label: "Text",
    icon: Icons.text,
    shortcut: "5",
    defaultLabel: "Text",
    width: 120,
    height: 40,
  },
];

export const SHAPE_DRAG_MIME = "application/x-workflow-shape";

export function isShapeType(value: string): value is ShapeType {
  return SHAPES.some((shape) => shape.type === value);
}

export function getShapeConfig(type: ShapeType): ShapeConfig {
  return SHAPES.find((shape) => shape.type === type) ?? SHAPES[0];
}
