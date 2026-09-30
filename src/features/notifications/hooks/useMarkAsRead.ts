import { QUERY_KEY } from '@/config/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services';
import {
  applyOptimisticMarkAsRead,
  restoreNotificationCache
} from '../utils/notification-query-cache';

const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onMutate: async (id: number) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: QUERY_KEY.NOTIFICATION.LIST }),
        queryClient.cancelQueries({ queryKey: QUERY_KEY.NOTIFICATION.UNREAD_COUNT })
      ]);

      return applyOptimisticMarkAsRead(queryClient, id);
    },
    onError: (_error, _id, context) => {
      restoreNotificationCache(queryClient, context);
    },
    onSettled: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.NOTIFICATION.LIST }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.NOTIFICATION.UNREAD_COUNT })
      ]);
    },
  });

  return { ...markAsReadMutation };
};

export { useMarkAsRead };
