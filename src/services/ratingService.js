// frontend/src/services/ratingService.js
import api from "../api/api";

// ✅ Get all ratings for a shop
export const getShopRatings = async (shopId) => {
  const response = await api.get(`/ratings/shop/${shopId}`);
  return response.data;
};

// ✅ Submit or update a rating
export const submitRating = async (shopId, rating, comment) => {
  const response = await api.post("/ratings", { shopId, rating, comment });
  return response.data;
};

// ✅ Get my rating for a shop
export const getMyShopRating = async (shopId) => {
  const response = await api.get(`/ratings/my/${shopId}`);
  return response.data;
};

// ✅ NEW: Get all ratings for the shop owner's own shop
export const getMyShopRatings = async () => {
  const response = await api.get("/ratings/my-shop");
  return response.data;
};
