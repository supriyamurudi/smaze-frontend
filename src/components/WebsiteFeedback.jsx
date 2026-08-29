// frontend/src/components/WebsiteFeedback.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import { submitWebsiteFeedback } from "../services/feedbackService";

const WebsiteFeedback = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    try {
      setLoading(true);
      await submitWebsiteFeedback(message);
      toast.success("Thank you for your feedback!");
      setMessage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <HiOutlineChatBubbleLeftRight className="text-violet-600" size={24} />
        <h2 className="text-xl font-bold text-slate-800">Website Feedback</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Tell us how we can improve the website. Your feedback goes directly to
        our team.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback here..."
          rows="4"
          className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Sending...
            </>
          ) : (
            <>
              <HiOutlinePaperAirplane size={18} />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default WebsiteFeedback;
