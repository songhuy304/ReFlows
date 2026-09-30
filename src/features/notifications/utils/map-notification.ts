import type { NotificationAction } from '@/components/ui/notification-card';
import { INotification } from '../types';
import type { Notification } from './store';

export const mapApiNotification = (apiNotif: INotification): Omit<Notification, 'id'> & { id: string } => {
  let actions: NotificationAction[] | undefined = undefined;

  return {
    id: String(apiNotif.id),
    title: apiNotif.title,
    body: apiNotif.content,
    status: apiNotif.isRead ? 'read' : 'unread',
    createdAt: apiNotif.createdAt || new Date().toISOString(),
    actions
  };
};
