import { QUERY_KEY } from "@/config/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowService } from "../services";
import { ICreateWorkflowPayload } from "../types";

const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  const createWorkflowMutation = useMutation({
    mutationFn: (payload: ICreateWorkflowPayload) =>
      workflowService.createWorkflow(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.WORKFLOW.LIST });
    },
  });

  return createWorkflowMutation;
};

export { useCreateWorkflow };
