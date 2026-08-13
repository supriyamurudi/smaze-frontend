// frontend/src/api/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging (remove in production)
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Log response for debugging (remove in production)
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      const { status, data } = error.response;

      console.error(`❌ API Error ${status}:`, data?.message || error.message);

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        console.warn("⚠️ Token expired or invalid. Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // Handle 403 Forbidden - Not enough permissions
      if (status === 403) {
        console.warn("⚠️ Access forbidden:", data?.message);
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.warn("⚠️ Resource not found:", data?.message);
      }

      // Handle 500 Internal Server Error
      if (status === 500) {
        console.error("❌ Server error:", data?.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ No response received:", error.request);
    } else {
      // Something else happened
      console.error("❌ Error setting up request:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
