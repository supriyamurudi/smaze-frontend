import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineMagnifyingGlass,
  HiOutlineCalendarDays,
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineXMark,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getOffers } from "../../services/offerService";
import { saveOffer } from "../../services/savedOfferService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-6 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="h-10 w-24 bg-slate-200 rounded-full animate-pulse"></div>
    </div>

    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-slate-200 p-6 animate-pulse">
          <div className="h-8 w-12 bg-slate-300 rounded mx-auto"></div>
          <div className="mt-2 h-4 w-20 bg-slate-300 rounded mx-auto"></div>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
      <div className="h-12 w-40 bg-slate-200 rounded-xl animate-pulse"></div>
      <div className="h-12 w-40 bg-slate-200 rounded-xl animate-pulse"></div>
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-10 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
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
            <div className="h-11 w-full bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
export default function Offers() {
  const location = useLocation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [savedOffers, setSavedOffers] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  // =========================
  // Get category from URL params
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(categoryParam);
      // Find and set the category name for display
      const categoryName =
        offers.find(
          (offer) =>
            offer.category?.id === categoryParam ||
            offer.category?.name === categoryParam,
        )?.category?.name || categoryParam;
      setSelectedCategoryName(categoryName);
    }
  }, [location.search, offers]);

  // =========================
  // Load Offers
  // =========================
  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await getOffers();
        setOffers(data.offers || []);
      } catch (error) {
        console.log("Offer Fetch Error:", error);
        toast.error(error.response?.data?.message || "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  // =========================
  // Save Offer
  // =========================
  const handleSave = async (id) => {
    try {
      if (savedOffers.includes(id)) {
        toast.error("Offer already saved");
        return;
      }

      await saveOffer(id);
      setSavedOffers((prev) => [...prev, id]);
      toast.success("Offer saved successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save offer");
    }
  };

  // =========================
  // Format Date
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";
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

  // =========================
  // Clear Category Filter
  // =========================
  const clearCategoryFilter = () => {
    setCategory("All");
    setSelectedCategoryName("");
    // Update URL without category parameter
    const newUrl = window.location.pathname;
    window.history.pushState({}, "", newUrl);
  };

  // =========================
  // Filter & Sort Offers
  // =========================
  const filteredOffers = offers
    .filter((offer) => {
      const title = offer.title?.toLowerCase() || "";
      const shop = offer.shop?.name?.toLowerCase() || "";
      const searchMatch =
        title.includes(search.toLowerCase()) ||
        shop.includes(search.toLowerCase());

      // Category filter - check by ID or name
      let categoryMatch = category === "All";
      if (!categoryMatch) {
        const offerCategoryId = offer.category?.id || offer.categoryId;
        const offerCategoryName = offer.category?.name;
        categoryMatch =
          String(offerCategoryId) === String(category) ||
          offerCategoryName?.toLowerCase() === category.toLowerCase();
      }

      return searchMatch && categoryMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return (b.discount || 0) - (a.discount || 0);
        case "ending":
          return new Date(a.endDate) - new Date(b.endDate);
        case "newest":
        default:
          return (
            new Date(b.createdAt || b.startDate) -
            new Date(a.createdAt || a.startDate)
          );
      }
    });

  // Get unique categories
  const categories = [
    "All",
    ...new Set(
      offers.filter((item) => item.category).map((item) => item.category.name),
    ),
  ];

  // =========================
  // Loading State
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // Get display category name
  const displayCategoryName =
    selectedCategoryName || (category !== "All" ? category : "");

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
                {category !== "All" ? (
                  <span className="flex items-center gap-3">
                    <span>{displayCategoryName} Offers</span>
                    <button
                      onClick={clearCategoryFilter}
                      className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <HiOutlineXMark size={24} />
                    </button>
                  </span>
                ) : (
                  "Browse Offers"
                )}
              </h1>
              <p className="mt-2 text-slate-500 text-lg">
                {category !== "All"
                  ? `Discover amazing deals in ${displayCategoryName}`
                  : "Discover amazing deals from nearby shops"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                {filteredOffers.length} Offers
              </span>
              {category !== "All" && (
                <button
                  onClick={clearCategoryFilter}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ========== STATS BANNER ========== */}
        {offers.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white md:grid-cols-4"
          >
            <div className="text-center">
              <div className="text-3xl font-black">{filteredOffers.length}</div>
              <div className="mt-1 text-sm text-violet-100">
                Available Offers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">💰</div>
              <div className="mt-1 text-sm text-violet-100">Best Deals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">⭐</div>
              <div className="mt-1 text-sm text-violet-100">Top Rated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">🔥</div>
              <div className="mt-1 text-sm text-violet-100">Trending</div>
            </div>
          </motion.div>
        )}

        {/* ========== FILTERS ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <HiOutlineMagnifyingGlass
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search offers or shops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-0 bg-white py-3 pl-12 pr-4 text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border-0 bg-white px-4 py-3 text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border-0 bg-white px-4 py-3 text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500"
            >
              <option value="newest">Newest First</option>
              <option value="discount">Highest Discount</option>
              <option value="ending">Ending Soon</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 transition ${
                  viewMode === "grid"
                    ? "bg-violet-100 text-violet-600"
                    : "bg-white text-slate-400 hover:bg-slate-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-2 transition ${
                  viewMode === "list"
                    ? "bg-violet-100 text-violet-600"
                    : "bg-white text-slate-400 hover:bg-slate-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ========== OFFERS GRID ========== */}
        {filteredOffers.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/50 py-32 text-center backdrop-blur-sm"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-slate-700">
              No offers found
            </h2>
            <p className="mt-3 text-slate-500">
              {category !== "All"
                ? `No offers available in ${displayCategoryName} category`
                : "Try adjusting your search or filters"}
            </p>
            {category !== "All" && (
              <button
                onClick={clearCategoryFilter}
                className="mt-4 text-violet-600 font-semibold hover:text-violet-700"
              >
                View all offers
              </button>
            )}
            {category === "All" && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 text-violet-600 font-semibold hover:text-violet-700"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={viewMode === "grid" ? { y: -6 } : { x: 4 }}
                >
                  {viewMode === "grid" ? (
                    // ===== GRID VIEW =====
                    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={
                            offer.image || "https://via.placeholder.com/400x250"
                          }
                          alt={offer.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x250";
                          }}
                        />

                        {offer.discount && (
                          <div className="absolute left-3 top-3 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                            {offer.discount}% OFF
                          </div>
                        )}

                        <button
                          onClick={() => handleSave(offer.id)}
                          className="absolute right-3 top-3 rounded-full bg-white/90 p-2.5 text-rose-500 transition hover:scale-110 hover:bg-white hover:shadow-lg backdrop-blur-sm"
                        >
                          {savedOffers.includes(offer.id) ? (
                            <HiHeart size={20} className="fill-rose-500" />
                          ) : (
                            <HiOutlineHeart size={20} />
                          )}
                        </button>

                        {offer.endDate && (
                          <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                            ⏰ {getTimeRemaining(offer.endDate)}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                            {offer.title}
                          </h3>
                          <span className="flex-shrink-0 text-xs font-semibold text-slate-500">
                            {offer.category?.name || "General"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
                          <HiOutlineMapPin size={14} />
                          {offer.shop?.name || "Local Shop"}
                        </p>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <HiOutlineStar size={16} />
                            <span className="text-sm font-medium text-slate-700">
                              {offer.rating || "4.5"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <HiOutlineCalendarDays size={14} />
                            <span>{formatDate(offer.endDate)}</span>
                          </div>
                        </div>

                        <Link
                          to={`/customer/offers/${offer.id}`}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
                        >
                          View Details
                          <HiOutlineArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // ===== LIST VIEW =====
                    <div className="group flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg sm:flex-row">
                      <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-48">
                        <img
                          src={
                            offer.image || "https://via.placeholder.com/200x120"
                          }
                          alt={offer.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/200x120";
                          }}
                        />
                        {offer.discount && (
                          <div className="absolute left-2 top-2 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-1 text-xs font-bold text-white">
                            {offer.discount}% OFF
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">
                              {offer.title}
                            </h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <HiOutlineMapPin size={14} />
                              {offer.shop?.name || "Local Shop"}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSave(offer.id)}
                            className="rounded-full bg-rose-50 p-2 text-rose-500 transition hover:scale-110 hover:bg-rose-100"
                          >
                            {savedOffers.includes(offer.id) ? (
                              <HiHeart size={20} className="fill-rose-500" />
                            ) : (
                              <HiOutlineHeart size={20} />
                            )}
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                            {offer.category?.name || "General"}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-slate-500">
                            <HiOutlineCalendarDays size={14} />
                            {formatDate(offer.endDate)}
                          </span>
                          {offer.endDate && (
                            <span className="text-xs font-medium text-rose-500">
                              ⏰ {getTimeRemaining(offer.endDate)}
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/customer/offers/${offer.id}`}
                          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
                        >
                          View Details
                          <HiOutlineArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ========== BOTTOM CTA ========== */}
        {offers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-8 text-center text-white shadow-xl">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative">
                <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium mb-4">
                  🎯 Don't Miss Out!
                </div>
                <h2 className="text-3xl font-black">Ready to Save Big?</h2>
                <p className="mx-auto mt-3 max-w-2xl text-violet-100">
                  Browse through {filteredOffers.length} amazing offers and
                  start saving today
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/customer/saved-offers"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-violet-700 transition hover:scale-105 hover:shadow-lg"
                  >
                    View Saved Offers
                    <HiOutlineHeart size={18} />
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
