import { useMutation } from "@tanstack/react-query";
import { workflowService } from "../services";
import { IChatWorkflowPayload } from "../types";

export interface UseChatWorkflowVariables {
  id: number | string;
  payload: IChatWorkflowPayload;
}

const useChatWorkflow = () => {
  const chatWorkflowMutation = useMutation({
    mutationFn: ({ id, payload }: UseChatWorkflowVariables) =>
      workflowService.chatWorkflow(id, payload),
  });

  return chatWorkflowMutation;
};

export { useChatWorkflow };
