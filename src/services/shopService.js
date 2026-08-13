// frontend/src/services/shopService.js
import api from "../api/api";

// ===============================
// Create Shop
// ===============================
export const createShop = async (formData) => {
  const response = await api.post("/shops", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ===============================
// Get All Shops (Public)
// ===============================
export const getShops = async () => {
  const response = await api.get("/shops");
  return response.data;
};

// ===============================
// Get Shop by ID
// ===============================
export const getShopById = async (id) => {
  const response = await api.get(`/shops/${id}`);
  return response.data;
};

// ===============================
// Get My Shop
// ===============================
export const getMyShop = async () => {
  const response = await api.get("/shops/me");
  return response.data;
};

// ===============================
// Update Shop
// ===============================
export const updateShop = async (formData) => {
  const response = await api.put("/shops/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ===============================
// Delete Shop
// ===============================
export const deleteShop = async () => {
  const response = await api.delete("/shops/me");
  return response.data;
};

// ===============================
// Shop Dashboard
// ===============================
export const getShopDashboard = async () => {
  const response = await api.get("/shops/dashboard");
  return response.data;
};

// ===============================
// Shop Analytics
// ===============================
export const getShopAnalytics = async () => {
  const response = await api.get("/shops/analytics");
  return response.data;
};

// ===============================
// Get Featured Shops (Fallback to getShops if featured not available)
// ===============================
export const getFeaturedShops = async () => {
  try {
    const response = await api.get("/shops/featured");
    return response.data;
  } catch {
    console.warn("⚠️ Featured endpoint not found, falling back to all shops");
    // Fallback to all shops
    const response = await api.get("/shops");
    return response.data;
  }
};

// ===============================
// Get Shops by Category
// ===============================
export const getShopsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/shops?category=${categoryId}`);
    return response.data;
  } catch {
    const allShops = await getShops();
    const shops = allShops.shops || allShops.data || allShops || [];
    const filteredShops = shops.filter((shop) => {
      const shopCategoryId =
        shop.categoryId ||
        shop.category?.id ||
        shop.category_id ||
        shop.category?._id;
      const shopCategoryName =
        shop.category?.name?.toLowerCase() ||
        shop.categoryName?.toLowerCase() ||
        shop.category_name?.toLowerCase();
      const categoryIdStr = String(categoryId);
      const shopCategoryIdStr = String(shopCategoryId);
      return (
        shopCategoryIdStr === categoryIdStr ||
        shopCategoryName === categoryIdStr.toLowerCase() ||
        shopCategoryName?.includes(categoryIdStr.toLowerCase())
      );
    });
    return {
      success: true,
      shops: filteredShops,
      data: filteredShops,
      count: filteredShops.length,
      total: filteredShops.length,
    };
  }
};

// ===============================
// Get Shops by Category with Pagination
// ===============================
export const getShopsByCategoryPaginated = async (
  categoryId,
  page = 1,
  limit = 10,
) => {
  const response = await api.get(
    `/shops?category=${categoryId}&page=${page}&limit=${limit}`,
  );
  return response.data;
};

// ===============================
// Get Shops by Multiple Categories
// ===============================
export const getShopsByCategories = async (categoryIds) => {
  if (!categoryIds || categoryIds.length === 0) {
    return { success: true, shops: [], data: [], count: 0 };
  }
  try {
    const categoryParam = categoryIds.join(",");
    const response = await api.get(`/shops?categories=${categoryParam}`);
    return response.data;
  } catch {
    const allShops = await getShops();
    const shops = allShops.shops || allShops.data || allShops || [];
    const filteredShops = shops.filter((shop) => {
      const shopCategoryId =
        shop.categoryId || shop.category?.id || shop.category_id;
      return categoryIds.some((id) => String(id) === String(shopCategoryId));
    });
    return {
      success: true,
      shops: filteredShops,
      data: filteredShops,
      count: filteredShops.length,
      total: filteredShops.length,
    };
  }
};

// ===============================
// Get Shops by Location and Category
// ===============================
export const getShopsByLocationAndCategory = async (
  latitude,
  longitude,
  categoryId,
) => {
  const response = await api.get(
    `/shops/nearby?lat=${latitude}&lng=${longitude}&category=${categoryId}`,
  );
  return response.data;
};

// ===============================
// Search Shops by Category and Keyword
// ===============================
export const searchShopsByCategory = async (categoryId, keyword) => {
  try {
    const response = await api.get(
      `/shops/search?category=${categoryId}&q=${encodeURIComponent(keyword)}`,
    );
    return response.data;
  } catch {
    const categoryShops = await getShopsByCategory(categoryId);
    const shops =
      categoryShops.shops || categoryShops.data || categoryShops || [];
    const filteredShops = shops.filter((shop) => {
      const searchText =
        `${shop.name || ""} ${shop.description || ""}`.toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });
    return {
      success: true,
      shops: filteredShops,
      data: filteredShops,
      count: filteredShops.length,
    };
  }
};

// ===============================
// Get Shop Offers
// ===============================
export const getShopOffers = async (shopId) => {
  const response = await api.get(`/shops/${shopId}/offers`);
  return response.data;
};

// ===============================
// Get Shop Reviews
// ===============================
export const getShopReviews = async (shopId) => {
  const response = await api.get(`/shops/${shopId}/reviews`);
  return response.data;
};

// ===============================
// Get Shop Statistics
// ===============================
export const getShopStatistics = async (shopId) => {
  const response = await api.get(`/shops/${shopId}/statistics`);
  return response.data;
};

// ===============================
// Toggle Shop Status
// ===============================
export const toggleShopStatus = async () => {
  const response = await api.patch("/shops/me/status");
  return response.data;
};

// ===============================
// Upload Shop Logo
// ===============================
export const uploadShopLogo = async (formData) => {
  const response = await api.post("/shops/me/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ===============================
// Upload Shop Banner
// ===============================
export const uploadShopBanner = async (formData) => {
  const response = await api.post("/shops/me/banner", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ===============================
// Get Nearby Shops
// ===============================
export const getNearbyShops = async (latitude, longitude, radius = 10) => {
  const response = await api.get(
    `/shops/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
  );
  return response.data;
};

// ===============================
// Get Shops by Rating
// ===============================
export const getShopsByRating = async (minRating = 4) => {
  const response = await api.get(`/shops?minRating=${minRating}`);
  return response.data;
};

// Export all functions as default
export default {
  createShop,
  getShops,
  getShopById,
  getMyShop,
  updateShop,
  deleteShop,
  getShopDashboard,
  getShopAnalytics,
  getFeaturedShops,
  getShopsByCategory,
  getShopsByCategoryPaginated,
  getShopsByCategories,
  getShopsByLocationAndCategory,
  searchShopsByCategory,
  getShopOffers,
  getShopReviews,
  getShopStatistics,
  toggleShopStatus,
  uploadShopLogo,
  uploadShopBanner,
  getNearbyShops,
  getShopsByRating,
};
