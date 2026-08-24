// frontend/src/pages/shop/ShopNotifications.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationService";
import toast from "react-hot-toast";

const ShopNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ===============================
  // Load Notifications on Mount
  // ===============================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifData, countData] = await Promise.all([
          getNotifications(),
          getUnreadCount(),
        ]);
        setNotifications(notifData.notifications || []);
        setUnreadCount(countData.count || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98] sm:w-auto"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center sm:p-12">
          <div className="mb-4 text-5xl sm:text-6xl">🔔</div>
          <h3 className="text-lg font-semibold text-slate-700 sm:text-xl">
            All caught up!
          </h3>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            You have no notifications
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-4 transition ${
                notification.isRead
                  ? "bg-white border-slate-200"
                  : "bg-violet-50 border-violet-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-semibold sm:text-base ${
                        notification.isRead
                          ? "text-slate-700"
                          : "text-violet-700"
                      }`}
                    >
                      {notification.message}
                    </h3>
                    {!notification.isRead && (
                      <span className="inline-block h-2 w-2 rounded-full bg-violet-500"></span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Mobile: Stacked buttons, Desktop: Horizontal */}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-shrink-0 sm:gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="w-full rounded-lg bg-violet-100 px-4 py-2 text-xs font-medium text-violet-600 transition hover:bg-violet-200 active:scale-[0.98] sm:w-auto"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="w-full rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-500 transition hover:bg-red-100 active:scale-[0.98] sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopNotifications;
