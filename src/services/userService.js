import api from "../api/api";

// ===============================
// Get User Settings
// ===============================
export const getSettings = async () => {
  const response = await api.get("/users/settings");
  return response.data;
};

// ===============================
// Update User Settings
// ===============================
export const updateSettings = async (data) => {
  const response = await api.put("/users/settings", data);
  return response.data;
};

// ===============================
// Change Password
// ===============================
export const changePassword = async (data) => {
  const response = await api.put("/users/change-password", data);
  return response.data;
};
