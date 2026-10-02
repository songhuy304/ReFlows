import { Icons, type Icon } from "@/components/icons";

export type WorkflowView = "flowchart" | "bpmn" | "code";

export interface WorkflowViewConfig {
  value: WorkflowView;
  label: string;
  icon: Icon;
}

export const WORKFLOW_VIEWS: WorkflowViewConfig[] = [
  { value: "flowchart", label: "Flowchart", icon: Icons.flowchart },
  { value: "bpmn", label: "BPMN", icon: Icons.bpmn },
  { value: "code", label: "Code", icon: Icons.code },
];

export function isWorkflowView(value: string): value is WorkflowView {
  return WORKFLOW_VIEWS.some((view) => view.value === value);
}
