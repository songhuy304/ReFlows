import { QUERY_KEY } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { workflowService } from "../services";

export interface UseGetWorkflowDetailParams {
  id: number | string;
  enabled?: boolean;
}

const useGetWorkflowDetail = ({
  id,
  enabled = true,
}: UseGetWorkflowDetailParams) => {
  const query = useQuery({
    queryKey: QUERY_KEY.WORKFLOW.DETAIL(id),
    queryFn: () => workflowService.getWorkflowDetail(id),
    enabled: Boolean(id) && enabled,
  });

  return {
    ...query,
    data: query.data,
  };
};

export { useGetWorkflowDetail };
