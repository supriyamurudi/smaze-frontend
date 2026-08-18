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
      onClick={() => navigate(`/offers/${offer.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-100 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center overflow-hidden">
        {offer.image ? (
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl">🎉</span>
        )}

        {offer.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {offer.discount}% OFF
          </div>
        )}

        {offer.endDate && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
            ⏰ {getTimeRemaining(offer.endDate)}
          </div>
        )}

        {offer.category?.name && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-violet-600 text-xs font-medium px-3 py-1 rounded-full">
            {offer.category.name}
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-violet-600 transition-colors">
          {offer.title}
        </h4>

        {/* REMOVED: Shop name display - public page */}
        {/* <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
          <HiOutlineMapPin size={14} />
          {offer.shop?.name || "Local Shop"}
        </p> */}

        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-sm text-slate-600">
            <HiOutlineStar className="text-amber-400" />
            {offer.rating || "4.5"}
          </span>
          <span className="text-xs text-slate-400">
            · {offer.reviews || 0} reviews
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <HiOutlineClock size={12} />
            {offer.endDate
              ? new Date(offer.endDate).toLocaleDateString()
              : "Valid until"}
          </span>
          <span className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors">
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
    <div className="flex items-center gap-4 mb-8">
      <div className="h-10 w-48 bg-slate-200 rounded"></div>
      <div className="h-4 w-32 bg-slate-200 rounded"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="h-48 bg-slate-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 w-32 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
            </div>
            <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== HEADER ========== */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                {selectedCategory && (
                  <button
                    onClick={handleClearCategory}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <HiOutlineArrowLeft size={20} className="text-slate-600" />
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    {selectedCategory ? (
                      <>
                        <span>{selectedCategory}</span>
                        <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {filteredOffers.length} offers
                        </span>
                      </>
                    ) : (
                      "Browse Offers"
                    )}
                  </h1>
                  <p className="text-slate-500 mt-1">
                    {selectedCategory
                      ? `Discover amazing deals in ${selectedCategory}`
                      : "Discover amazing deals from nearby shops"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
                {filteredOffers.length} Offers
              </span>
              {selectedCategory && (
                <button
                  onClick={handleClearCategory}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
                >
                  <HiOutlineXMark size={18} />
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========== SEARCH & FILTERS ========== */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500 min-w-[140px]"
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
            className="rounded-xl border-0 bg-white px-4 py-3 text-sm text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500 min-w-[150px]"
          >
            <option value="newest">Newest First</option>
            <option value="discount">Highest Discount</option>
            <option value="ending">Ending Soon</option>
          </select>
        </div>

        {/* ========== OFFERS GRID ========== */}
        {filteredOffers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800">
              No offers found
            </h3>
            <p className="text-slate-500 mt-2">
              {selectedCategory
                ? `No offers available in ${selectedCategory} category`
                : "Try adjusting your search or filters"}
            </p>
            {selectedCategory && (
              <button
                onClick={handleClearCategory}
                className="mt-4 inline-block text-violet-600 font-semibold hover:text-violet-700"
              >
                View all offers
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-violet-700 transition hover:scale-105 hover:shadow-lg"
                  >
                    Join Now
                    <HiOutlineHeart size={18} />
                  </Link>
                  <Link
                    to="/categories"
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
    </div>
  );
};

export default PublicOffersList;
