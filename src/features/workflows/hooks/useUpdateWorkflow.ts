import { QUERY_KEY } from "@/config/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowService } from "../services";
import { IUpdateWorkflowPayload } from "../types";

export interface UseUpdateWorkflowVariables {
  id: number | string;
  payload: IUpdateWorkflowPayload;
}

const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  const updateWorkflowMutation = useMutation({
    mutationFn: ({ id, payload }: UseUpdateWorkflowVariables) =>
      workflowService.updateWorkflow(id, payload),
    onSuccess: (_, variables) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.WORKFLOW.LIST }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.WORKFLOW.DETAIL(variables.id),
        }),
      ]);
    },
  });

  return updateWorkflowMutation;
};

export { useUpdateWorkflow };
