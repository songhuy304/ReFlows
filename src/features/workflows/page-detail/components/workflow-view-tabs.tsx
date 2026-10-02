"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  isWorkflowView,
  WORKFLOW_VIEWS,
  type WorkflowView,
} from "../constants/workflow-views";

interface WorkflowViewTabsProps {
  value?: WorkflowView;
  defaultValue?: WorkflowView;
  onValueChange?: (view: WorkflowView) => void;
}

function WorkflowViewTabs({
  value,
  defaultValue = "flowchart",
  onValueChange,
}: WorkflowViewTabsProps) {
  return (
    <Tabs
      variant="segment"
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (isWorkflowView(next)) onValueChange?.(next);
      }}
    >
      <TabsList>
        {WORKFLOW_VIEWS.map((view) => (
          <Tooltip key={view.value}>
            <TooltipTrigger asChild>
              <div>
                <TabsTrigger value={view.value} className="px-2.5 py-1">
                  <view.icon className="size-4" />
                  <span className="sr-only">{view.label}</span>
                </TabsTrigger>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">{view.label}</TooltipContent>
          </Tooltip>
        ))}
      </TabsList>
    </Tabs>
  );
}

export { WorkflowViewTabs };
