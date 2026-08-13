import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineBuildingStorefront,
  HiOutlineArrowLeft,
  HiOutlineShare,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineChevronRight,
} from "react-icons/hi2";

import { getOfferById, addOfferView } from "../../services/offerService";
import { saveOffer } from "../../services/savedOfferService";

// ========== SKELETON LOADER COMPONENT ==========
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-2xl bg-slate-200 h-[500px]"></div>
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
        <div className="h-32 bg-slate-200 rounded"></div>
        <div className="h-40 bg-slate-200 rounded"></div>
        <div className="h-32 bg-slate-200 rounded"></div>
        <div className="flex gap-3">
          <div className="h-12 bg-slate-200 rounded flex-1"></div>
          <div className="h-12 bg-slate-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
export default function OfferDetails() {
  const { id } = useParams();

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        // Count the view first
        await addOfferView(id);

        // Then fetch the offer
        const data = await getOfferById(id);

        setOffer(data.offer || data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load offer");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveOffer(offer.id);
      setSaved(true);
      toast.success("Offer saved successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save offer");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: offer.title,
          text: `Check out this amazing offer: ${offer.title} - ${offer.discount}% OFF!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeRemaining = (endDate) => {
    if (!endDate) return null;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl p-6 lg:p-8">
            <SkeletonLoader />
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            Offer Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            The offer you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/customer/offers"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
          >
            Browse Offers
            <HiOutlineArrowLeft size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== BACK BUTTON ========== */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Link
            to="/customer/offers"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-slate-600 shadow-md transition hover:shadow-lg hover:text-violet-600"
          >
            <HiOutlineArrowLeft size={18} />
            Back to Offers
          </Link>
        </motion.div>

        {/* ========== MAIN CONTENT ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* ========== LEFT SIDE - IMAGE ========== */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-6"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
                <img
                  src={offer.image || "https://via.placeholder.com/800x600"}
                  alt={offer.title}
                  className="w-full max-h-[500px] object-contain transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x600";
                  }}
                />

                {/* Discount Badge */}
                {offer.discount && (
                  <div className="absolute left-4 top-4 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 font-bold text-white shadow-lg">
                    {offer.discount}% OFF
                  </div>
                )}

                {/* Time Remaining */}
                {offer.endDate && (
                  <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    ⏰ {getTimeRemaining(offer.endDate)}
                  </div>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-3 text-slate-600 shadow-lg transition hover:scale-110 hover:bg-white hover:shadow-xl backdrop-blur-sm"
                >
                  <HiOutlineShare size={22} />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-violet-50 p-3 text-center">
                  <div className="text-2xl font-black text-violet-600">
                    {offer.discount}%
                  </div>
                  <div className="text-xs text-slate-500">Discount</div>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center">
                  <div className="text-2xl font-black text-emerald-600">
                    ⭐ {offer.rating || "4.5"}
                  </div>
                  <div className="text-xs text-slate-500">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* ========== RIGHT SIDE - DETAILS ========== */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Title & Shop */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-extrabold text-slate-800 lg:text-4xl">
                    {offer.title}
                  </h1>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-violet-700">
                    <HiOutlineBuildingStorefront size={18} />
                    <span className="font-semibold">
                      {offer.shop?.name || "Local Shop"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <HiOutlineTag size={16} />
                    <span>{offer.category?.name || "General"}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl bg-slate-50 p-5">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                  <HiOutlineSparkles className="text-violet-600" size={20} />
                  About This Offer
                </h2>
                <p className="leading-relaxed text-slate-600">
                  {offer.description ||
                    "Enjoy this amazing offer from our shop. Don't miss out on this exclusive deal!"}
                </p>
              </div>

              {/* Offer Period */}
              <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-5">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                  <HiOutlineCalendarDays
                    className="text-orange-500"
                    size={20}
                  />
                  Offer Period
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-orange-200/50 pb-2">
                    <span className="text-slate-600">📅 Starts</span>
                    <span className="font-semibold text-slate-800">
                      {formatDate(offer.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">⏰ Ends</span>
                    <span className="font-semibold text-rose-600">
                      {formatDate(offer.endDate)}
                    </span>
                  </div>
                  {offer.endDate && (
                    <div className="mt-2 rounded-lg bg-orange-200/50 p-2 text-center text-sm font-semibold text-orange-700">
                      {getTimeRemaining(offer.endDate)}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 p-5">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                  <HiOutlineMapPin className="text-violet-600" size={20} />
                  Shop Location
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-violet-200 p-2">
                      <HiOutlineBuildingStorefront
                        className="text-violet-600"
                        size={16}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {offer.shop?.name || "Local Shop"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {offer.shop?.address || "Address not available"}
                      </p>
                    </div>
                  </div>

                  {offer.shop?.latitude && offer.shop?.longitude && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={`https://www.google.com/maps?q=${offer.shop.latitude},${offer.shop.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
                      >
                        📍 View on Maps
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${offer.shop.latitude},${offer.shop.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-violet-600 px-5 py-2.5 font-semibold text-violet-600 transition hover:bg-violet-50 hover:scale-[1.02]"
                      >
                        🧭 Get Directions
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg ${
                    saved
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-gradient-to-r from-violet-600 to-purple-600"
                  } disabled:opacity-50`}
                >
                  {isSaving ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <HiHeart size={20} className="fill-white" />
                      Saved ✓
                    </>
                  ) : (
                    <>
                      <HiOutlineHeart size={20} />
                      Save Offer
                    </>
                  )}
                </button>

                <Link
                  to="/customer/offers"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-50 hover:scale-[1.02]"
                >
                  Browse More
                  <HiOutlineChevronRight size={18} />
                </Link>
              </div>

              {/* Related Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {offer.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
                {!offer.tags && (
                  <>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      #discount
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      #savings
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      #deal
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ========== BOTTOM CTA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-8 text-center text-white shadow-xl">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative">
              <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium mb-4">
                🎯 Don't Miss Out!
              </div>
              <h2 className="text-3xl font-black">
                Ready to Save on Your Next Purchase?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-violet-100">
                Explore more amazing offers and start saving today
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/customer/offers"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-violet-700 transition hover:scale-105 hover:shadow-lg"
                >
                  Browse All Offers
                  <HiOutlineArrowLeft size={18} />
                </Link>
                <Link
                  to="/customer/saved-offers"
                  className="rounded-xl border border-white/30 px-8 py-3 font-semibold transition hover:bg-white/10"
                >
                  View Saved Offers
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
