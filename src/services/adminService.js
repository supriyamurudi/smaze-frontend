// frontend/src/services/adminService.js
import api from "../api/api";

// =========================
// Dashboard
// =========================
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getPlatformHealth = async () => {
  const response = await api.get("/admin/platform-health");
  return response.data;
};

export const getTopCategories = async () => {
  const response = await api.get("/admin/top-categories");
  return response.data;
};

export const getMonthlyGrowth = async () => {
  const response = await api.get("/admin/monthly-growth");
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get("/admin/recent-activity");
  return response.data;
};

// =========================
// Profile (Admin)
// =========================
export const getProfile = async () => {
  const response = await api.get("/admin/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/admin/profile", data);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put("/admin/profile/password", data);
  return response.data;
};

// =========================
// Users
// =========================
export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.put(`/admin/users/${id}/status`);
  return response.data;
};

export const restoreUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/restore`);
  return response.data;
};

// =========================
// Shops
// =========================
export const getShops = async () => {
  const response = await api.get("/admin/shops");
  return response.data;
};

export const getShopStats = async () => {
  const response = await api.get("/admin/shops/stats");
  return response.data;
};

export const getShopById = async (id) => {
  const response = await api.get(`/admin/shops/${id}`);
  return response.data;
};

export const createShop = async (data) => {
  const response = await api.post("/admin/shops", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ✅ FIXED: Update shop with proper headers
export const updateShop = async (id, data) => {
  // If data is FormData, let axios set the content-type automatically
  const config = {};

  // Only set Content-Type header if it's not FormData
  if (!(data instanceof FormData)) {
    config.headers = {
      "Content-Type": "application/json",
    };
  }
  // For FormData, axios will automatically set the correct boundary

  const response = await api.put(`/admin/shops/${id}`, data, config);
  return response.data;
};

export const deleteShop = async (id) => {
  const response = await api.delete(`/admin/shops/${id}`);
  return response.data;
};

// Shop Approval Functions
export const approveShop = async (shopId) => {
  const response = await api.patch(`/admin/shops/${shopId}/approve`);
  return response.data;
};

export const rejectShop = async (shopId, data = {}) => {
  const response = await api.patch(`/admin/shops/${shopId}/reject`, data);
  return response.data;
};

export const getPendingShops = async () => {
  const response = await api.get("/admin/shops/pending");
  return response.data;
};

export const bulkApproveShops = async (shopIds) => {
  const response = await api.post("/admin/shops/bulk-approve", { shopIds });
  return response.data;
};

export const bulkRejectShops = async (shopIds, data = {}) => {
  const response = await api.post("/admin/shops/bulk-reject", {
    shopIds,
    ...data,
  });
  return response.data;
};

// =========================
// Offers (Admin Endpoints)
// =========================
export const getOffers = async () => {
  const response = await api.get("/admin/offers");
  return response.data;
};

export const getOfferById = async (id) => {
  if (!id) {
    throw new Error("Offer ID is required");
  }
  const response = await api.get(`/admin/offers/${id}`);
  return response.data;
};

export const createOffer = async (data) => {
  const response = await api.post("/admin/offers", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateOffer = async (id, data) => {
  if (!id) {
    throw new Error("Offer ID is required");
  }
  const response = await api.put(`/admin/offers/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteOffer = async (id) => {
  if (!id) {
    throw new Error("Offer ID is required");
  }
  const response = await api.delete(`/admin/offers/${id}`);
  return response.data;
};

export const updateOfferStatus = async (id, data) => {
  const response = await api.patch(`/admin/offers/${id}/status`, data);
  return response.data;
};

// =========================
// Categories
// =========================
export const getCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/admin/categories/${id}`);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/admin/categories", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

// =========================
// Reports
// =========================
export const getReports = async () => {
  const response = await api.get("/admin/reports");
  return response.data;
};
