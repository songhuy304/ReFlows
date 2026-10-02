"use client";

import { cn } from "@/lib/utils";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
} from "@xyflow/react";
import { createContext, memo, useContext } from "react";
import { EditableLabel } from "./editable-label";

type LabeledEdgeData = {
  label?: string;
};

type LabeledEdgeType = Edge<LabeledEdgeData, "labeled">;

interface EdgeEditingContextValue {
  editingEdgeId: string | null;
  setEditingEdgeId: (id: string | null) => void;
}

const EdgeEditingContext = createContext<EdgeEditingContextValue>({
  editingEdgeId: null,
  setEditingEdgeId: () => {},
});

function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  selected,
  data,
}: EdgeProps<LabeledEdgeType>) {
  const { updateEdgeData } = useReactFlow<Node, LabeledEdgeType>();
  const { editingEdgeId, setEditingEdgeId } = useContext(EdgeEditingContext);
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const label = data?.label ?? "";
  const isEditing = editingEdgeId === id;

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {(label || isEditing) && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-auto absolute"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
            onDoubleClick={() => setEditingEdgeId(id)}
          >
            <div
              className={cn(
                "bg-background text-foreground rounded-md border px-2 py-0.5 text-xs shadow-sm",
                (selected || isEditing) && "border-primary"
              )}
            >
              {isEditing ? (
                <EditableLabel
                  value={label}
                  allowEmpty
                  placeholder="Add text"
                  className="w-24 text-xs"
                  onCommit={(next) => {
                    updateEdgeData(id, { label: next });
                    setEditingEdgeId(null);
                  }}
                  onCancel={() => setEditingEdgeId(null)}
                />
              ) : (
                <span title="Double-click to edit">{label}</span>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const MemoizedLabeledEdge = memo(LabeledEdge);

export { EdgeEditingContext, MemoizedLabeledEdge as LabeledEdge };
export type { LabeledEdgeData, LabeledEdgeType };
