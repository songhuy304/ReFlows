import { QUERY_KEY } from "@/config/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { notificationService } from "../services";
import { IGetNotificationsParams } from "../types";

export interface UseGetNotificationsParams extends IGetNotificationsParams {
  enabled?: boolean;
}

const useGetNotifications = ({
  page,
  limit,
  enabled = true,
}: UseGetNotificationsParams) => {
  const query = useQuery({
    queryKey: [...QUERY_KEY.NOTIFICATION.LIST, { page, limit }],
    queryFn: () => notificationService.getNotifications({ page, limit }),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    data: query.data,
  };
};

export { useGetNotifications };
