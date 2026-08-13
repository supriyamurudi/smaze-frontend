import api from "../api/api";

// Get logged in customer profile
export const getMyProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

// Update customer profile
export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data);

  return response.data;
};
