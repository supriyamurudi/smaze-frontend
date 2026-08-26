// src/pages/admin/AdminNotifications.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import {
  HiOutlineBell,
  HiOutlineBuildingStorefront,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineTag,
  HiOutlineFolder,
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineX,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import {
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  deleteAdminNotification,
  deleteAllAdminNotifications,
  getTimeAgo,
} from "../../services/notificationService";

// ========== STATS BADGE ==========
const StatsBadge = ({ count }) => (
  <span className="rounded-full bg-violet-100 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-violet-700">
    {count} New
  </span>
);

// ========== FILTER BUTTONS ==========
const FilterButtons = ({ activeFilter, setActiveFilter, counts }) => {
  const filters = [
    { label: `All (${counts.total})`, value: "all" },
    { label: `Unread (${counts.unread})`, value: "unread" },
    { label: `Read (${counts.read})`, value: "read" },
  ];

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 rounded-xl bg-white p-1 shadow-sm border border-slate-200">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setActiveFilter(filter.value)}
          className={`rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm font-medium transition flex-1 sm:flex-none ${
            activeFilter === filter.value
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="whitespace-nowrap">{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

// ========== TYPE FILTER ==========
const TypeFilter = ({ selectedType, setSelectedType, types }) => {
  return (
    <select
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
      className="rounded-xl border-0 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-500 w-full sm:w-auto"
    >
      {types.map((type) => (
        <option key={type} value={type}>
          {type === "all"
            ? "All Types"
            : type.charAt(0).toUpperCase() + type.slice(1)}
        </option>
      ))}
    </select>
  );
};

// ========== NOTIFICATION CARD ==========
const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type) => {
    const iconMap = {
      user: <HiOutlineUser size={20} className="text-blue-500" />,
      shop: (
        <HiOutlineBuildingStorefront size={20} className="text-violet-500" />
      ),
      offer: <HiOutlineTag size={20} className="text-emerald-500" />,
      category: <HiOutlineFolder size={20} className="text-amber-500" />,
      order: <HiOutlineShoppingCart size={20} className="text-orange-500" />,
      payment: <HiOutlineCreditCard size={20} className="text-green-500" />,
      system: <HiOutlineCog size={20} className="text-slate-500" />,
      report: <HiOutlineChartBar size={20} className="text-rose-500" />,
      user_group: <HiOutlineUserGroup size={20} className="text-indigo-500" />,
    };
    return (
      iconMap[type] || <HiOutlineBell size={20} className="text-slate-400" />
    );
  };

  const getBg = (type) => {
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

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(notification.id);
    setIsDeleting(false);
  };

  const handleCardClick = () => {
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      whileHover={{ y: -2 }}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer touch-manipulation ${
        notification.isRead
          ? "bg-white border-slate-200"
          : "bg-gradient-to-r from-violet-50/80 to-purple-50/80 border-violet-200 shadow-md"
      } hover:shadow-xl`}
      onClick={handleCardClick}
    >
      <div className="flex gap-3 sm:gap-5 p-4 sm:p-6">
        {/* Icon */}
        <div className="relative shrink-0">
          <div
            className={`flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
              getBg(notification.type) || "bg-violet-100"
            }`}
          >
            {getIcon(notification.type)}
          </div>
          {!notification.isRead && (
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500 animate-pulse"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex flex-wrap items-start gap-1 sm:gap-2">
              <h2
                className={`text-sm sm:text-lg font-semibold flex-1 ${
                  notification.isRead ? "text-slate-600" : "text-slate-800"
                }`}
              >
                {notification.title || "Notification"}
              </h2>
              <span className="whitespace-nowrap text-xs sm:text-sm text-slate-400">
                {getTimeAgo(notification.createdAt)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {!notification.isRead && (
                <span className="rounded-full bg-rose-500 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-white uppercase">
                  New
                </span>
              )}
              <span
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${getPriorityBadge(notification.priority).color}`}
              >
                {getPriorityBadge(notification.priority).label}
              </span>
              {notification.type && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[8px] sm:text-[10px] font-medium">
                  {notification.type.charAt(0).toUpperCase() +
                    notification.type.slice(1)}
                </span>
              )}
            </div>
          </div>

          <p
            className={`mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed ${
              notification.isRead ? "text-slate-500" : "text-slate-600"
            }`}
          >
            {notification.message}
          </p>

          {/* Actions - Mobile Friendly */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notification.id);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-violet-700 transition hover:bg-violet-200 active:scale-95"
              >
                <HiOutlineCheck size={12} />
                <span className="hidden xs:inline">Mark as Read</span>
                <span className="xs:hidden">Read</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-slate-600 transition hover:bg-slate-200 active:scale-95"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-red-500 transition hover:bg-red-100 active:scale-95 disabled:opacity-50 ml-auto"
            >
              {isDeleting ? (
                <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
              ) : (
                <HiOutlineTrash size={12} />
              )}
              <span className="hidden xs:inline">Delete</span>
            </button>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 sm:mt-4 overflow-hidden rounded-xl bg-slate-50 p-3 sm:p-4"
              >
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-600 break-all">
                  <p>
                    <span className="font-semibold">ID:</span> {notification.id}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    {notification.type}
                  </p>
                  <p>
                    <span className="font-semibold">Priority:</span>{" "}
                    {notification.priority}
                  </p>
                  {notification.link && (
                    <p>
                      <span className="font-semibold">Link:</span>{" "}
                      {notification.link}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
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
const EmptyState = ({ filter }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 py-12 sm:py-20 text-center backdrop-blur-sm"
  >
    <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-violet-100">
      <HiOutlineBell size={32} className="text-violet-400" />
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-slate-700">
      {filter === "unread"
        ? "No Unread Notifications!"
        : filter === "read"
          ? "No Read Notifications!"
          : "All Caught Up!"}
    </h2>
    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500 px-4">
      {filter === "unread"
        ? "You've read all your notifications."
        : filter === "read"
          ? "You haven't read any notifications yet."
          : "You have no notifications at the moment."}
    </p>
  </motion.div>
);

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-3 sm:space-y-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <div className="h-6 sm:h-8 w-32 sm:w-48 bg-slate-200 rounded animate-pulse"></div>
      <div className="h-8 sm:h-10 w-24 sm:w-32 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="space-y-2 sm:space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 sm:p-4 shadow-sm animate-pulse"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 sm:h-5 w-24 sm:w-32 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 sm:h-4 w-36 sm:w-48 bg-slate-200 rounded"></div>
              <div className="mt-1 sm:mt-2 h-2 sm:h-3 w-16 sm:w-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========== MOBILE FILTER DRAWER ==========
const MobileFilterDrawer = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Filters</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <HiOutlineX size={24} />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ========== MAIN COMPONENT ==========
export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const pollingInterval = useRef(null);
  const isFirstRender = useRef(true);

  // ===============================
  // Fetch Notifications
  // ===============================
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
      };

      if (activeFilter === "unread") params.read = "false";
      if (activeFilter === "read") params.read = "true";
      if (selectedType !== "all") params.type = selectedType;

      const [notifData, countData] = await Promise.all([
        getAdminNotifications(params),
        getAdminUnreadCount(),
      ]);
      setNotifications(notifData.notifications || []);
      setUnreadCount(countData.count || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, selectedType]);

  // ===============================
  // Initial Load - Runs Once
  // ===============================
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchNotifications();
    }
  }, []);

  // ===============================
  // Handle Filter Changes with Debounce
  // ===============================
  useEffect(() => {
    if (isFirstRender.current) return;

    const timer = setTimeout(() => {
      fetchNotifications();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeFilter, selectedType, fetchNotifications]);

  // ===============================
  // Auto-Refresh Polling
  // ===============================
  useEffect(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    pollingInterval.current = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [fetchNotifications]);

  // ===============================
  // Handlers
  // ===============================
  const handleMarkRead = async (id) => {
    try {
      await markAdminNotificationAsRead(id);
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
      await markAllAdminNotificationsAsRead();
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
      await deleteAdminNotification(id);
      const deleted = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
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
        await deleteAdminNotification(id);
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
    if (!window.confirm("Are you sure you want to delete all notifications?")) {
      return;
    }
    try {
      await deleteAllAdminNotifications();
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

  const handleRefresh = () => {
    fetchNotifications();
    toast.success("Refreshed notifications");
  };

  // ===============================
  // Filters
  // ===============================
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.isRead;
    if (activeFilter === "read") return n.isRead;
    return true;
  });

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const notificationTypes = [
    "all",
    ...new Set(notifications.map((n) => n.type).filter(Boolean)),
  ];

  const counts = {
    total: notifications.length,
    unread: unreadNotifications.length,
    read: readNotifications.length,
  };

  const isInitialLoading = loading && notifications.length === 0;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // Filter content for mobile drawer
  const filterContent = (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-600 block mb-2">
          Filter by Status
        </label>
        <FilterButtons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          counts={counts}
        />
      </div>
      {notificationTypes.length > 1 && (
        <div>
          <label className="text-sm font-medium text-slate-600 block mb-2">
            Filter by Type
          </label>
          <TypeFilter
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            types={notificationTypes}
          />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-16 sm:pb-20"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/admin/dashboard"
                className="rounded-full bg-white p-1.5 sm:p-2 shadow-sm transition hover:shadow-md"
              >
                <HiOutlineArrowLeft size={16} className="text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                  Admin Notifications
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden xs:block">
                  Stay updated with platform activities
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-9 sm:ml-0">
              <StatsBadge count={unreadCount} />
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              >
                <HiOutlineRefresh
                  size={14}
                  className={`inline mr-1 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="rounded-xl border border-red-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-95"
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
            className="mb-4 sm:mb-6"
          >
            {/* Desktop Filters */}
            <div className="hidden md:flex flex-wrap items-center gap-3">
              <FilterButtons
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                counts={counts}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <HiOutlineFilter size={16} className="inline mr-1" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <div className="flex items-center gap-2 ml-auto">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-100 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-200 active:scale-95"
                  >
                    <HiOutlineCheckCircle size={16} />
                    Mark All Read
                  </button>
                )}
                {selectedIds.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200 active:scale-95"
                  >
                    <HiOutlineTrash size={16} />
                    Delete ({selectedIds.length})
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            <div className="flex md:hidden items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-violet-100 px-3 py-2 text-xs font-medium text-violet-700 transition active:scale-95"
              >
                <HiOutlineFilter size={14} />
                Filters
                {activeFilter !== "all" && (
                  <span className="ml-1 rounded-full bg-violet-600 text-white px-1.5 py-0.5 text-[8px] font-bold">
                    1
                  </span>
                )}
              </button>
              <div className="flex-1" />
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2.5 py-1.5 text-[10px] font-semibold text-violet-700 transition active:scale-95"
                >
                  <HiOutlineCheckCircle size={14} />
                  Mark All Read
                </button>
              )}
              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-[10px] font-semibold text-red-600 transition active:scale-95"
                >
                  <HiOutlineTrash size={14} />({selectedIds.length})
                </button>
              )}
            </div>

            {/* Desktop Type Filter */}
            {showFilters && notificationTypes.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <label className="text-sm font-medium text-slate-600">
                      Filter by Type:
                    </label>
                    <TypeFilter
                      selectedType={selectedType}
                      setSelectedType={setSelectedType}
                      types={notificationTypes}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ========== NOTIFICATIONS LIST ========== */}
        {notifications.length > 0 ? (
          <>
            {/* Select All - Mobile Friendly */}
            {filteredNotifications.length > 1 && (
              <div className="mb-3 sm:mb-4 flex items-center gap-2 rounded-xl bg-white p-2.5 sm:p-3 shadow-sm border border-slate-200">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 flex-shrink-0"
                />
                <label className="text-xs sm:text-sm font-medium text-slate-600">
                  Select All
                </label>
                <span className="text-[10px] sm:text-xs text-slate-400 ml-auto">
                  {filteredNotifications.length} notifications
                </span>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="relative">
                    {selectedIds.length > 0 && (
                      <div className="absolute -left-6 sm:-left-10 top-1/2 -translate-y-1/2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={() => handleToggleSelect(notification.id)}
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
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
              className="mt-4 sm:mt-6 text-center"
            >
              <p className="text-xs sm:text-sm text-slate-400">
                Showing {filteredNotifications.length} of {notifications.length}{" "}
                notifications
                {unreadCount > 0 && ` • ${unreadCount} unread`}
              </p>
            </motion.div>
          </>
        ) : (
          <EmptyState filter={activeFilter} />
        )}
      </div>

      {/* ========== MOBILE FILTER DRAWER ========== */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      >
        {filterContent}
        <button
          onClick={() => setIsFilterDrawerOpen(false)}
          className="w-full mt-4 rounded-xl bg-violet-600 text-white py-2.5 font-semibold text-sm active:scale-95 transition"
        >
          Apply Filters
        </button>
      </MobileFilterDrawer>
    </motion.div>
  );
}
