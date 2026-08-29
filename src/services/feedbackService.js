// frontend/src/services/feedbackService.js
import api from "../api/api";

// ✅ Submit website feedback (with rating)
export const submitWebsiteFeedback = async (message, rating = 5) => {
  const response = await api.post("/feedback", { message, rating });
  return response.data;
};

// ✅ Get website feedback (Admin only)
export const getWebsiteFeedback = async () => {
  const response = await api.get("/feedback/admin");
  return response.data;
};

// ✅ NEW: Get public feedback (No login required)
export const getPublicFeedback = async () => {
  const response = await api.get("/feedback/public");
  return response.data;
};
