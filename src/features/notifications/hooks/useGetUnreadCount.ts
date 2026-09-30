import { QUERY_KEY } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../services";

export interface UseGetUnreadCountParams {
  enabled?: boolean;
}

const useGetUnreadCount = ({ enabled = true }: UseGetUnreadCountParams = {}) => {
  const query = useQuery({
    queryKey: QUERY_KEY.NOTIFICATION.UNREAD_COUNT,
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
  });

  return {
    ...query,
  };
};

export { useGetUnreadCount };
