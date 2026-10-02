export type WorkflowStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type NodeShape = "rectangle" | "rounded" | "circle" | "diamond" | "text";

export interface IWorkflowNodePosition {
  x: number;
  y: number;
}

export interface IWorkflowNode {
  id: string;
  type?: string;
  position?: IWorkflowNodePosition;
  data: {
    label: string;
    shape: NodeShape;
  } & Record<string, unknown>;
}

export interface IWorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    label?: string;
  } & Record<string, unknown>;
}

export interface IWorkflowGraph {
  nodes: IWorkflowNode[];
  edges: IWorkflowEdge[];
}

export interface IWorkflow {
  id: number;
  name: string;
  status: WorkflowStatus;
  publishedAt: string | null;
  graph: IWorkflowGraph;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface IGetWorkflowsParams {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: WorkflowStatus;
}

export interface ICreateWorkflowPayload {
  name: string;
  graph: IWorkflowGraph;
}

export interface IUpdateWorkflowPayload {
  name?: string;
  graph?: IWorkflowGraph;
  status?: WorkflowStatus;
}

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChatWorkflowPayload {
  messages: IChatMessage[];
  graph?: IWorkflowGraph;
}

export interface IChatWorkflowResponseData {
  reply: string;
  graph: IWorkflowGraph | null;
}
