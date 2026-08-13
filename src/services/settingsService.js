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
