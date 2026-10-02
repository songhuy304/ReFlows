"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
  type Connection,
  type DefaultEdgeOptions,
  type EdgeChange,
  type EdgeMouseHandler,
  type EdgeTypes,
  type NodeChange,
  type NodeTypes,
  type XYPosition,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useCallback, useMemo, useRef, useState, type DragEvent } from "react";
import type { CanvasMode } from "../constants/canvas-modes";
import {
  getShapeConfig,
  isShapeType,
  SHAPE_DRAG_MIME,
  type ShapeType,
} from "../constants/shapes";
import { useCanvasShortcuts } from "../hooks/use-canvas-shortcuts";
import { CanvasToolbar } from "./canvas-toolbar";
import { EdgeEditingContext, LabeledEdge, type LabeledEdgeType } from "./labeled-edge";
import { ShapeNode, type ShapeNodeType } from "./shape-node";

const nodeTypes: NodeTypes = { shape: ShapeNode };

const edgeTypes: EdgeTypes = { labeled: LabeledEdge };

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "labeled",
  markerEnd: { type: MarkerType.ArrowClosed },
};

const PAN_WITH_MIDDLE_OR_RIGHT_BUTTON = [1, 2];

const initialNodes: ShapeNodeType[] = [
  {
    id: "1",
    type: "shape",
    position: { x: 0, y: 0 },
    width: 160,
    height: 56,
    data: { label: "Order created", shape: "rounded" },
  },
  {
    id: "2",
    type: "shape",
    position: { x: 10, y: 120 },
    width: 140,
    height: 100,
    data: { label: "Valid order?", shape: "diamond" },
  },
  {
    id: "3",
    type: "shape",
    position: { x: 0, y: 290 },
    width: 160,
    height: 56,
    data: { label: "Send confirmation", shape: "rounded" },
  },
];

const initialEdges: LabeledEdgeType[] = [
  {
    id: "e1-2",
    source: "1",
    sourceHandle: "bottom",
    target: "2",
    targetHandle: "top",
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    sourceHandle: "bottom",
    target: "3",
    targetHandle: "top",
    data: { label: "Yes" },
  },
];

function createShapeNode(shape: ShapeType, center: XYPosition): ShapeNodeType {
  const config = getShapeConfig(shape);

  return {
    id: crypto.randomUUID(),
    type: "shape",
    position: { x: center.x - config.width / 2, y: center.y - config.height / 2 },
    width: config.width,
    height: config.height,
    data: { label: config.defaultLabel, shape },
  };
}

function WorkflowFlow() {
  const { resolvedTheme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<ShapeNodeType[]>(initialNodes);
  const [edges, setEdges] = useState<LabeledEdgeType[]>(initialEdges);
  const [mode, setMode] = useState<CanvasMode>("select");
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const isSelectMode = mode === "select";

  const edgeEditing = useMemo(
    () => ({ editingEdgeId, setEditingEdgeId }),
    [editingEdgeId]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<ShapeNodeType>[]) =>
      setNodes((current) => applyNodeChanges(changes, current)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<LabeledEdgeType>[]) =>
      setEdges((current) => applyEdgeChanges(changes, current)),
    []
  );

  const onEdgeDoubleClick: EdgeMouseHandler<LabeledEdgeType> = useCallback((_, edge) => {
    setEditingEdgeId(edge.id);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((current) => addEdge(connection, current)),
    []
  );

  const addShapeAt = useCallback((shape: ShapeType, center: XYPosition) => {
    setNodes((current) => [...current, createShapeNode(shape, center)]);
  }, []);

  const handleAddShape = useCallback(
    (shape: ShapeType) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const center = screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });
      addShapeAt(shape, center);
    },
    [addShapeAt, screenToFlowPosition]
  );

  useCanvasShortcuts({ onModeChange: setMode, onAddShape: handleAddShape });

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes(SHAPE_DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      const shape = event.dataTransfer.getData(SHAPE_DRAG_MIME);
      if (!isShapeType(shape)) return;
      event.preventDefault();

      addShapeAt(shape, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    },
    [addShapeAt, screenToFlowPosition]
  );

  return (
    <div
      ref={containerRef}
      className="min-h-125 w-full flex-1 overflow-hidden rounded-xl border"
    >
      <EdgeEditingContext.Provider value={edgeEditing}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.SmoothStep}
          selectionOnDrag={isSelectMode}
          selectionMode={SelectionMode.Partial}
          panOnDrag={isSelectMode ? PAN_WITH_MIDDLE_OR_RIGHT_BUTTON : true}
          panOnScroll={isSelectMode}
          zoomOnDoubleClick={false}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onPaneContextMenu={(event) => event.preventDefault()}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          colorMode={resolvedTheme === "dark" ? "dark" : "light"}
          fitView
          fitViewOptions={{ padding: { y: "40px", x: "80px" } }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <CanvasToolbar mode={mode} onModeChange={setMode} onAddShape={handleAddShape} />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </EdgeEditingContext.Provider>
    </div>
  );
}

function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowFlow />
    </ReactFlowProvider>
  );
}

export { WorkflowCanvas };
