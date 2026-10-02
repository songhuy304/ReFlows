"use client";

import { useCallback, useMemo, useState } from "react";
import type { IWorkflowGraph } from "../../types";
import type { LabeledEdgeType } from "../components/labeled-edge";
import type { ShapeNodeType } from "../components/shape-node";
import { fromWorkflowGraph, toWorkflowGraph } from "../utils/workflow-graph";

export function useWorkflowEditor(savedGraph: IWorkflowGraph) {
  const [initial] = useState(() => fromWorkflowGraph(savedGraph));
  const [nodes, setNodes] = useState<ShapeNodeType[]>(initial.nodes);
  const [edges, setEdges] = useState<LabeledEdgeType[]>(initial.edges);
  const [fitViewKey, setFitViewKey] = useState(0);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(toWorkflowGraph(initial.nodes, initial.edges))
  );

  const currentGraph = useMemo(() => toWorkflowGraph(nodes, edges), [nodes, edges]);
  const isDirty = useMemo(
    () => JSON.stringify(currentGraph) !== savedSnapshot,
    [currentGraph, savedSnapshot]
  );

  const markSaved = useCallback((graph: IWorkflowGraph) => {
    setSavedSnapshot(JSON.stringify(graph));
  }, []);

  const applyGraph = useCallback(
    (graph: IWorkflowGraph) => {
      const next = fromWorkflowGraph(graph, nodes);
      setNodes(next.nodes);
      setEdges(next.edges);
      setFitViewKey((key) => key + 1);
    },
    [nodes]
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    currentGraph,
    isDirty,
    markSaved,
    applyGraph,
    fitViewKey,
  };
}
