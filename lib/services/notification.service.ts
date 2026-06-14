import { api } from '@/lib/api';

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  relatedOrderId?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getAll: () =>
    api.get<{ items: NotificationItem[]; unreadCount: number }>(
      '/notifications',
    ),
  markRead: (id: string) =>
    api.patch<NotificationItem>(`/notifications/${id}/read`),
  markAllRead: () => api.patch<{ message: string }>('/notifications/read-all'),
};
