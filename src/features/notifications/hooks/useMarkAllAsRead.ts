import { QUERY_KEY } from '@/config/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services';
import {
  applyOptimisticMarkAllAsRead,
  restoreNotificationCache
} from '../utils/notification-query-cache';

const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEY.NOTIFICATION.LIST }),
        queryClient.cancelQueries({ queryKey: QUERY_KEY.NOTIFICATION.UNREAD_COUNT })
      ]);

      return applyOptimisticMarkAllAsRead(queryClient);
    },
    onError: (_error, _variables, context) => {
      restoreNotificationCache(queryClient, context);
    },
    onSettled: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.NOTIFICATION.LIST }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.NOTIFICATION.UNREAD_COUNT })
      ]);
    },
  });

  return { ...markAllAsReadMutation };
};

export { useMarkAllAsRead };
