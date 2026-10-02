"use client";

import { cn } from "@/lib/utils";
import {
  Handle,
  NodeResizer,
  Position,
  useReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { memo, useState, type ReactNode } from "react";
import { getShapeConfig, type ShapeType } from "../constants/shapes";
import { EditableLabel } from "./editable-label";

type ShapeNodeData = {
  label: string;
  shape: ShapeType;
};

type ShapeNodeType = Node<ShapeNodeData, "shape">;

const HANDLE_POSITIONS = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const;

const STROKE_WIDTH = 1.5;

interface ShapeOutlineProps {
  shape: ShapeType;
  width: number;
  height: number;
  selected: boolean;
}

function ShapeOutline({ shape, width, height, selected }: ShapeOutlineProps) {
  const inset = STROKE_WIDTH;
  const innerWidth = Math.max(width - inset * 2, 0);
  const innerHeight = Math.max(height - inset * 2, 0);
  const className = cn("fill-card", selected ? "stroke-primary" : "stroke-border");

  let outline: ReactNode = null;
  switch (shape) {
    case "rectangle":
    case "rounded":
      outline = (
        <rect
          x={inset}
          y={inset}
          width={innerWidth}
          height={innerHeight}
          rx={shape === "rounded" ? 12 : 2}
          className={className}
        />
      );
      break;
    case "circle":
      outline = (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={innerWidth / 2}
          ry={innerHeight / 2}
          className={className}
        />
      );
      break;
    case "diamond":
      outline = (
        <polygon
          points={`${width / 2},${inset} ${width - inset},${height / 2} ${width / 2},${height - inset} ${inset},${height / 2}`}
          className={className}
        />
      );
      break;
    case "text":
      return null;
  }

  return (
    <svg
      width={width}
      height={height}
      className="absolute inset-0 drop-shadow-sm"
      strokeWidth={STROKE_WIDTH}
    >
      {outline}
    </svg>
  );
}

function ShapeNode({ id, data, selected, width, height }: NodeProps<ShapeNodeType>) {
  const { updateNodeData } = useReactFlow<ShapeNodeType>();
  const [isEditing, setIsEditing] = useState(false);
  const config = getShapeConfig(data.shape);
  const nodeWidth = width ?? config.width;
  const nodeHeight = height ?? config.height;
  const isText = data.shape === "text";

  return (
    <div
      onDoubleClick={() => setIsEditing(true)}
      className={cn(
        "group text-card-foreground relative size-full",
        isText && selected && "outline-primary rounded-sm outline-1 outline-dashed"
      )}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={isText ? 40 : 60}
        minHeight={isText ? 24 : 40}
      />

      <ShapeOutline
        shape={data.shape}
        width={nodeWidth}
        height={nodeHeight}
        selected={selected}
      />

      {!isText &&
        HANDLE_POSITIONS.map((handle) => (
          <Handle
            key={handle.id}
            id={handle.id}
            type="source"
            position={handle.position}
            className={cn(
              "opacity-0 transition-opacity group-hover:opacity-100",
              selected && "opacity-100"
            )}
          />
        ))}

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center px-3",
          data.shape === "diamond" && "px-[22%]",
          data.shape === "circle" && "px-[15%]"
        )}
      >
        {isEditing ? (
          <EditableLabel
            value={data.label}
            onCommit={(label) => {
              updateNodeData(id, { label });
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p
            className={cn(
              "line-clamp-3 text-center text-sm wrap-break-word",
              isText && "font-medium"
            )}
            title="Double-click to edit"
          >
            {data.label}
          </p>
        )}
      </div>
    </div>
  );
}

const MemoizedShapeNode = memo(ShapeNode);

export { MemoizedShapeNode as ShapeNode };
export type { ShapeNodeData, ShapeNodeType };
