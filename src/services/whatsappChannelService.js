// frontend/src/services/whatsappChannelService.js
import axios from "axios";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Get environment variables with fallbacks
const getEnv = (key) => {
  if (isBrowser) {
    return import.meta.env?.[key] || "";
  }
  // eslint-disable-next-line no-undef
  return process.env?.[key] || "";
};

// Create axios instance
const api = axios.create({
  baseURL: getEnv("VITE_API_URL") || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isBrowser && error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Get environment variables with fallbacks
const WHATSAPP_CHANNEL_ID = getEnv("VITE_WHATSAPP_CHANNEL_ID") || "";
const WHATSAPP_CHANNEL_NAME =
  getEnv("VITE_WHATSAPP_CHANNEL_NAME") || "Smaze Offers";
const WHATSAPP_CHANNEL_LINK = getEnv("VITE_WHATSAPP_CHANNEL_LINK") || "";
const APP_URL = getEnv("VITE_APP_URL") || "https://smaze.com";

/**
 * Service error class for consistent error handling
 */
class ServiceError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ServiceError";
    this.cause = options.cause || null;
    this.statusCode = options.statusCode || 500;
    this.code = options.code || "SERVICE_ERROR";
  }
}

/**
 * Get or create channel settings (from backend)
 * @returns {Promise<Object>} Channel settings
 */
export const getChannelSettings = async () => {
  try {
    const response = await api.get("/whatsapp-channel/settings");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching channel settings:", error);
    return {
      channelId: WHATSAPP_CHANNEL_ID || "",
      channelName: WHATSAPP_CHANNEL_NAME || "Smaze Offers",
      channelLink: WHATSAPP_CHANNEL_LINK || "",
      description: "Get the latest offers and deals from Smaze",
      isActive: true,
      totalFollowers: 0,
      totalClicks: 0,
    };
  }
};

/**
 * Update channel settings (Admin only)
 * @param {Object} data - Channel settings data
 * @returns {Promise<Object>} Updated channel settings
 */
export const updateChannelSettings = async (data) => {
  try {
    const response = await api.put("/whatsapp-channel/settings", data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating channel settings:", error);
    throw new ServiceError("Failed to update channel settings", {
      cause: error,
      code: "CHANNEL_SETTINGS_UPDATE_ERROR",
      statusCode: 500,
    });
  }
};

/**
 * Generate WhatsApp message for offer (TEASER - no full details)
 * @param {Object} offer - Offer object
 * @param {Object} shop - Shop object
 * @returns {string} WhatsApp message
 */
export const generateWhatsAppMessage = (offer, shop) => {
  const appUrl = APP_URL;
  const offerUrl = `${appUrl}/customer/offers/${offer.id}`;

  const message =
    `🔔 *New Offer Alert!*\n\n` +
    `🛍️ *${shop?.name || "Our Shop"}* has a new offer!\n\n` +
    `✨ *${offer.title}*\n` +
    `💰 ${offer.discount}% OFF\n` +
    `⏳ Valid until: ${offer.endDate ? new Date(offer.endDate).toLocaleDateString() : "Limited time"}\n\n` +
    `👀 *Want to see the full details?*\n` +
    `📱 Open the Smaze app to view this exclusive offer!\n\n` +
    `🔗 ${offerUrl}\n\n` +
    `Follow our channel for more deals: ${WHATSAPP_CHANNEL_LINK || ""}`;

  return message;
};

/**
 * Generate QR code URL for channel
 * @param {string} channelLink - Channel link
 * @returns {string} QR code URL
 */
export const generateChannelQR = (channelLink) => {
  if (!channelLink) {
    throw new ServiceError("Channel link is required to generate QR code", {
      code: "VALIDATION_ERROR",
      statusCode: 400,
    });
  }
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(channelLink)}`;
};

/**
 * Track channel click (calls backend API)
 * @param {string} source - Click source (dashboard, offer, etc.)
 * @returns {Promise<Object>} Tracking result
 */
export const trackChannelClick = async (source = "direct") => {
  try {
    const response = await api.post("/whatsapp-channel/track-click", {
      source,
    });
    return response.data;
  } catch (error) {
    console.error("Error tracking channel click:", error);
    return {
      success: false,
      error: error.message || "Failed to track channel click",
    };
  }
};

/**
 * Get channel analytics (Admin only)
 * @returns {Promise<Object>} Channel analytics data
 */
export const getChannelAnalytics = async () => {
  try {
    const response = await api.get("/whatsapp-channel/analytics");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching channel analytics:", error);
    throw new ServiceError("Failed to fetch channel analytics", {
      cause: error,
      code: "CHANNEL_ANALYTICS_FETCH_ERROR",
      statusCode: 500,
    });
  }
};

/**
 * Get QR code from backend
 * @returns {Promise<Object>} QR code data
 */
export const getQRCode = async () => {
  try {
    const response = await api.get("/whatsapp-channel/qr");
    return response.data.data;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new ServiceError("Failed to generate QR code", {
      cause: error,
      code: "QR_GENERATION_ERROR",
      statusCode: 500,
    });
  }
};

/**
 * Get WhatsApp opted-in customers (Admin only)
 * @returns {Promise<Array>} List of opted-in customers
 */
export const getOptedCustomers = async () => {
  try {
    const response = await api.get("/whatsapp-channel/opted-customers");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching opted customers:", error);
    throw new ServiceError("Failed to fetch opted customers", {
      cause: error,
      code: "OPTED_CUSTOMERS_FETCH_ERROR",
      statusCode: 500,
    });
  }
};

/**
 * Update customer WhatsApp notification preference
 * @param {boolean} optIn - Opt-in status
 * @returns {Promise<Object>} Updated user
 */
export const updateWhatsAppOptIn = async (optIn) => {
  try {
    const response = await api.put("/whatsapp-channel/opt-in", { optIn });
    return response.data.data;
  } catch (error) {
    console.error("Error updating WhatsApp opt-in:", error);
    throw new ServiceError(
      "Failed to update WhatsApp notification preference",
      {
        cause: error,
        code: "WHATSAPP_OPTIN_UPDATE_ERROR",
        statusCode: 500,
      },
    );
  }
};

/**
 * Get channel statistics summary
 * @returns {Promise<Object>} Channel statistics
 */
export const getChannelStats = async () => {
  try {
    const response = await api.get("/whatsapp-channel/stats");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    return {
      hasChannel: false,
      isActive: false,
      totalFollowers: 0,
      totalClicks: 0,
      totalOptedCustomers: 0,
    };
  }
};

/**
 * Share offer to WhatsApp (opens WhatsApp app)
 * @param {Object} offer - Offer object
 * @param {Object} shop - Shop object
 */
export const shareOfferToWhatsApp = (offer, shop) => {
  const channelLink = WHATSAPP_CHANNEL_LINK || "";

  const message =
    `🎉 New Offer Alert!\n\n` +
    `🔥 ${offer.title}\n` +
    `🏪 ${shop?.name || "Smaze"}\n` +
    `💰 ${offer.discount || "Special"}% OFF\n` +
    `📅 Valid until: ${offer.endDate ? new Date(offer.endDate).toLocaleDateString() : "Limited time"}\n\n` +
    `Follow our channel for more deals: ${channelLink}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};

// Export all functions as default
export default {
  getChannelSettings,
  updateChannelSettings,
  generateWhatsAppMessage,
  generateChannelQR,
  trackChannelClick,
  getChannelAnalytics,
  getQRCode,
  getOptedCustomers,
  updateWhatsAppOptIn,
  getChannelStats,
  shareOfferToWhatsApp,
};
