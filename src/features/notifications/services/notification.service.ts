import { apiClient } from "@/lib/axios";
import { IPaginatedResponse, IResponse } from "@/types/api.type";
import { ICountUnread, IGetNotificationsParams, INotification } from "../types";

const PATH = {
  LIST: "/notifications",
  UNREAD_COUNT: "/notifications/unread-count",
  MARK_AS_READ: (id: number) => `/notifications/${id}/mark-as-read`,
  MARK_ALL_AS_READ: "/notifications/mark-all-as-read",
};

export const notificationService = {
  getNotifications: (
    params: IGetNotificationsParams
  ): Promise<IPaginatedResponse<INotification>> =>
    apiClient.get(PATH.LIST, { params }),

  getUnreadCount: (): Promise<IResponse<ICountUnread>> =>
    apiClient.get(PATH.UNREAD_COUNT),

  markAsRead: (id: number): Promise<IResponse<void>> =>
    apiClient.patch(PATH.MARK_AS_READ(id)),

  markAllAsRead: (): Promise<IResponse<void>> =>
    apiClient.patch(PATH.MARK_ALL_AS_READ),
};
