// frontend/src/services/authService.js
import api from "../api/api";

// ================= Register =================
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

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

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message || "Login failed",
    };
  }
};

// ================= Logout =================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ================= Current User =================
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ================= Authentication =================
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
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
