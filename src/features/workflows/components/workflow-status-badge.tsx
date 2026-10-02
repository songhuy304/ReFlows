import { Badge } from "@/components/ui/badge";
import { getWorkflowStatusConfig } from "../constants/workflow-status";
import type { WorkflowStatus } from "../types";

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
  className?: string;
}

function WorkflowStatusBadge({ status, className }: WorkflowStatusBadgeProps) {
  const config = getWorkflowStatusConfig(status);

  return (
    <Badge variant={config.badgeVariant} className={className}>
      {config.label}
    </Badge>
  );
}

export { WorkflowStatusBadge };
