// src/pages/admin/AdminSendNotification.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/api";

const AdminSendNotification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipientType, setRecipientType] = useState("all"); // "all" or "single"
  const [shopOwnerId, setShopOwnerId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title || !body) {
      toast.error("Please fill in all fields");
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
        if (!shopOwnerId) {
          toast.error("Please select a shop owner");
          return;
        }
        endpoint = "/notifications/admin/shop-owner";
        payload = { shopOwnerId, title, body };
      }

      const response = await api.post(endpoint, payload);
      toast.success(response.data.message || "Notification sent!");
      setTitle("");
      setBody("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send notification",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Send Notification</h1>

      <div className="space-y-4">
        {/* Recipient Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Send To
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setRecipientType("all")}
              className={`px-4 py-2 rounded-lg ${
                recipientType === "all"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Shop Owners
            </button>
            <button
              onClick={() => setRecipientType("single")}
              className={`px-4 py-2 rounded-lg ${
                recipientType === "single"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Specific Shop Owner
            </button>
          </div>
        </div>

        {/* Shop Owner ID (only for single) */}
        {recipientType === "single" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Shop Owner ID
            </label>
            <input
              type="text"
              value={shopOwnerId}
              onChange={(e) => setShopOwnerId(e.target.value)}
              placeholder="Enter shop owner user ID"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-400 mt-1">
              You can find this in the Users list
            </p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter notification message"
            rows="5"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </div>
    </div>
  );
};

export default AdminSendNotification;
