import { QUERY_KEY } from "@/config/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { workflowService } from "../services";
import { IGetWorkflowsParams } from "../types";

export interface UseGetWorkflowsParams extends IGetWorkflowsParams {
  enabled?: boolean;
}

const useGetWorkflows = ({
  page = 1,
  limit = 10,
  keyword,
  status,
  enabled = true,
}: UseGetWorkflowsParams = {}) => {
  const query = useQuery({
    queryKey: [...QUERY_KEY.WORKFLOW.LIST, { page, limit, keyword, status }],
    queryFn: () =>
      workflowService.getWorkflows({ page, limit, keyword, status }),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    data: query.data,
  };
};

export { useGetWorkflows };
