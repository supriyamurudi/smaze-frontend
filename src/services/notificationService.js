// frontend/src/services/notificationService.js
import api from "../api/api";

// =============================================
// =========== CUSTOMER NOTIFICATIONS ===========
// =============================================

// ===============================
// Get All Customer Notifications
// ===============================
export const getNotifications = async (page = 1, limit = 50) => {
  const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return response.data;
};

// ===============================
// Get Customer Unread Count
// ===============================
export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data;
};

// ===============================
// Mark Customer Notification as Read
// ===============================
export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

// ===============================
// Mark All Customer Notifications as Read
// ===============================
export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

// ===============================
// Delete Customer Notification
// ===============================
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

// ===============================
// Delete All Customer Notifications
// ===============================
export const deleteAllNotifications = async () => {
  const response = await api.delete("/notifications");
  return response.data;
};

// =============================================
// =========== ADMIN NOTIFICATIONS =============
// =============================================

// ===============================
// Get All Admin Notifications
// ===============================
export const getAdminNotifications = async (params = {}) => {
  const { page = 1, limit = 50, filter = "all", type = "all" } = params;

  let url = `/admin/notifications?page=${page}&limit=${limit}`;
  if (filter === "unread") url += "&read=false";
  if (filter === "read") url += "&read=true";
  if (type !== "all") url += `&type=${type}`;

  const response = await api.get(url);
  return response.data;
};

// ===============================
// Get Admin Unread Count
// ===============================
export const getAdminUnreadCount = async () => {
  const response = await api.get("/admin/notifications/unread-count");
  return response.data;
};

// ===============================
// Mark Admin Notification as Read
// ===============================
export const markAdminNotificationAsRead = async (id) => {
  const response = await api.patch(`/admin/notifications/${id}/read`);
  return response.data;
};

// ===============================
// Mark All Admin Notifications as Read
// ===============================
export const markAllAdminNotificationsAsRead = async () => {
  const response = await api.patch("/admin/notifications/mark-all-read");
  return response.data;
};

// ===============================
// Delete Admin Notification
// ===============================
export const deleteAdminNotification = async (id) => {
  const response = await api.delete(`/admin/notifications/${id}`);
  return response.data;
};

// ===============================
// Delete All Admin Notifications
// ===============================
export const deleteAllAdminNotifications = async () => {
  const response = await api.delete("/admin/notifications/delete-all");
  return response.data;
};

// =============================================
// =========== UTILITY FUNCTIONS ===============
// =============================================

// ===============================
// Format Time Ago
// ===============================
export const getTimeAgo = (timestamp) => {
  if (!timestamp) return "Just now";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// ===============================
// Get Notification Icon
// ===============================
export const getNotificationIcon = (type) => {
  const iconMap = {
    user: "👤",
    shop: "🏪",
    offer: "🏷️",
    category: "📁",
    order: "📦",
    payment: "💳",
    system: "⚙️",
    report: "📊",
    user_registered: "👤",
    shop_created: "🏪",
    offer_created: "🏷️",
  };
  return iconMap[type] || "🔔";
};

// ===============================
// Get Notification Color
// ===============================
export const getNotificationColor = (type) => {
  const colorMap = {
    user: "bg-blue-50 border-blue-100 text-blue-600",
    shop: "bg-violet-50 border-violet-100 text-violet-600",
    offer: "bg-emerald-50 border-emerald-100 text-emerald-600",
    category: "bg-amber-50 border-amber-100 text-amber-600",
    order: "bg-orange-50 border-orange-100 text-orange-600",
    payment: "bg-green-50 border-green-100 text-green-600",
    system: "bg-slate-50 border-slate-100 text-slate-600",
    report: "bg-rose-50 border-rose-100 text-rose-600",
    user_registered: "bg-blue-50 border-blue-100 text-blue-600",
    shop_created: "bg-violet-50 border-violet-100 text-violet-600",
    offer_created: "bg-emerald-50 border-emerald-100 text-emerald-600",
  };
  return colorMap[type] || "bg-slate-50 border-slate-100 text-slate-600";
};

// ===============================
// Get Notification Emoji
// ===============================
export const getNotificationEmoji = (type) => {
  const emojiMap = {
    user: "👤",
    shop: "🏪",
    offer: "🏷️",
    category: "📁",
    order: "📦",
    payment: "💳",
    system: "⚙️",
    report: "📊",
    user_registered: "👤",
    shop_created: "🏪",
    offer_created: "🏷️",
  };
  return emojiMap[type] || "🔔";
};

// ===============================
// Get Notification Type Label
// ===============================
export const getNotificationTypeLabel = (type) => {
  const labelMap = {
    user: "User",
    shop: "Shop",
    offer: "Offer",
    category: "Category",
    order: "Order",
    payment: "Payment",
    system: "System",
    report: "Report",
    user_registered: "New User",
    shop_created: "New Shop",
    offer_created: "New Offer",
  };
  return labelMap[type] || "Notification";
};
