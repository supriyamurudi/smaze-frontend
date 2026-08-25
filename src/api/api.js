// frontend/src/api/api.js
import axios from "axios";

// ✅ Get the API URL with fallback
// Vite injects env variables at build time - use import.meta.env
const API_URL = import.meta.env.VITE_API_URL + "/api";

console.log("🔧 API URL configured:", API_URL); // This will help debug

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ✅ Log the FULL URL being called
    console.log(
      `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // ... rest of your error handling
    return Promise.reject(error);
  },
);

export default api;
