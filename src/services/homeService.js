// frontend/src/services/homeService.js
import api from "../api/api";

// ===============================
// Get Home Stats (Public)
// ===============================
export const getHomeStats = async () => {
  try {
    const response = await api.get("/home/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching home stats:", error);
    // Return fallback data
    return {
      success: true,
      data: {
        totalShops: 0,
        totalCustomers: 0,
        totalOffers: 0,
      },
    };
  }
};

// ===============================
// Get Home Page Data (Public)
// ===============================
export const getHomeData = async () => {
  try {
    const response = await api.get("/home");
    return response.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};
