'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import {
  notificationService,
  NotificationItem,
} from '@/lib/services/notification.service';
import './manager-notifications.css';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function UserNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = () => {
    notificationService
      .getAll()
      .then((res) => {
        setItems(res.items);
        setUnreadCount(res.unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      await notificationService.markRead(n._id);
      load();
    }
    setOpen(false);
  };

  return (
    <div className="manager-alerts-header-only">
      <button
        type="button"
        className="manager-alerts-bell"
        onClick={() => setOpen(!open)}
        aria-label="Toggle notifications"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="manager-alerts-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="manager-alerts-backdrop"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="manager-notifications-dropdown">
            <div className="manager-alerts-header">
              <span className="manager-alerts-label">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="manager-mark-all"
                  onClick={() => notificationService.markAllRead().then(load)}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="manager-notifications-panel">
              {items.length === 0 ? (
                <p className="manager-notifications-empty">No notifications yet</p>
              ) : (
                items.slice(0, 8).map((n) => (
                  <Link
                    key={n._id}
                    href={
                      n.relatedOrderId
                        ? `/user/orders/${n.relatedOrderId}`
                        : '/user/orders'
                    }
                    onClick={() => handleClick(n)}
                    className={`manager-notification-card ${!n.isRead ? 'unread' : ''}`}
                  >
                    <p className="manager-notification-id">{n.title}</p>
                    <p className="manager-notification-message">{n.message}</p>
                    <p className="manager-notification-time">
                      {formatTime(n.createdAt)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
