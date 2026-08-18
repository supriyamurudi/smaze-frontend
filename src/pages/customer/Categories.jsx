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
        <div className="h-10 w-64 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-6 w-80 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="h-12 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-slate-200 p-6 animate-pulse">
          <div className="h-8 w-12 bg-slate-300 rounded mx-auto"></div>
          <div className="mt-2 h-4 w-24 bg-slate-300 rounded mx-auto"></div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mx-auto h-28 w-28 rounded-2xl bg-slate-200 animate-pulse"></div>
          <div className="mt-5 h-6 w-20 bg-slate-200 rounded mx-auto animate-pulse"></div>
          <div className="mt-3 h-1.5 w-8 bg-slate-200 rounded mx-auto animate-pulse"></div>
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
    // Update URL with category
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
    Restaurant: "🍽️",
    Fashion: "👕",
    Beauty: "💄",
    Grocery: "🛒",
    Electronics: "💻",
    Fitness: "🏋️",
    Cafe: "☕",
    Hotels: "🏨",
    Travel: "✈️",
    Entertainment: "🎬",
    Health: "💊",
    Education: "📚",
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
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900">
                {showContent && selectedCategory ? (
                  <span className="flex items-center gap-3">
                    <span>{selectedCategory.name}</span>
                    <button
                      onClick={handleCloseContent}
                      className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <HiOutlineXMark size={24} />
                    </button>
                  </span>
                ) : (
                  "Explore Categories"
                )}
              </h1>
              <p className="mt-2 text-slate-500 text-lg">
                {showContent && selectedCategory
                  ? `Discover shops and offers in ${selectedCategory.name}`
                  : "Discover amazing offers from your favourite categories"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/customer/offers"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
              >
                Browse All Offers
                <HiOutlineArrowRight size={18} />
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
            className="mb-8 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white md:grid-cols-4"
          >
            <div className="text-center">
              <div className="text-3xl font-black">{categories.length}</div>
              <div className="mt-1 text-sm text-violet-100">
                Total Categories
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">🎉</div>
              <div className="mt-1 text-sm text-violet-100">Great Deals</div>
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

        {/* Search & View Controls */}
        {!showContent && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-xl border-0 bg-white py-3 pl-11 pr-4 text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                🔍
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">View:</span>
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
          </motion.div>
        )}

        {/* Categories Content */}
        {showContent && selectedCategory ? (
          // Category Content View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* View All Button */}
            <div className="flex justify-end">
              <button
                onClick={handleViewAll}
                className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors group"
              >
                View All Offers
                <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
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
                    <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <HiOutlineBuildingStorefront className="text-violet-600" />
                      Shops
                      <span className="text-sm font-normal text-slate-400">
                        ({shops.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shops.map((shop, index) => (
                        <motion.div
                          key={shop.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => navigate(`/customer/shops/${shop.id}`)}
                          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                        >
                          {/* Shop card content */}
                          <div className="relative h-40 bg-gradient-to-br from-violet-100 to-purple-100">
                            {shop.image ? (
                              <img
                                src={shop.image}
                                alt={shop.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-5xl">🏪</span>
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <button
                                className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Added to favorites!");
                                }}
                              >
                                <HiOutlineHeart className="text-slate-600 hover:text-rose-500" />
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">
                              {shop.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <HiOutlineStar className="text-amber-400" />
                                {shop.rating || "4.5"}
                              </span>
                              <span className="flex items-center gap-1">
                                <HiOutlineMapPin size={14} />
                                {shop.location || "Nearby"}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {shop.tags?.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-slate-100 text-xs text-slate-600 rounded-full"
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
                    <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      <HiOutlineTag className="text-violet-600" />
                      Offers
                      <span className="text-sm font-normal text-slate-400">
                        ({offers.length})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {offers.map((offer, index) => (
                        <motion.div
                          key={offer.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() =>
                            navigate(`/customer/offers/${offer.id}`)
                          }
                          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                        >
                          {/* Offer card content */}
                          <div className="relative h-40 bg-gradient-to-br from-violet-100 to-purple-100">
                            {offer.image ? (
                              <img
                                src={offer.image}
                                alt={offer.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-5xl">🎉</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                                {offer.discount || "20% OFF"}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3">
                              <button
                                className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Added to favorites!");
                                }}
                              >
                                <HiOutlineHeart className="text-slate-600 hover:text-rose-500" />
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">
                              {offer.title}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                              {offer.description}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm text-slate-500 flex items-center gap-1">
                                <HiOutlineClock size={14} />
                                {offer.expiresAt || "Expires soon"}
                              </span>
                              <span className="text-violet-600 font-medium text-sm">
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
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      No results found
                    </h3>
                    <p className="text-slate-500 mt-1">
                      No shops or offers available in this category yet
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ) : (
          // Categories Grid View
          // ... (keep the existing grid view code)
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => handleCategoryClick(category)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
                    index,
                  )} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />

                <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-inner transition-transform duration-300 group-hover:scale-110">
                  <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                    {getCategoryEmoji(category.name)}
                  </span>
                </div>

                <h3 className="relative mt-5 text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-violet-600">
                  {category.name}
                </h3>

                <div
                  className={`mx-auto mt-3 h-1.5 w-8 rounded-full bg-gradient-to-r ${getCategoryColor(
                    index,
                  )} transition-all duration-300 group-hover:w-12`}
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
            className="mt-12"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-8 text-center text-white shadow-xl">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative">
                <div className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium mb-4">
                  🎯 Ready to Save?
                </div>
                <h2 className="text-3xl font-black">
                  Find Amazing Deals in Any Category
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-violet-100">
                  Browse through {categories.length} categories and discover
                  exclusive discounts from your favorite shops
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/customer/offers"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-violet-700 transition hover:scale-105 hover:shadow-lg"
                  >
                    Explore Offers
                    <HiOutlineArrowRight size={18} />
                  </Link>
                  <Link
                    to="/customer/saved-offers"
                    className="rounded-xl border border-white/30 px-8 py-3 font-semibold transition hover:bg-white/10"
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
