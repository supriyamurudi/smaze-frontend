// frontend/src/components/WhatsAppChannelModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineClipboard,
  HiOutlineLink,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineShare,
} from "react-icons/hi2";
import toast from "react-hot-toast";

const WhatsAppChannelModal = ({ isOpen, onClose, message, channelLink }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy message");
    }
  };

  const handleOpenWhatsApp = () => {
    if (channelLink) {
      window.open(channelLink, "_blank");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "New Offer on Smaze",
          text: message,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                  📱
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Share on WhatsApp Channel
                  </h3>
                  <p className="text-sm text-slate-500">
                    Copy and paste this message to your channel
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <HiOutlineXMark className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg">💡</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    How to post to WhatsApp Channel:
                  </p>
                  <ol className="text-sm text-blue-700 mt-1 space-y-1 list-decimal list-inside">
                    <li>Copy the message below</li>
                    <li>Open WhatsApp & go to Updates tab</li>
                    <li>Tap your channel → + icon</li>
                    <li>Paste the message and post</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Message Preview */}
            <div className="bg-slate-50 rounded-xl p-4 max-h-60 overflow-y-auto border border-slate-200">
              <div className="whitespace-pre-wrap font-mono text-sm text-slate-700">
                {message}
              </div>
            </div>

            {/* Channel Link */}
            {channelLink && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-600">🔗</span>
                <a
                  href={channelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:text-green-800 underline truncate flex-1"
                >
                  {channelLink}
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <HiOutlineCheck className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <HiOutlineClipboard className="w-5 h-5" />
                    Copy Message
                  </>
                )}
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition active:scale-[0.98]"
              >
                <HiOutlineLink className="w-5 h-5" />
                Open WhatsApp
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition active:scale-[0.98]"
              >
                <HiOutlineShare className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full mt-3 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              Done
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppChannelModal;
