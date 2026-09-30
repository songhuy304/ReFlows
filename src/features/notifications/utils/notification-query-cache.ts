import { QUERY_KEY } from '@/config/query-keys';
import type { INotification } from '../types';
import type { IPaginatedResponse, IResponse } from '@/types/api.type';
import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';

type NotificationsListData = IPaginatedResponse<INotification>;
type InfiniteNotificationsData = InfiniteData<NotificationsListData, number>;
type UnreadCountData = IResponse<{ count: number }>;

export interface NotificationCacheSnapshot {
  listQueries: Array<[QueryKey, NotificationsListData | InfiniteNotificationsData | undefined]>;
  unreadCount: UnreadCountData | undefined;
}

function markNotificationAsRead(
  notification: INotification,
  targetId: number
): INotification {
  if (notification.id !== targetId || notification.isRead) {
    return notification;
  }

  return {
    ...notification,
    isRead: true
  };
}

function markAllNotificationsAsRead(notification: INotification): INotification {
  if (notification.isRead) {
    return notification;
  }

  return {
    ...notification,
    isRead: true
  };
}

function updateUnreadCount(
  current: UnreadCountData | undefined,
  nextCount: number
): UnreadCountData | undefined {
  if (!current) {
    return current;
  }

  return {
    ...current,
    data: {
      ...current.data,
      count: Math.max(0, nextCount)
    }
  };
}

function updatePaginatedNotifications(
  data: NotificationsListData | undefined,
  updater: (notification: INotification) => INotification
): NotificationsListData | undefined {
  if (!data) {
    return data;
  }

  return {
    ...data,
    data: data.data.map(updater)
  };
}

function updateInfiniteNotifications(
  data: InfiniteNotificationsData | undefined,
  updater: (notification: INotification) => INotification
): InfiniteNotificationsData | undefined {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      data: page.data.map(updater)
    }))
  };
}

function updateNotificationListQueries(
  queryClient: QueryClient,
  updater: (notification: INotification) => INotification
): Array<[QueryKey, NotificationsListData | InfiniteNotificationsData | undefined]> {
  const listQueries = queryClient.getQueriesData<NotificationsListData | InfiniteNotificationsData>({
    queryKey: QUERY_KEY.NOTIFICATION.LIST
  });

  listQueries.forEach(([queryKey, data]) => {
    if (!data) {
      return;
    }

    if ('pages' in data) {
      queryClient.setQueryData<InfiniteNotificationsData | undefined>(
        queryKey,
        updateInfiniteNotifications(data, updater)
      );
      return;
    }

    queryClient.setQueryData<NotificationsListData | undefined>(
      queryKey,
      updatePaginatedNotifications(data, updater)
    );
  });

  return listQueries;
}

export function applyOptimisticMarkAsRead(
  queryClient: QueryClient,
  notificationId: number
): NotificationCacheSnapshot {
  const unreadCount = queryClient.getQueryData<UnreadCountData>(QUERY_KEY.NOTIFICATION.UNREAD_COUNT);
  const listQueries = updateNotificationListQueries(queryClient, (notification) =>
    markNotificationAsRead(notification, notificationId)
  );

  queryClient.setQueryData<UnreadCountData | undefined>(
    QUERY_KEY.NOTIFICATION.UNREAD_COUNT,
    updateUnreadCount(unreadCount, (unreadCount?.data.count ?? 0) - 1)
  );

  return {
    listQueries,
    unreadCount
  };
}

export function applyOptimisticMarkAllAsRead(queryClient: QueryClient): NotificationCacheSnapshot {
  const unreadCount = queryClient.getQueryData<UnreadCountData>(QUERY_KEY.NOTIFICATION.UNREAD_COUNT);
  const listQueries = updateNotificationListQueries(queryClient, markAllNotificationsAsRead);

  queryClient.setQueryData<UnreadCountData | undefined>(
    QUERY_KEY.NOTIFICATION.UNREAD_COUNT,
    updateUnreadCount(unreadCount, 0)
  );

  return {
    listQueries,
    unreadCount
  };
}

export function restoreNotificationCache(
  queryClient: QueryClient,
  snapshot: NotificationCacheSnapshot | undefined
) {
  if (!snapshot) {
    return;
  }

  snapshot.listQueries.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });

  queryClient.setQueryData(QUERY_KEY.NOTIFICATION.UNREAD_COUNT, snapshot.unreadCount);
}
