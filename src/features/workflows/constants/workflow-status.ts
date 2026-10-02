import type { WorkflowStatus } from "../types";

export interface WorkflowStatusConfig {
  value: WorkflowStatus;
  label: string;
  badgeVariant: "secondary" | "success" | "outline";
}

export const WORKFLOW_STATUSES: WorkflowStatusConfig[] = [
  { value: "DRAFT", label: "Draft", badgeVariant: "secondary" },
  { value: "PUBLISHED", label: "Published", badgeVariant: "success" },
  { value: "ARCHIVED", label: "Archived", badgeVariant: "outline" },
];

export const WORKFLOW_STATUS_VALUES = WORKFLOW_STATUSES.map((status) => status.value);

export function getWorkflowStatusConfig(status: WorkflowStatus): WorkflowStatusConfig {
  return WORKFLOW_STATUSES.find((item) => item.value === status) ?? WORKFLOW_STATUSES[0];
}
