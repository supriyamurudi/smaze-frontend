import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import {
  HiOutlineGift,
  HiOutlineBell,
  HiOutlineClock,
  HiOutlineBuildingStorefront,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../../services/notificationService";

// ========== STATS BADGE ==========
const StatsBadge = ({ count }) => (
  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
    {count} New
  </span>
);

// ========== FILTER BUTTONS ==========
const FilterButtons = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Read", value: "read" },
  ];

  return (
    <div className="flex gap-2 rounded-xl bg-white p-1 shadow-sm border border-slate-200">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setActiveFilter(filter.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeFilter === filter.value
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// ========== NOTIFICATION CARD ==========
const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case "NEW_OFFER":
        return <HiOutlineGift size={24} />;
      case "OFFER_EXPIRING":
        return <HiOutlineClock size={24} />;
      case "SHOP_UPDATE":
        return <HiOutlineBuildingStorefront size={24} />;
      default:
        return <HiOutlineBell size={24} />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case "NEW_OFFER":
        return "bg-violet-50";
      case "OFFER_EXPIRING":
        return "bg-amber-50";
      case "SHOP_UPDATE":
        return "bg-emerald-50";
      default:
        return "bg-rose-50";
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(notification.id);
    setIsDeleting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        notification.isRead
          ? "bg-white border-slate-200"
          : "bg-gradient-to-r from-violet-50/80 to-purple-50/80 border-violet-200 shadow-md"
      } hover:shadow-xl`}
    >
      <div className="flex gap-5 p-6">
        {/* Icon */}
        <div className="relative shrink-0">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
              getBg(notification.type) || "bg-violet-100"
            } text-violet-700`}
          >
            {getIcon(notification.type)}
          </div>
          {!notification.isRead && (
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-rose-500 animate-pulse"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-2">
              <h2
                className={`text-lg font-semibold ${
                  notification.isRead ? "text-slate-600" : "text-slate-800"
                }`}
              >
                {notification.title || "Notification"}
              </h2>
              {!notification.isRead && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  New
                </span>
              )}
            </div>
            <span className="whitespace-nowrap text-sm text-slate-400">
              {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p
            className={`mt-2 leading-relaxed ${
              notification.isRead ? "text-slate-500" : "text-slate-600"
            }`}
          >
            {notification.message}
          </p>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!notification.isRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-200"
              >
                <HiOutlineCheck size={14} />
                Mark as Read
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
              ) : (
                <HiOutlineTrash size={14} />
              )}
              Delete
            </button>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 overflow-hidden rounded-xl bg-slate-50 p-4"
              >
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Details:</span> This
                  notification was sent to keep you updated about the latest
                  activities on Smaze. Stay tuned for more exciting offers!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Read indicator line */}
      {!notification.isRead && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-violet-600 to-purple-600"></div>
      )}
    </motion.div>
  );
};

// ========== EMPTY STATE ==========
const EmptyState = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 py-20 text-center backdrop-blur-sm"
  >
    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-violet-100">
      <HiOutlineBell size={48} className="text-violet-400" />
    </div>
    <h2 className="text-2xl font-bold text-slate-700">All Caught Up!</h2>
    <p className="mt-2 text-slate-500">
      You have no notifications at the moment.
    </p>
  </motion.div>
);

// ========== MAIN COMPONENT ==========
export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // ===============================
  // Load Notifications on Mount
  // ===============================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const [notifData, countData] = await Promise.all([
          getNotifications(),
          getUnreadCount(),
        ]);
        setNotifications(notifData.notifications || []);
        setUnreadCount(countData.count || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ===============================
  // Handlers
  // ===============================
  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        await deleteNotification(id);
      }
      setNotifications((prev) =>
        prev.filter((n) => !selectedIds.includes(n.id)),
      );
      setSelectedIds([]);
      setSelectAll(false);
      toast.success(`${selectedIds.length} notifications deleted`);
    } catch (error) {
      console.error("Error deleting selected:", error);
      toast.error("Failed to delete selected notifications");
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    try {
      await deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
    setSelectAll(!selectAll);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // ===============================
  // Filters
  // ===============================
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.isRead;
    if (activeFilter === "read") return n.isRead;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  to="/customer/dashboard"
                  className="rounded-full bg-white p-2 shadow-sm transition hover:shadow-md"
                >
                  <HiOutlineArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">
                    Notifications
                  </h1>
                  <p className="mt-1 text-slate-500">
                    Stay updated with latest offers and activities
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatsBadge count={unreadCount} />
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:scale-105"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ========== FILTERS & ACTIONS ========== */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <FilterButtons
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-100 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-200"
                >
                  <HiOutlineCheckCircle size={16} />
                  Mark All Read
                </button>
              )}
              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                >
                  <HiOutlineTrash size={16} />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ========== NOTIFICATIONS LIST ========== */}
        {notifications.length > 0 ? (
          <>
            {/* Select All */}
            {filteredNotifications.length > 1 && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm border border-slate-200">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <label className="text-sm font-medium text-slate-600">
                  Select All
                </label>
                <span className="text-xs text-slate-400 ml-2">
                  ({filteredNotifications.length} notifications)
                </span>
              </div>
            )}

            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="relative">
                    {selectedIds.length > 0 && (
                      <div className="absolute -left-10 top-1/2 -translate-y-1/2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={() => handleToggleSelect(notification.id)}
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        />
                      </div>
                    )}
                    <NotificationCard
                      notification={notification}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-slate-400">
                Showing {filteredNotifications.length} of {notifications.length}{" "}
                notifications
              </p>
            </motion.div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </motion.div>
  );
}
