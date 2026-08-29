// frontend/src/services/feedbackService.js
import api from "../api/api";

// ✅ Submit website feedback
export const submitWebsiteFeedback = async (message) => {
  const response = await api.post("/feedback", { message });
  return response.data;
};

// ✅ Get website feedback (Admin only)
export const getWebsiteFeedback = async () => {
  const response = await api.get("/feedback/admin");
  return response.data;
};
