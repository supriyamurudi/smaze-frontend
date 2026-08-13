import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineHeart,
  HiHeart,
  HiOutlineArrowRight,
  HiOutlineStar,
} from "react-icons/hi2";

import {
  getSavedOffers,
  removeSavedOffer,
} from "../../services/savedOfferService";

import toast from "react-hot-toast";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-6 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-24 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>

    {/* Stats Banner Skeleton */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-slate-200 p-6 animate-pulse">
          <div className="h-8 w-12 bg-slate-300 rounded mx-auto"></div>
          <div className="mt-2 h-4 w-20 bg-slate-300 rounded mx-auto"></div>
        </div>
      ))}
    </div>

    {/* Cards Grid Skeleton */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white shadow-md overflow-hidden">
          <div className="h-52 bg-slate-200 animate-pulse"></div>
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-11 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-11 w-11 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
export default function SavedOffers() {
  const [savedOffers, setSavedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // Fetch Saved Offers
  useEffect(() => {
    const loadSavedOffers = async () => {
      try {
        const data = await getSavedOffers();
        setSavedOffers(data.savedOffers || []);
      } catch (error) {
        console.log("Saved Offers Error:", error);
        toast.error("Failed to load saved offers");
      } finally {
        setLoading(false);
      }
    };

    loadSavedOffers();
  }, []);

  // Remove Saved Offer
  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await removeSavedOffer(id);
      setSavedOffers((prev) => prev.filter((item) => item.id !== id));
      toast.success("Offer removed from saved");
    } catch (error) {
      console.log("Remove Error:", error);
      toast.error("Failed to remove offer");
    } finally {
      setRemovingId(null);
    }
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "Limited Time";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
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
          <SkeletonLoader />
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
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900">
                ❤️ Saved Offers
              </h1>
              <p className="mt-2 text-slate-500 text-lg">
                Your favourite deals saved for later
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
                {savedOffers.length} Saved
              </span>
              <Link
                to="/customer/offers"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
              >
                Browse More
                <HiOutlineArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ========== STATS BANNER ========== */}
        {savedOffers.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white md:grid-cols-4"
          >
            <div className="text-center">
              <div className="text-3xl font-black">{savedOffers.length}</div>
              <div className="mt-1 text-sm text-rose-100">Saved Offers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">💰</div>
              <div className="mt-1 text-sm text-rose-100">Total Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">⭐</div>
              <div className="mt-1 text-sm text-rose-100">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">🔥</div>
              <div className="mt-1 text-sm text-rose-100">Hot Deals</div>
            </div>
          </motion.div>
        )}

        {/* ========== SAVED OFFERS GRID ========== */}
        {savedOffers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <AnimatePresence>
              {savedOffers.map((saved, index) => {
                const offer = saved.offer;
                return (
                  <motion.div
                    key={saved.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    {/* ===== IMAGE ===== */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={
                          offer?.image || "https://via.placeholder.com/400x250"
                        }
                        alt={offer?.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x250";
                        }}
                      />

                      {/* Discount Badge */}
                      {offer?.discount && (
                        <div className="absolute left-3 top-3 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                          {offer.discount}% OFF
                        </div>
                      )}

                      {/* Heart Icon */}
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2.5 text-rose-500 backdrop-blur-sm">
                        <HiHeart size={20} className="fill-rose-500" />
                      </div>

                      {/* Time Remaining */}
                      {offer?.endDate && (
                        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                          ⏰ {getTimeRemaining(offer.endDate)}
                        </div>
                      )}
                    </div>

                    {/* ===== CONTENT ===== */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                          {offer?.title || "Untitled Offer"}
                        </h3>
                        <span className="flex-shrink-0 text-xs font-semibold text-slate-500">
                          {offer?.category?.name || "General"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
                        <HiOutlineMapPin size={14} />
                        {offer?.shop?.name || "Local Shop"}
                      </p>

                      {/* Rating and Date */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <HiOutlineStar size={16} />
                          <span className="text-sm font-medium text-slate-700">
                            {offer?.rating || "4.5"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <HiOutlineCalendarDays size={14} />
                          <span>{formatDate(offer?.endDate)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          to={`/customer/offers/${offer?.id}`}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
                        >
                          View Details
                          <HiOutlineArrowRight size={16} />
                        </Link>
                        <button
                          onClick={() => handleRemove(saved.id)}
                          disabled={removingId === saved.id}
                          className="rounded-xl bg-red-50 px-3.5 py-2.5 text-red-500 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
                        >
                          {removingId === saved.id ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                          ) : (
                            <HiOutlineTrash size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          // ========== EMPTY STATE ==========
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 py-32 text-center backdrop-blur-sm"
          >
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-rose-50">
              <HiOutlineHeart size={56} className="text-rose-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-700">
              No Saved Offers
            </h2>
            <p className="mt-3 max-w-md mx-auto text-slate-500">
              Save your favourite offers to view them here. Start exploring and
              find the best deals!
            </p>
            <Link
              to="/customer/offers"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
            >
              Browse Offers
              <HiOutlineArrowRight size={18} />
            </Link>
          </motion.div>
        )}

        {/* ========== BOTTOM CTA ========== */}
        {savedOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-700 via-pink-700 to-fuchsia-700 p-8 text-center text-white shadow-xl">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative">
                <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium mb-4">
                  ❤️ Love Your Savings?
                </div>
                <h2 className="text-3xl font-black">
                  Discover Even More Deals!
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-rose-100">
                  Explore hundreds of offers from your favorite shops and
                  restaurants
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/customer/offers"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-rose-700 transition hover:scale-105 hover:shadow-lg"
                  >
                    Browse All Offers
                    <HiOutlineArrowRight size={18} />
                  </Link>
                  <Link
                    to="/customer/categories"
                    className="rounded-xl border border-white/30 px-8 py-3 font-semibold transition hover:bg-white/10"
                  >
                    Explore Categories
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
