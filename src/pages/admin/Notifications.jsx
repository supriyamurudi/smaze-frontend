// src/pages/admin/Notifications.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineArrowLeft,
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineBuildingStorefront,
  HiOutlineTag,
  HiOutlineFolder,
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineFilter,
  HiOutlineRefresh,
} from "react-icons/hi2";

import {
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  deleteAdminNotification,
  deleteAllAdminNotifications,
  getTimeAgo,
} from "../../services/notificationService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
      <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-5 w-32 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
              <div className="mt-2 h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========== NOTIFICATION ITEM ==========
const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (type) => {
    const iconMap = {
      user: <HiOutlineUser className="text-blue-500" size={20} />,
      shop: (
        <HiOutlineBuildingStorefront className="text-violet-500" size={20} />
      ),
      offer: <HiOutlineTag className="text-emerald-500" size={20} />,
      category: <HiOutlineFolder className="text-amber-500" size={20} />,
      order: <HiOutlineShoppingCart className="text-orange-500" size={20} />,
      payment: <HiOutlineCreditCard className="text-green-500" size={20} />,
      system: <HiOutlineCog className="text-slate-500" size={20} />,
      report: <HiOutlineChartBar className="text-rose-500" size={20} />,
      user_group: <HiOutlineUserGroup className="text-indigo-500" size={20} />,
    };
    return (
      iconMap[type] || <HiOutlineBell className="text-slate-400" size={20} />
    );
  };

  const getBgColor = (type) => {
    const colorMap = {
      user: "bg-blue-50",
      shop: "bg-violet-50",
      offer: "bg-emerald-50",
      category: "bg-amber-50",
      order: "bg-orange-50",
      payment: "bg-green-50",
      system: "bg-slate-50",
      report: "bg-rose-50",
      user_group: "bg-indigo-50",
    };
    return colorMap[type] || "bg-slate-50";
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      low: { color: "bg-slate-100 text-slate-600", label: "Low" },
      normal: { color: "bg-blue-100 text-blue-600", label: "Normal" },
      high: { color: "bg-amber-100 text-amber-600", label: "High" },
      urgent: { color: "bg-rose-100 text-rose-600", label: "Urgent" },
    };
    return priorityMap[priority] || priorityMap.normal;
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkRead(notification.id);
    }
    if (notification.link) {
      // Navigate to the link
      window.location.href = notification.link;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
        notification.isRead
          ? "border-slate-200 opacity-80"
          : "border-violet-200 bg-gradient-to-r from-violet-50/50 to-purple-50/50 shadow-md shadow-violet-100"
      } ${isHovered ? "shadow-lg scale-[1.01]" : ""}`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 h-12 w-12 rounded-2xl ${getBgColor(notification.type)} flex items-center justify-center`}
          >
            {getIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4
                    className={`text-sm font-semibold ${notification.isRead ? "text-slate-600" : "text-slate-900"}`}
                  >
                    {notification.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getPriorityBadge(notification.priority).color}`}
                  >
                    {getPriorityBadge(notification.priority).label}
                  </span>
                  {notification.type && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {notification.message}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <HiOutlineClock size={12} />
                    {getTimeAgo(notification.createdAt)}
                  </span>
                  {notification.isRead && (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <HiOutlineCheckCircle size={12} />
                      Read
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1">
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notification.id);
                }}
                className="p-2 rounded-xl text-violet-600 hover:bg-violet-100 transition-colors"
                title="Mark as read"
              >
                <HiOutlineCheck size={18} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
              title="Delete notification"
            >
              <HiOutlineTrash size={18} />
            </button>
          </div>
        </div>
      </div>

      {!notification.isRead && (
        <div className="absolute top-4 right-4">
          <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [selectedType, setSelectedType] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
      };

      if (filter === "unread") params.read = "false";
      if (filter === "read") params.read = "true";
      if (selectedType !== "all") params.type = selectedType;

      const response = await getAdminNotifications(params);
      setNotifications(response.notifications || []);

      // Also fetch unread count
      const countResponse = await getAdminUnreadCount();
      setUnreadCount(countResponse.count || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [filter, selectedType]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) return;

    const timer = setTimeout(() => {
      fetchNotifications();
    }, 300);

    return () => clearTimeout(timer);
  }, [filter, selectedType, fetchNotifications]);

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAdminNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAdminNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    try {
      await deleteAdminNotification(notificationId);
      const deleted = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (deleted && !deleted.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  // Delete all notifications
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) {
      return;
    }

    try {
      await deleteAllAdminNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications deleted");
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast.error("Failed to delete all notifications");
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    fetchNotifications();
    toast.success("Refreshed notifications");
  };

  // Get unique notification types for filter
  const notificationTypes = [
    "all",
    ...new Set(notifications.map((n) => n.type)),
  ];

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
              >
                <HiOutlineArrowLeft size={20} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                Notifications
                {unreadCount > 0 && (
                  <span className="text-sm bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-medium">
                    {unreadCount} unread
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up! No unread notifications"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <HiOutlineFilter size={16} />
              Filters
            </button>
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition ${
                unreadCount > 0
                  ? "border-violet-300 bg-white text-violet-700 hover:bg-violet-50"
                  : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              }`}
            >
              <HiOutlineCheck size={16} />
              Mark All Read
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition ${
                notifications.length > 0
                  ? "border-rose-300 bg-white text-rose-600 hover:bg-rose-50"
                  : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              }`}
            >
              <HiOutlineTrash size={16} />
              Delete All
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <HiOutlineRefresh
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Status
                    </label>
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                      <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                          filter === "all"
                            ? "bg-white text-violet-600 shadow-sm"
                            : "text-slate-600 hover:text-violet-600"
                        }`}
                      >
                        All ({notifications.length})
                      </button>
                      <button
                        onClick={() => setFilter("unread")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                          filter === "unread"
                            ? "bg-white text-violet-600 shadow-sm"
                            : "text-slate-600 hover:text-violet-600"
                        }`}
                      >
                        Unread ({unreadNotifications.length})
                      </button>
                      <button
                        onClick={() => setFilter("read")}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                          filter === "read"
                            ? "bg-white text-violet-600 shadow-sm"
                            : "text-slate-600 hover:text-violet-600"
                        }`}
                      >
                        Read
                      </button>
                    </div>
                  </div>

                  {notificationTypes.length > 1 && (
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="rounded-xl border-0 bg-slate-100 px-4 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        {notificationTypes.map((type) => (
                          <option key={type} value={type}>
                            {type === "all"
                              ? "All Types"
                              : type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications List */}
        {loading ? (
          <SkeletonLoader />
        ) : filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-3xl border border-slate-200"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-50">
              <HiOutlineBell size={48} className="text-violet-400" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-800">
              No notifications
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {filter === "unread"
                ? "You have no unread notifications"
                : filter === "read"
                  ? "You have no read notifications"
                  : "You're all caught up!"}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                View all notifications
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-slate-400"
          >
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            notifications
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
