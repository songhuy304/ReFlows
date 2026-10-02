"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useCreateAndOpenWorkflow } from "../hooks/use-create-and-open-workflow";

function CreateWorkflowButton() {
  const { createAndOpen, isPending } = useCreateAndOpenWorkflow();

  return (
    <Button onClick={createAndOpen} isLoading={isPending}>
      <Icons.add className="size-4" />
      New workflow
    </Button>
  );
}

export { CreateWorkflowButton };
