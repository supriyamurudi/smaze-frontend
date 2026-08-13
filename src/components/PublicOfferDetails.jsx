// frontend/src/components/PublicOfferDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import {
  HiOutlineArrowLeft,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
  HiOutlineCalendar,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import { getOfferById } from "../services/offerService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
      <div className="h-8 w-48 bg-slate-200 rounded"></div>
    </div>
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-6 w-1/2 bg-slate-200 rounded"></div>
        <div className="h-20 w-full bg-slate-200 rounded"></div>
        <div className="h-12 w-full bg-slate-200 rounded-xl"></div>
        <div className="h-12 w-full bg-slate-200 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-slate-800">Offer not found</h3>
          <p className="text-slate-500 mt-2">
            The offer you're looking for doesn't exist.
          </p>
          <Link
            to="/offers"
            className="mt-4 inline-block text-violet-600 font-semibold hover:text-violet-700"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-6"
        >
          <HiOutlineArrowLeft size={20} />
          Back to offers
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg">
              <img
                src={
                  offer.image ||
                  "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800"
                }
                alt={offer.title}
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800";
                }}
              />
              {offer.discount && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {offer.discount}% OFF
                </div>
              )}
              <button
                onClick={handleSave}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full hover:bg-white transition-all shadow-lg"
              >
                <HiOutlineHeart
                  className={`text-2xl ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"}`}
                />
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineTag className="text-violet-600" />
                <span className="text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                  {offer.category?.name || "General"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">
                {offer.title}
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-1">
                <HiOutlineBuildingStorefront size={18} />
                {offer.shop?.name || "Local Shop"}
              </p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-slate-600 leading-relaxed">
                {offer.description || "No description available"}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-400">Location</p>
                <p className="font-medium text-slate-700 flex items-center gap-1 mt-1">
                  <HiOutlineMapPin size={16} className="text-violet-500" />
                  {offer.shop?.address || "Not specified"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-400">Valid Until</p>
                <p className="font-medium text-slate-700 flex items-center gap-1 mt-1">
                  <HiOutlineCalendar size={16} className="text-violet-500" />
                  {offer.endDate
                    ? new Date(offer.endDate).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </div>

            {/* Time Remaining */}
            {offer.endDate && (
              <div
                className={`rounded-xl p-4 ${getTimeRemaining(offer.endDate).includes("Expired") ? "bg-rose-50 border border-rose-200" : "bg-amber-50 border border-amber-200"}`}
              >
                <p
                  className={`font-medium flex items-center gap-2 ${getTimeRemaining(offer.endDate).includes("Expired") ? "text-rose-600" : "text-amber-600"}`}
                >
                  <HiOutlineClock size={18} />
                  {getTimeRemaining(offer.endDate)}
                </p>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-400">
                <HiOutlineStar size={20} className="fill-yellow-400" />
                <span className="font-bold text-slate-700">
                  {offer.rating || "4.5"}
                </span>
              </div>
              <span className="text-sm text-slate-400">
                ({offer.reviews || 0} reviews)
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition shadow-lg shadow-violet-200"
              >
                Login to Claim
              </button>
              <button
                onClick={handleShare}
                className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              >
                <HiOutlineShare size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Note */}
            <p className="text-xs text-slate-400 text-center">
              🔒 Login required to claim this offer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicOfferDetails;
