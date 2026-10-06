import { graphlib, layout } from "@dagrejs/dagre";
import type {
  IWorkflowEdge,
  IWorkflowGraph,
  IWorkflowNode,
  IWorkflowNodePosition,
} from "../../types";
import type { LabeledEdgeType } from "../components/labeled-edge";
import type { ShapeNodeType } from "../components/shape-node";
import { getShapeConfig, isShapeType } from "../constants/shapes";

const LAYOUT_OPTIONS = { rankdir: "TB", nodesep: 80, ranksep: 80, edgesep: 20 };

const OVERLAP_GAP = 16;
const EDGE_LABEL_CHAR_WIDTH = 7;
const EDGE_LABEL_PADDING = 24;
const EDGE_LABEL_HEIGHT = 24;

export interface CanvasGraph {
  nodes: ShapeNodeType[];
  edges: LabeledEdgeType[];
}

function isValidPosition(
  position: IWorkflowNodePosition | undefined
): position is IWorkflowNodePosition {
  return Number.isFinite(position?.x) && Number.isFinite(position?.y);
}

function toShapeNode(node: IWorkflowNode, previous?: ShapeNodeType): ShapeNodeType {
  const shape = isShapeType(node.data.shape) ? node.data.shape : "rectangle";
  const config = getShapeConfig(shape);

  return {
    id: node.id,
    type: "shape",
    position: isValidPosition(node.position) ? node.position : { x: 0, y: 0 },
    width: previous?.width ?? config.width,
    height: previous?.height ?? config.height,
    data: { ...node.data, label: node.data.label ?? "", shape },
  };
}

function toLabeledEdge(edge: IWorkflowEdge): LabeledEdgeType {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "labeled",
    data: edge.data ? { ...edge.data } : undefined,
  };
}

function getNodeSize(node: ShapeNodeType): { width: number; height: number } {
  return {
    width: node.measured?.width ?? node.width ?? 0,
    height: node.measured?.height ?? node.height ?? 0,
  };
}

function computeLayoutPositions(
  nodes: ShapeNodeType[],
  edges: LabeledEdgeType[]
): Map<string, IWorkflowNodePosition> {
  const graph = new graphlib.Graph({ multigraph: true });
  graph.setGraph(LAYOUT_OPTIONS);
  graph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => graph.setNode(node.id, getNodeSize(node)));
  edges.forEach((edge) => {
    const label = edge.data?.label?.trim();
    // Labels get their own rank slot so they don't sit on top of nodes.
    const labelSize = label
      ? {
          width: label.length * EDGE_LABEL_CHAR_WIDTH + EDGE_LABEL_PADDING,
          height: EDGE_LABEL_HEIGHT,
          labelpos: "c",
        }
      : {};
    graph.setEdge(edge.source, edge.target, labelSize, edge.id);
  });

  layout(graph);

  return new Map(
    nodes.map((node) => {
      const { x, y } = graph.node(node.id);
      const { width, height } = getNodeSize(node);
      return [node.id, { x: x - width / 2, y: y - height / 2 }];
    })
  );
}

function hasOverlappingNodes(nodes: ShapeNodeType[]): boolean {
  const boxes = nodes.map((node) => ({ ...node.position, ...getNodeSize(node) }));

  return boxes.some((a, index) =>
    boxes.slice(index + 1).some(
      (b) =>
        a.x < b.x + b.width + OVERLAP_GAP &&
        b.x < a.x + a.width + OVERLAP_GAP &&
        a.y < b.y + b.height + OVERLAP_GAP &&
        b.y < a.y + a.height + OVERLAP_GAP
    )
  );
}

/** Re-positions every node with dagre, ignoring current positions. */
export function layoutNodes(
  nodes: ShapeNodeType[],
  edges: LabeledEdgeType[]
): ShapeNodeType[] {
  const positions = computeLayoutPositions(nodes, edges);
  return nodes.map((node) => ({ ...node, position: positions.get(node.id) ?? node.position }));
}

/**
 * Nodes with a saved `position` stay where they are; only nodes without one are placed by dagre.
 * If the result has overlapping nodes (e.g. the API/AI returned stacked positions), the whole graph is re-laid out.
 * `previousNodes` keeps on-canvas sizes when a graph (e.g. from the AI) replaces the current one.
 */
export function fromWorkflowGraph(
  graph: IWorkflowGraph,
  previousNodes: ShapeNodeType[] = []
): CanvasGraph {
  const previousById = new Map(previousNodes.map((node) => [node.id, node]));
  const nodes = graph.nodes.map((node) => toShapeNode(node, previousById.get(node.id)));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = graph.edges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map(toLabeledEdge);

  const unplacedIds = new Set(
    graph.nodes.filter((node) => !isValidPosition(node.position)).map((node) => node.id)
  );
  if (unplacedIds.size === 0) {
    return { nodes: hasOverlappingNodes(nodes) ? layoutNodes(nodes, edges) : nodes, edges };
  }

  const layoutPositions = computeLayoutPositions(nodes, edges);
  const offset = getLayoutOffset(nodes, unplacedIds, layoutPositions);
  const placedNodes = nodes.map((node) => {
    const suggested = layoutPositions.get(node.id);
    if (!unplacedIds.has(node.id) || !suggested) return node;
    return { ...node, position: { x: suggested.x + offset.x, y: suggested.y + offset.y } };
  });

  return { nodes: hasOverlappingNodes(placedNodes) ? layoutNodes(nodes, edges) : placedNodes, edges };
}

/** Average shift between dagre's frame and the user's saved layout, so new nodes land near their neighbours. */
function getLayoutOffset(
  nodes: ShapeNodeType[],
  unplacedIds: Set<string>,
  layoutPositions: Map<string, IWorkflowNodePosition>
): IWorkflowNodePosition {
  const placed = nodes.filter((node) => !unplacedIds.has(node.id));
  if (placed.length === 0) return { x: 0, y: 0 };

  const total = placed.reduce(
    (sum, node) => {
      const suggested = layoutPositions.get(node.id) ?? node.position;
      return {
        x: sum.x + node.position.x - suggested.x,
        y: sum.y + node.position.y - suggested.y,
      };
    },
    { x: 0, y: 0 }
  );

  return { x: total.x / placed.length, y: total.y / placed.length };
}

export function toWorkflowGraph(
  nodes: ShapeNodeType[],
  edges: LabeledEdgeType[]
): IWorkflowGraph {
  return {
    nodes: nodes.map(({ id, data, position }) => ({
      id,
      type: "shape",
      position: { x: Math.round(position.x), y: Math.round(position.y) },
      data: { ...data },
    })),
    edges: edges.map(({ id, source, target, data }) => {
      const { label, ...rest } = data ?? {};
      const trimmedLabel = label?.trim();
      const nextData = trimmedLabel ? { ...rest, label: trimmedLabel } : rest;

      return {
        id,
        source,
        target,
        type: "labeled",
        ...(Object.keys(nextData).length > 0 ? { data: nextData } : {}),
      };
    }),
  };
}
