// services/offerService.js
import api from "../api/api";

// Get all offers
export const getOffers = async () => {
  const response = await api.get("/offers");
  return response.data;
};

// Get offer by ID
export const getOfferById = async (id) => {
  const response = await api.get(`/offers/${id}`);
  return response.data;
};

// Get logged-in shop owner's offers
export const getMyOffers = async () => {
  const response = await api.get("/offers/my-offers");
  return response.data;
};

// Create offer
export const createOffer = async (formData) => {
  const response = await api.post("/offers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update offer
export const updateOffer = async (id, formData) => {
  const response = await api.put(`/offers/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete offer
export const deleteOffer = async (id) => {
  if (!id) {
    throw new Error("Offer ID is required");
  }
  const response = await api.delete(`/offers/${id}`);
  return response.data;
};

export const addOfferView = async (id) => {
  const response = await api.post(`/offers/${id}/view`);
  return response.data;
};

export const getMyOfferById = async (id) => {
  const response = await api.get(`/offers/my/${id}`);
  return response.data;
};

// ============================================
// CATEGORY FILTERING FUNCTIONS
// ============================================

/**
 * Get offers by category ID
 * @param {string|number} categoryId - The category ID to filter by
 * @returns {Promise} - Returns filtered offers
 */
export const getOffersByCategory = async (categoryId) => {
  // Try backend filtering first
  try {
    const response = await api.get(`/offers?category=${categoryId}`);
    return response.data;
  } catch {
    // Fallback: Get all offers and filter on frontend
    const allOffers = await getOffers();
    const offers = allOffers.offers || allOffers.data || allOffers || [];

    const filteredOffers = offers.filter((offer) => {
      const offerCategoryId =
        offer.categoryId ||
        offer.category?.id ||
        offer.category_id ||
        offer.category?._id;

      const offerCategoryName =
        offer.category?.name?.toLowerCase() ||
        offer.categoryName?.toLowerCase() ||
        offer.category_name?.toLowerCase();

      const categoryIdStr = String(categoryId);
      const offerCategoryIdStr = String(offerCategoryId);

      return (
        offerCategoryIdStr === categoryIdStr ||
        offerCategoryName === categoryIdStr.toLowerCase() ||
        offerCategoryName?.includes(categoryIdStr.toLowerCase())
      );
    });

    return {
      success: true,
      offers: filteredOffers,
      data: filteredOffers,
      count: filteredOffers.length,
      total: filteredOffers.length,
    };
  }
};

/**
 * Get offers by category with pagination
 * @param {string|number} categoryId - The category ID
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 */
export const getOffersByCategoryPaginated = async (
  categoryId,
  page = 1,
  limit = 10,
) => {
  const response = await api.get(
    `/offers?category=${categoryId}&page=${page}&limit=${limit}`,
  );
  return response.data;
};

/**
 * Get offers by multiple categories
 * @param {Array} categoryIds - Array of category IDs
 */
export const getOffersByCategories = async (categoryIds) => {
  if (!categoryIds || categoryIds.length === 0) {
    return { success: true, offers: [], data: [], count: 0 };
  }

  // Try backend filtering first
  try {
    const categoryParam = categoryIds.join(",");
    const response = await api.get(`/offers?categories=${categoryParam}`);
    return response.data;
  } catch {
    // Fallback: Get all offers and filter
    const allOffers = await getOffers();
    const offers = allOffers.offers || allOffers.data || allOffers || [];

    const filteredOffers = offers.filter((offer) => {
      const offerCategoryId =
        offer.categoryId || offer.category?.id || offer.category_id;

      return categoryIds.some((id) => String(id) === String(offerCategoryId));
    });

    return {
      success: true,
      offers: filteredOffers,
      data: filteredOffers,
      count: filteredOffers.length,
      total: filteredOffers.length,
    };
  }
};

/**
 * Get offers by shop and category
 * @param {string|number} shopId - The shop ID
 * @param {string|number} categoryId - The category ID
 */
export const getOffersByShopAndCategory = async (shopId, categoryId) => {
  try {
    const response = await api.get(
      `/offers?shop=${shopId}&category=${categoryId}`,
    );
    return response.data;
  } catch {
    // Fallback: Get shop offers and filter
    const shopOffers = await getMyShopOffers(shopId);
    const offers = shopOffers.offers || shopOffers.data || shopOffers || [];

    const filteredOffers = offers.filter((offer) => {
      const offerCategoryId =
        offer.categoryId || offer.category?.id || offer.category_id;
      return String(offerCategoryId) === String(categoryId);
    });

    return {
      success: true,
      offers: filteredOffers,
      data: filteredOffers,
      count: filteredOffers.length,
    };
  }
};

/**
 * Get offers by category with advanced filters (price, rating, etc.)
 * @param {string|number} categoryId - The category ID
 * @param {Object} filters - Filter object
 */
export const getOffersByCategoryFiltered = async (categoryId, filters = {}) => {
  const queryParams = new URLSearchParams({
    category: categoryId,
    ...filters,
  });
  const response = await api.get(`/offers?${queryParams}`);
  return response.data;
};

/**
 * Search offers by category and keyword
 * @param {string|number} categoryId - The category ID
 * @param {string} keyword - Search keyword
 */
export const searchOffersByCategory = async (categoryId, keyword) => {
  try {
    const response = await api.get(
      `/offers/search?category=${categoryId}&q=${encodeURIComponent(keyword)}`,
    );
    return response.data;
  } catch {
    // Fallback: Get category offers and filter by keyword
    const categoryOffers = await getOffersByCategory(categoryId);
    const offers =
      categoryOffers.offers || categoryOffers.data || categoryOffers || [];

    const filteredOffers = offers.filter((offer) => {
      const searchText =
        `${offer.title || ""} ${offer.description || ""}`.toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });

    return {
      success: true,
      offers: filteredOffers,
      data: filteredOffers,
      count: filteredOffers.length,
    };
  }
};

// Helper function for shop offers (if needed)
const getMyShopOffers = async (shopId) => {
  const response = await api.get(`/shops/${shopId}/offers`);
  return response.data;
};

// Export all functions as default
export default {
  getOffers,
  getOfferById,
  getMyOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  addOfferView,
  getMyOfferById,
  getOffersByCategory,
  getOffersByCategoryPaginated,
  getOffersByCategories,
  getOffersByShopAndCategory,
  getOffersByCategoryFiltered,
  searchOffersByCategory,
};
