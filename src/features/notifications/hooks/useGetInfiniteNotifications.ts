import { QUERY_KEY } from '@/config/query-keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationService } from '../services';

export interface UseGetInfiniteNotificationsParams {
  limit?: number;
  enabled?: boolean;
}

const DEFAULT_LIMIT = 10;

const useGetInfiniteNotifications = ({
  limit = DEFAULT_LIMIT,
  enabled = true
}: UseGetInfiniteNotificationsParams = {}) => {
  const query = useInfiniteQuery({
    queryKey: [...QUERY_KEY.NOTIFICATION.LIST, { limit }],
    queryFn: ({ pageParam }) =>
      notificationService.getNotifications({
        page: pageParam,
        limit
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled
  });

  return {
    ...query
  };
};

export { useGetInfiniteNotifications };
