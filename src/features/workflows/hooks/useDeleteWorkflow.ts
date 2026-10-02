import { QUERY_KEY } from "@/config/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowService } from "../services";

const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  const deleteWorkflowMutation = useMutation({
    mutationFn: (id: number | string) => workflowService.deleteWorkflow(id),
    onSuccess: (_, id) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.WORKFLOW.LIST }),
        queryClient.removeQueries({
          queryKey: QUERY_KEY.WORKFLOW.DETAIL(id),
        }),
      ]);
    },
  });

  return deleteWorkflowMutation;
};

export { useDeleteWorkflow };
