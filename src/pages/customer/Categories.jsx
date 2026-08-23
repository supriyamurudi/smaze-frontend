// src/pages/customer/Categories.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineBuildingStorefront,
  HiOutlineArrowRight,
  HiOutlineHeart,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineXMark,
  HiOutlineViewGrid,
  HiOutlineViewList,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getCategories } from "../../services/categoryService";
import { getShopsByCategory } from "../../services/shopService";
import { getOffersByCategory } from "../../services/offerService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-8 sm:h-10 w-48 sm:w-64 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-5 sm:h-6 w-56 sm:w-80 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="h-10 sm:h-12 w-36 sm:w-48 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl sm:rounded-2xl bg-slate-200 p-4 sm:p-6 animate-pulse"
        >
          <div className="h-6 sm:h-8 w-10 sm:w-12 bg-slate-300 rounded mx-auto"></div>
          <div className="mt-1 sm:mt-2 h-3 sm:h-4 w-16 sm:w-24 bg-slate-300 rounded mx-auto"></div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-md"
        >
          <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded-xl sm:rounded-2xl bg-slate-200 animate-pulse"></div>
          <div className="mt-3 sm:mt-5 h-5 sm:h-6 w-16 sm:w-20 bg-slate-200 rounded mx-auto animate-pulse"></div>
          <div className="mt-2 sm:mt-3 h-1 sm:h-1.5 w-6 sm:w-8 bg-slate-200 rounded mx-auto animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
const CustomerCategories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Category content state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [shops, setShops] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam && categories.length > 0) {
      const foundCategory = categories.find(
        (c) =>
          c.id === categoryParam ||
          c.slug === categoryParam ||
          c.name.toLowerCase() === categoryParam.toLowerCase(),
      );
      if (foundCategory) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCategory(foundCategory);
        setShowContent(true);
        // eslint-disable-next-line react-hooks/immutability
        fetchCategoryContent(foundCategory.id);
      }
    } else {
      setShowContent(false);
      setSelectedCategory(null);
    }
  }, [location.search, categories]);

  // Fetch categories
  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (!ignore) {
          setCategories(response.categories || []);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          toast.error("Failed to load categories");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  // Fetch category content
  const fetchCategoryContent = async (categoryId) => {
    try {
      setLoadingContent(true);
      const shopsResponse = await getShopsByCategory(categoryId);
      setShops(shopsResponse.data || []);
      const offersResponse = await getOffersByCategory(categoryId);
      setOffers(offersResponse.data || []);
    } catch (error) {
      console.error("Error fetching category content:", error);
      toast.error("Failed to load category content");
    } finally {
      setLoadingContent(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowContent(true);
    navigate(
      `/customer/categories?category=${encodeURIComponent(category.name)}`,
    );
    fetchCategoryContent(category.id);
  };

  const handleCloseContent = () => {
    setShowContent(false);
    setSelectedCategory(null);
    setShops([]);
    setOffers([]);
    navigate("/customer/categories");
  };

  const handleViewAll = () => {
    if (selectedCategory) {
      navigate(`/customer/offers?category=${selectedCategory.id}`);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Category color mapping
  const categoryColors = [
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-cyan-500 to-blue-600",
    "from-fuchsia-500 to-pink-600",
    "from-lime-500 to-green-600",
    "from-red-500 to-rose-600",
    "from-purple-500 to-violet-600",
  ];

  const getCategoryColor = (index) => {
    return categoryColors[index % categoryColors.length];
  };

  const categoryEmojis = {
    Food: "🍔",

    Fashion: "👕",
    Beauty: "💄",

    Electronics: "💻",
    Fitness: "🏋️",

    Automotive: "🚗",
    Home: "🏠",
  };

  const getCategoryEmoji = (name) => {
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return emoji;
      }
    }
    return "🏷️";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 sm:mb-8"
        >
          <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
                {showContent && selectedCategory ? (
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl md:text-4xl">
                      {selectedCategory.name}
                    </span>
                    <button
                      onClick={handleCloseContent}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <HiOutlineXMark size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </span>
                ) : (
                  "Explore Categories"
                )}
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg text-slate-500">
                {showContent && selectedCategory
                  ? `Discover shops and offers in ${selectedCategory.name}`
                  : "Discover amazing offers from your favourite categories"}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/customer/offers"
                className="inline-flex items-center gap-1 sm:gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:scale-105 hover:shadow-lg"
              >
                Browse All Offers
                <HiOutlineArrowRight size={16} className="sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        {categories.length > 0 && !showContent && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 sm:mb-8 grid grid-cols-2 gap-2 sm:gap-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-4 sm:p-6 text-white"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black">
                {categories.length}
              </div>
              <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-violet-100">
                Total Categories
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black">🎉</div>
              <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-violet-100">
                Great Deals
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black">⭐</div>
              <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-violet-100">
                Top Rated
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black">🔥</div>
              <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-violet-100">
                Trending
              </div>
            </div>
          </motion.div>
        )}

        {/* Search & View Controls */}
        {!showContent && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 sm:mb-8 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-xl border-0 bg-white py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
              />
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base sm:text-lg">
                🔍
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm text-slate-500 mr-1 sm:mr-2">
                View:
              </span>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-1.5 sm:p-2 transition ${
                  viewMode === "grid"
                    ? "bg-violet-100 text-violet-600"
                    : "bg-white text-slate-400 hover:bg-slate-100"
                }`}
                aria-label="Grid view"
              >
                <HiOutlineViewGrid size={18} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-1.5 sm:p-2 transition ${
                  viewMode === "list"
                    ? "bg-violet-100 text-violet-600"
                    : "bg-white text-slate-400 hover:bg-slate-100"
                }`}
                aria-label="List view"
              >
                <HiOutlineViewList size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Categories Content */}
        {showContent && selectedCategory ? (
          // Category Content View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* View All Button */}
            <div className="flex justify-end">
              <button
                onClick={handleViewAll}
                className="flex items-center gap-1 sm:gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors group text-sm sm:text-base"
              >
                View All Offers
                <HiOutlineArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={16}
                />
              </button>
            </div>

            {loadingContent ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Shops Section */}
                {shops.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4 flex items-center gap-2">
                      <HiOutlineBuildingStorefront className="text-violet-600" />
                      Shops
                      <span className="text-sm font-normal text-slate-400">
                        ({shops.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {shops.map((shop, index) => (
                        <motion.div
                          key={shop.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => navigate(`/customer/shops/${shop.id}`)}
                          className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                        >
                          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-violet-100 to-purple-100">
                            {shop.image ? (
                              <img
                                src={shop.image}
                                alt={shop.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-3xl sm:text-5xl">🏪</span>
                              </div>
                            )}
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                              <button
                                className="p-1.5 sm:p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Added to favorites!");
                                }}
                              >
                                <HiOutlineHeart className="text-slate-600 hover:text-rose-500 text-sm sm:text-base" />
                              </button>
                            </div>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors text-sm sm:text-base line-clamp-1">
                              {shop.name}
                            </h4>
                            <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-slate-500">
                              <span className="flex items-center gap-0.5 sm:gap-1">
                                <HiOutlineStar className="text-amber-400 text-xs sm:text-sm" />
                                {shop.rating || "4.5"}
                              </span>
                              <span className="flex items-center gap-0.5 sm:gap-1">
                                <HiOutlineMapPin
                                  size={12}
                                  className="sm:text-sm"
                                />
                                <span className="truncate max-w-[50px] sm:max-w-full">
                                  {shop.location || "Nearby"}
                                </span>
                              </span>
                            </div>
                            <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
                              {shop.tags?.slice(0, 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 sm:px-2 py-0.5 bg-slate-100 text-[10px] sm:text-xs text-slate-600 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Offers Section */}
                {offers.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4 flex items-center gap-2">
                      <HiOutlineTag className="text-violet-600" />
                      Offers
                      <span className="text-sm font-normal text-slate-400">
                        ({offers.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {offers.map((offer, index) => (
                        <motion.div
                          key={offer.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() =>
                            navigate(`/customer/offers/${offer.id}`)
                          }
                          className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                        >
                          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-violet-100 to-purple-100">
                            {offer.image ? (
                              <img
                                src={offer.image}
                                alt={offer.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-3xl sm:text-5xl">🎉</span>
                              </div>
                            )}
                            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                              <span className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-rose-500 text-white text-[10px] sm:text-xs font-bold rounded-full">
                                {offer.discount || "20% OFF"}
                              </span>
                            </div>
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                              <button
                                className="p-1.5 sm:p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Added to favorites!");
                                }}
                              >
                                <HiOutlineHeart className="text-slate-600 hover:text-rose-500 text-sm sm:text-base" />
                              </button>
                            </div>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors text-sm sm:text-base line-clamp-1">
                              {offer.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">
                              {offer.description}
                            </p>
                            <div className="flex items-center justify-between mt-2 sm:mt-3">
                              <span className="text-xs sm:text-sm text-slate-500 flex items-center gap-0.5 sm:gap-1">
                                <HiOutlineClock
                                  size={12}
                                  className="sm:text-sm"
                                />
                                {offer.expiresAt || "Expires soon"}
                              </span>
                              <span className="text-violet-600 font-medium text-xs sm:text-sm">
                                {offer.shopName || "View Details"}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {shops.length === 0 && offers.length === 0 && (
                  <div className="text-center py-8 sm:py-12 bg-white rounded-xl sm:rounded-2xl">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                      No results found
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">
                      No shops or offers available in this category yet
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ) : (
          // Categories Grid View - Mobile Responsive
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => handleCategoryClick(category)}
                className="group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 md:p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
                    index,
                  )} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />

                <div className="relative mx-auto flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner transition-transform duration-300 group-hover:scale-110">
                  <span className="text-3xl sm:text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110">
                    {getCategoryEmoji(category.name)}
                  </span>
                </div>

                <h3 className="relative mt-2 sm:mt-3 md:mt-5 text-xs sm:text-sm md:text-base lg:text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-violet-600 line-clamp-1">
                  {category.name}
                </h3>

                <div
                  className={`mx-auto mt-1.5 sm:mt-2 md:mt-3 h-1 w-6 sm:w-8 rounded-full bg-gradient-to-r ${getCategoryColor(
                    index,
                  )} transition-all duration-300 group-hover:w-8 sm:group-hover:w-12`}
                />
              </motion.button>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {categories.length > 0 && !showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-12"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-6 sm:p-8 text-center text-white shadow-xl">
              <div className="absolute -left-20 -top-20 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -right-20 -bottom-20 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative">
                <div className="inline-block rounded-full bg-white/20 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  🎯 Ready to Save?
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black">
                  Find Amazing Deals in Any Category
                </h2>
                <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-violet-100 text-sm sm:text-base">
                  Browse through {categories.length} categories and discover
                  exclusive discounts from your favorite shops
                </p>
                <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                  <Link
                    to="/customer/offers"
                    className="inline-flex items-center gap-1 sm:gap-2 rounded-xl bg-white px-4 sm:px-8 py-2 sm:py-3 font-bold text-violet-700 transition hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                  >
                    Explore Offers
                    <HiOutlineArrowRight size={16} className="sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    to="/customer/saved-offers"
                    className="rounded-xl border border-white/30 px-4 sm:px-8 py-2 sm:py-3 font-semibold transition hover:bg-white/10 text-sm sm:text-base"
                  >
                    My Favorites
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerCategories;
