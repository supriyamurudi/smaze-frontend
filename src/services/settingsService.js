// frontend/src/services/settingsService.js
import api from "../api/api";

// Get customer settings
export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

// Update settings
export const updateSettings = async (data) => {
  const response = await api.put("/settings", data);
  return response.data;
};

// ✅ NEW: Update customer password
export const updatePassword = async (data) => {
  const response = await api.put("/settings/password", data);
  return response.data;
};
