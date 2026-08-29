// frontend/src/pages/customer/Feedback.jsx
import { motion } from "framer-motion";
import WebsiteFeedback from "../../components/WebsiteFeedback";

const CustomerFeedback = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-6"
    >
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Customer Support
          </h1>
        </div>
        <WebsiteFeedback />
      </div>
    </motion.div>
  );
};

export default CustomerFeedback;
