// frontend/src/components/PublicOfferDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineArrowLeft,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import { getOfferById } from "../services/offerService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-slate-200 rounded-full"></div>
      <div className="h-6 sm:h-8 w-32 sm:w-48 bg-slate-200 rounded"></div>
    </div>
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="lg:flex-[3]">
        <div className="h-[250px] sm:h-[300px] md:h-[400px] bg-slate-200 rounded-xl sm:rounded-2xl"></div>
      </div>
      <div className="lg:flex-[2] space-y-3 sm:space-y-4">
        <div className="h-6 sm:h-8 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-5 sm:h-6 w-1/2 bg-slate-200 rounded"></div>
        <div className="h-16 sm:h-20 w-full bg-slate-200 rounded"></div>
        <div className="h-10 sm:h-12 w-full bg-slate-200 rounded-xl"></div>
        <div className="h-10 sm:h-12 w-full bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
const PublicOfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await getOfferById(id);
        setOffer(response.offer);
        document.title = `${response.offer?.title || "Offer"} - Smaze`;
      } catch (error) {
        console.error("Error fetching offer:", error);
        toast.error("Failed to load offer details");
        navigate("/offers");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOffer();
    }
  }, [id, navigate]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved successfully!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: offer?.title,
          text: `Check out this offer: ${offer?.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
            Offer not found
          </h3>
          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
            The offer you're looking for doesn't exist.
          </p>
          <Link
            to="/offers"
            className="mt-3 sm:mt-4 inline-block text-violet-600 font-semibold hover:text-violet-700"
          >
            ← Back to offers
          </Link>
        </div>
      </div>
    );
  }

  const getTimeRemaining = (endDate) => {
    if (!endDate) return "No expiry";
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff < 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return "Ending soon!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <HiOutlineArrowLeft size={18} className="sm:w-5 sm:h-5" />
          Back to offers
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Image Section */}
          <div className="lg:flex-[3]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg"
            >
              <img
                src={
                  offer.image ||
                  "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800"
                }
                alt={offer.title}
                className="w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800";
                }}
              />
              {offer.discount && (
                <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] sm:text-xs md:text-sm font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full shadow-lg">
                  {offer.discount}% OFF
                </div>
              )}
              <button
                onClick={handleSave}
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white/90 backdrop-blur p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-white transition-all shadow-lg"
              >
                <HiOutlineHeart
                  className={`text-lg sm:text-xl md:text-2xl ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"}`}
                />
              </button>
            </motion.div>

            {/* Shop Info - Mobile */}
            {offer.shop?.name && (
              <div className="lg:hidden mt-3 sm:mt-4 flex items-center gap-2 text-sm sm:text-base text-slate-600 bg-white/80 backdrop-blur rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100">
                <HiOutlineBuildingStorefront className="text-violet-500 text-base sm:text-lg" />
                <span className="font-medium">{offer.shop.name}</span>
                {offer.shop?.address && (
                  <span className="text-xs sm:text-sm text-slate-400">
                    • {offer.shop.address}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:flex-[2] space-y-4 sm:space-y-5 md:space-y-6">
            {/* Title & Category */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <HiOutlineTag className="text-violet-600 text-sm sm:text-base" />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-violet-600 bg-violet-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {offer.category?.name || "General"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                {offer.title}
              </h1>
            </motion.div>

            {/* Shop Info - Desktop */}
            {offer.shop?.name && (
              <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur rounded-xl p-3 shadow-sm border border-slate-100">
                <HiOutlineBuildingStorefront className="text-violet-500" />
                <span className="font-medium">{offer.shop.name}</span>
                {offer.shop?.address && (
                  <span className="text-slate-400">• {offer.shop.address}</span>
                )}
              </div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-100"
            >
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {offer.description || "No description available"}
              </p>
            </motion.div>

            {/* Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-2 sm:gap-3"
            >
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100">
                <p className="text-[10px] sm:text-xs text-slate-400">
                  Valid Until
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1 mt-0.5 sm:mt-1">
                  <HiOutlineCalendar
                    size={14}
                    className="sm:w-4 sm:h-4 text-violet-500"
                  />
                  {offer.endDate
                    ? new Date(offer.endDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100">
                <p className="text-[10px] sm:text-xs text-slate-400">Reviews</p>
                <p className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1 mt-0.5 sm:mt-1">
                  <HiOutlineStar
                    size={14}
                    className="sm:w-4 sm:h-4 text-yellow-400"
                  />
                  {offer.rating || "4.5"} ({offer.reviews || 0})
                </p>
              </div>
            </motion.div>

            {/* Time Remaining */}
            {offer.endDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-xl p-3 sm:p-4 ${
                  getTimeRemaining(offer.endDate).includes("Expired")
                    ? "bg-rose-50 border border-rose-200"
                    : "bg-amber-50 border border-amber-200"
                }`}
              >
                <p
                  className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 ${
                    getTimeRemaining(offer.endDate).includes("Expired")
                      ? "text-rose-600"
                      : "text-amber-600"
                  }`}
                >
                  <HiOutlineClock
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                  {getTimeRemaining(offer.endDate)}
                </p>
              </motion.div>
            )}

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 sm:gap-3"
            >
              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-2.5 sm:py-3 rounded-xl hover:scale-[1.02] transition shadow-lg shadow-violet-200 text-sm sm:text-base"
              >
                Login to Claim
              </button>
              <button
                onClick={handleShare}
                className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              >
                <HiOutlineShare
                  size={18}
                  className="sm:w-5 sm:h-5 text-slate-600"
                />
              </button>
            </motion.div>

            {/* Note */}
            <p className="text-[10px] sm:text-xs text-slate-400 text-center">
              🔒 Login required to claim this offer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicOfferDetails;
