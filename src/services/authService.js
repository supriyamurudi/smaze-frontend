// frontend/src/services/authService.js
import api from "../api/api";

// ================= Register =================
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message || error.message || "Registration failed",
    };
  }
};

// ================= Login =================
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || "Login failed",
    };
  }
};

// ================= Logout =================
export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    // Only remove user data for UI, NOT token (cookie is cleared by server)
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message || error.message || "Logout failed",
    };
  }
};

// ================= Check Auth (Used for RequireAuth) =================
export const checkAuth = async () => {
  try {
    const response = await api.get("/auth/check");
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message || error.message || "Not authenticated",
    };
  }
};

// ================= Current User (UI only) =================
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ================= Authentication (UI only) =================
export const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

// ================= Get User Role =================
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// ================= Get Shop Status =================
export const getShopStatus = () => {
  const user = getCurrentUser();
  if (user?.role === "SHOP_OWNER") {
    return {
      hasShop: user.hasShop || false,
      shopStatus: user.shopStatus || null,
      shopName: user.shopName || null,
      shopId: user.shopId || null,
    };
  }
  return null;
};

// ================= Reset Password (Simple - No Email) =================
export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    throw {
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password",
    };
  }
};
