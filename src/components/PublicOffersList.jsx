// frontend/src/components/PublicOffersList.jsx
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineHeart,
  HiOutlineMapPin,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import { getOffers } from "../services/offerService";

// ========== OFFER CARD ==========
const OfferCard = ({ offer }) => {
  const navigate = useNavigate();

  const getTimeRemaining = (endDate) => {
    if (!endDate) return "No expiry";
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff < 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h left`;
    return "Ending soon!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/offers/${offer.id}`)}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-100 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-36 sm:h-40 md:h-48 bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center overflow-hidden">
        {offer.image ? (
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl sm:text-5xl md:text-6xl">🎉</span>
        )}

        {offer.discount && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
            {offer.discount}% OFF
          </div>
        )}

        {offer.endDate && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/60 backdrop-blur text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            ⏰ {getTimeRemaining(offer.endDate)}
          </div>
        )}

        {offer.category?.name && (
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-white/90 backdrop-blur text-violet-600 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {offer.category.name}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h4 className="text-sm sm:text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-violet-600 transition-colors">
          {offer.title}
        </h4>

        {offer.shop?.name && (
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 flex items-center gap-1">
            <HiOutlineMapPin size={12} className="sm:text-sm" />
            {offer.shop.name}
          </p>
        )}

        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
          <span className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm text-slate-600">
            <HiOutlineStar className="text-amber-400 text-xs sm:text-sm" />
            {offer.rating || "4.5"}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">
            · {offer.reviews || 0} reviews
          </span>
        </div>

        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-0.5 sm:gap-1">
            <HiOutlineClock size={12} className="sm:text-sm" />
            {offer.endDate
              ? new Date(offer.endDate).toLocaleDateString()
              : "Valid until"}
          </span>
          <span className="text-xs sm:text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="h-8 sm:h-10 w-32 sm:w-48 bg-slate-200 rounded"></div>
      <div className="h-3 sm:h-4 w-24 sm:w-32 bg-slate-200 rounded"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="h-36 sm:h-48 bg-slate-200"></div>
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="h-4 sm:h-5 w-24 sm:w-32 bg-slate-200 rounded"></div>
            <div className="h-3 sm:h-4 w-20 sm:w-24 bg-slate-200 rounded"></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-3 sm:h-4 w-12 sm:w-16 bg-slate-200 rounded"></div>
              <div className="h-3 sm:h-4 w-12 sm:w-16 bg-slate-200 rounded"></div>
            </div>
            <div className="h-8 sm:h-10 w-full bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
const PublicOffersList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory(categoryParam);
      document.title = `${categoryParam} Offers - Smaze`;
    } else {
      document.title = "All Offers - Smaze";
    }
  }, [location.search]);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const category = params.get("category");
        const search = params.get("search");

        const response = await getOffers({
          category,
          search,
          limit: 50,
        });
        setOffers(response.offers || []);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [location.search]);

  // Get unique categories from offers
  const categories = [
    "All",
    ...new Set(offers.map((o) => o.category?.name).filter(Boolean)),
  ];

  // Filter and sort offers
  const filteredOffers = offers
    .filter((offer) => {
      if (filter !== "All" && offer.category?.name !== filter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = offer.title?.toLowerCase().includes(query);
        const shopMatch = offer.shop?.name?.toLowerCase().includes(query);
        return titleMatch || shopMatch;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return (b.discount || 0) - (a.discount || 0);
        case "ending":
          return new Date(a.endDate) - new Date(b.endDate);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleClearCategory = () => {
    navigate("/offers");
    setSelectedCategory("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== HEADER ========== */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                {selectedCategory && (
                  <button
                    onClick={handleClearCategory}
                    className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <HiOutlineArrowLeft
                      size={18}
                      className="sm:w-5 sm:h-5 text-slate-600"
                    />
                  </button>
                )}
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    {selectedCategory ? (
                      <>
                        <span>{selectedCategory}</span>
                        <span className="text-xs sm:text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {filteredOffers.length} offers
                        </span>
                      </>
                    ) : (
                      "Browse Offers"
                    )}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                    {selectedCategory
                      ? `Discover amazing deals in ${selectedCategory}`
                      : "Discover amazing deals from nearby shops"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-violet-100 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold text-violet-700 whitespace-nowrap">
                {filteredOffers.length} Offers
              </span>
              {selectedCategory && (
                <button
                  onClick={handleClearCategory}
                  className="text-xs sm:text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-0.5 sm:gap-1"
                >
                  <HiOutlineXMark
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========== SEARCH & FILTERS ========== */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-white py-2.5 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex gap-2 sm:gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 sm:flex-none rounded-xl border-0 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500 min-w-[100px] sm:min-w-[140px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none rounded-xl border-0 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500 min-w-[120px] sm:min-w-[150px]"
            >
              <option value="newest">Newest</option>
              <option value="discount">Best Discount</option>
              <option value="ending">Ending Soon</option>
            </select>
          </div>
        </div>

        {/* ========== OFFERS GRID ========== */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              No offers found
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2 px-4">
              {selectedCategory
                ? `No offers available in ${selectedCategory} category`
                : "Try adjusting your search or filters"}
            </p>
            {selectedCategory && (
              <button
                onClick={handleClearCategory}
                className="mt-3 sm:mt-4 text-sm sm:text-base text-violet-600 font-semibold hover:text-violet-700"
              >
                View all offers
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ========== BOTTOM CTA ========== */}
        {filteredOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-10 md:mt-12"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-6 sm:p-8 md:p-10 text-center text-white shadow-xl">
              <div className="absolute -left-20 -top-20 h-48 sm:h-56 md:h-64 w-48 sm:w-56 md:w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -right-20 -bottom-20 h-48 sm:h-56 md:h-64 w-48 sm:w-56 md:w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative">
                <div className="inline-block rounded-full bg-white/20 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  🎯 Don't Miss Out!
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black">
                  Ready to Save Big?
                </h2>
                <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-violet-100 px-2">
                  Browse through {filteredOffers.length} amazing offers and
                  start saving today
                </p>
                <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-violet-700 transition hover:scale-105 hover:shadow-lg"
                  >
                    Join Now
                    <HiOutlineHeart
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                  </Link>
                  <Link
                    to="/categories"
                    className="rounded-xl border border-white/30 px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition hover:bg-white/10"
                  >
                    Explore Categories
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicOffersList;
