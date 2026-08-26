// src/pages/admin/AdminSendNotification.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import api from "../../api/api";

const AdminSendNotification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [shopOwnerId, setShopOwnerId] = useState("");
  const [shopOwners, setShopOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // ✅ Use ref to prevent unnecessary fetches
  const hasFetched = useRef(false);

  // ✅ Define fetch function with useCallback
  const fetchShopOwners = useCallback(async () => {
    setFetchingUsers(true);
    try {
      const response = await api.get("/admin/users");
      const owners =
        response.data.users?.filter((user) => user.role === "SHOP_OWNER") || [];
      setShopOwners(owners);
    } catch (error) {
      console.error("Error fetching shop owners:", error);
      toast.error("Failed to load shop owners");
    } finally {
      setFetchingUsers(false);
    }
  }, []);

  // ✅ FIX: Use a flag to prevent unnecessary calls
  useEffect(() => {
    if (recipientType === "single" && !hasFetched.current) {
      hasFetched.current = true;
      fetchShopOwners();
    }

    // Reset flag when switching away from single
    return () => {
      if (recipientType !== "single") {
        hasFetched.current = false;
      }
    };
  }, [recipientType, fetchShopOwners]);

  const handleSend = async () => {
    if (!title || !body) {
      toast.error("Please fill in all fields");
      return;
    }

    if (recipientType === "single" && !shopOwnerId) {
      toast.error("Please select a shop owner");
      return;
    }

    setLoading(true);
    try {
      let endpoint;
      let payload;

      if (recipientType === "all") {
        endpoint = "/notifications/admin/all-shop-owners";
        payload = { title, body };
      } else {
        endpoint = "/notifications/admin/shop-owner";
        payload = { shopOwnerId, title, body };
      }

      const response = await api.post(endpoint, payload);
      toast.success(
        response.data.message || "✅ Notification sent successfully!",
      );
      setTitle("");
      setBody("");
      setShopOwnerId("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to send notification",
      );
    } finally {
      setLoading(false);
    }
  };

  const getRecipientLabel = () => {
    if (recipientType === "all") {
      return `All Shop Owners (${shopOwners.length || "all"})`;
    }
    const owner = shopOwners.find((o) => o.id === shopOwnerId);
    return owner ? owner.name : "Select a shop owner";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-4 sm:p-6"
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-200">
            <HiOutlineMail size={20} className="sm:size-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Send Notification
            </h1>
            <p className="text-sm text-slate-500">
              Send important updates to shop owners
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Recipient Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Send To
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setRecipientType("all");
                setShopOwnerId("");
              }}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                recipientType === "all"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <HiOutlineUsers size={18} />
              All Shop Owners
            </button>
            <button
              onClick={() => setRecipientType("single")}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                recipientType === "single"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <HiOutlineUser size={18} />
              Specific Owner
            </button>
          </div>
        </div>

        {/* Shop Owner Selector */}
        {recipientType === "single" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Select Shop Owner
            </label>
            <select
              value={shopOwnerId}
              onChange={(e) => setShopOwnerId(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-slate-700"
            >
              <option value="">Select a shop owner...</option>
              {fetchingUsers ? (
                <option disabled>Loading shop owners...</option>
              ) : (
                shopOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.email})
                  </option>
                ))
              )}
            </select>
            {shopOwnerId && (
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <HiOutlineCheckCircle size={12} />
                Selected: {getRecipientLabel()}
              </p>
            )}
          </motion.div>
        )}

        {/* Recipient Count Info */}
        {recipientType === "all" && (
          <div className="bg-violet-50 rounded-xl p-3 border border-violet-100">
            <p className="text-sm text-violet-700 flex items-center gap-2">
              <HiOutlineUsers size={16} />
              This will send to all active shop owners
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Important: Update Your Shop Details"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            maxLength="100"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">
            {title.length}/100
          </p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your notification message here..."
            rows="5"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
            maxLength="500"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">
            {body.length}/500
          </p>
        </div>

        {/* Preview */}
        {title && body && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 rounded-xl p-4 border border-slate-200"
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              Preview
            </p>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="text-sm text-slate-600 mt-1">{body}</p>
              <p className="text-xs text-slate-400 mt-2">
                📨 Will be sent to:{" "}
                {recipientType === "all"
                  ? "All Shop Owners"
                  : getRecipientLabel()}
              </p>
            </div>
          </motion.div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={
            loading ||
            !title ||
            !body ||
            (recipientType === "single" && !shopOwnerId)
          }
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <HiOutlineMail size={18} />
              Send Notification
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSendNotification;
