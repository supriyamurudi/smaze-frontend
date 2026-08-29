// frontend/src/pages/admin/Feedback.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { getWebsiteFeedback } from "../../services/feedbackService";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await getWebsiteFeedback();
        setFeedback(response.feedback || []);
      } catch (error) {
        console.error("Error loading feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading feedback...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <HiOutlineChatBubbleLeftRight className="text-violet-600" size={28} />
        <h1 className="text-2xl font-bold text-slate-800">Website Feedback</h1>
      </div>

      {feedback.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="text-slate-500">No feedback received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-800">
                  {item.user?.name || "Anonymous"}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm text-slate-600">{item.message}</p>
              <p className="text-xs text-slate-400 mt-2">
                From: {item.user?.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminFeedback;
