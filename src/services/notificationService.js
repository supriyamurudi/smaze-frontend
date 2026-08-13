// frontend/src/services/notificationService.js
import api from "../api/api";

// ===============================
// Get All Notifications
// ===============================
export const getNotifications = async (page = 1, limit = 50) => {
  const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return response.data;
};

// ===============================
// Get Unread Count
// ===============================
export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data;
};

// ===============================
// Mark Notification as Read
// ===============================
export const markNotificationAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

// ===============================
// Mark All Notifications as Read
// ===============================
export const markAllNotificationsAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

// ===============================
// Delete Notification
// ===============================
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

// ===============================
// Delete All Notifications
// ===============================
export const deleteAllNotifications = async () => {
  const response = await api.delete("/notifications");
  return response.data;
};
