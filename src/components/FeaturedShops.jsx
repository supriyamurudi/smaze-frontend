// frontend/src/components/FeaturedShops.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaTag,
  FaStore,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getFeaturedShops } from "../services/shopService";

// ========== SKELETON LOADER ==========
const FeaturedShopsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
      >
        <div className="h-40 sm:h-48 md:h-56 bg-slate-200"></div>
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="flex justify-between">
            <div className="h-4 sm:h-5 w-20 sm:w-28 bg-slate-200 rounded"></div>
            <div className="h-4 sm:h-5 w-8 sm:w-10 bg-slate-200 rounded"></div>
          </div>
          <div className="h-3 sm:h-4 w-16 sm:w-20 bg-slate-200 rounded"></div>
          <div className="h-3 sm:h-4 w-20 sm:w-24 bg-slate-200 rounded"></div>
          <div className="flex justify-between items-center mt-1 sm:mt-2">
            <div className="h-2 sm:h-3 w-12 sm:w-16 bg-slate-200 rounded"></div>
            <div className="h-6 sm:h-8 w-16 sm:w-20 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ========== SHOP CARD ==========
const ShopCard = ({ shop, onClick }) => {
  const getOfferCount = () => {
    return shop.offers?.length || shop._count?.offers || 0;
  };

  const getRating = () => {
    return shop.rating || shop.averageRating || "4.5";
  };

  const getLocation = () => {
    return shop.address?.split(",")[0] || shop.city || "Near You";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(shop.id)}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image - Responsive height */}
      <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 bg-gradient-to-br from-violet-50 to-purple-50">
        {shop.image ? (
          <img
            src={shop.image}
            alt={shop.name || "Shop"}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              const parent = e.target.parentElement;
              const fallback = document.createElement("div");
              fallback.className =
                "w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl text-violet-300";
              fallback.innerHTML = "🏪";
              parent.appendChild(fallback);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl text-violet-300">
            <FaStore />
          </div>
        )}

        {/* Verified Badge - Top Left */}
        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 backdrop-blur px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 shadow-lg z-10">
          <FaCheckCircle className="text-green-500 text-[8px] sm:text-xs" />
          Verified
        </span>

        {/* Offer Count Badge - Bottom Left */}
        {getOfferCount() > 0 && (
          <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-semibold shadow-lg flex items-center gap-1 sm:gap-1.5 z-10">
            <FaTag size={8} className="sm:w-[10px] sm:h-[10px]" />
            {getOfferCount()} Offers
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
            {shop.name || "Unnamed Shop"}
          </h3>
          <div className="flex items-center gap-0.5 text-yellow-500 font-bold text-xs sm:text-sm flex-shrink-0">
            <FaStar className="text-[10px] sm:text-xs" />
            <span>{getRating()}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-purple-600 font-semibold mt-0.5">
          {shop.category?.name || "Local Business"}
        </p>

        <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 text-slate-500 text-xs sm:text-sm">
          <FaMapMarkerAlt className="text-violet-500 flex-shrink-0 text-[10px] sm:text-xs" />
          <span className="truncate text-xs sm:text-sm">{getLocation()}</span>
        </div>

        <div className="mt-2 sm:mt-3 md:mt-4 flex justify-between items-center">
          <span className="text-[10px] sm:text-xs md:text-sm text-slate-500">
            {getOfferCount()} Active Offers
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(shop.id);
            }}
            className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] sm:text-xs md:text-sm font-semibold hover:scale-105 transition"
          >
            Visit Shop
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
const FeaturedShops = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Fetching shops...");
        const response = await getFeaturedShops();
        console.log("✅ Response:", response);

        const shopsData = response.shops || response.data || [];
        console.log(`📦 Found ${shopsData.length} shops`);

        setShops(shopsData);

        if (shopsData.length === 0) {
          console.log("⚠️ No shops found in database");
        }
      } catch (err) {
        console.error("❌ Error fetching shops:", err);
        setError("Failed to load shops");
        toast.error("Failed to load shops");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleShopClick = (shopId) => {
    navigate(`/customer/shops/${shopId}`);
  };

  const handleViewAll = () => {
    navigate("/customer/shops");
  };

  if (loading) {
    return (
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1 sm:gap-1.5">
                <FaCheckCircle className="text-green-500 text-[10px] sm:text-xs" />
                Verified Businesses
              </span>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black text-slate-900">
                Featured Shops
              </h2>
              <p className="mt-0.5 sm:mt-1 text-slate-500 text-xs sm:text-sm">
                Loading shops...
              </p>
            </div>
          </div>
          <FeaturedShopsSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">😅</div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">
            Something went wrong
          </h3>
          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 sm:mt-4 rounded-full bg-gradient-to-r from-violet-700 to-pink-500 px-4 sm:px-5 py-2 sm:py-2.5 font-semibold text-white hover:scale-105 transition text-xs sm:text-sm"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (shops.length === 0) {
    return (
      <section className="py-10 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1 sm:gap-1.5">
                <FaCheckCircle className="text-green-500 text-[10px] sm:text-xs" />
                Verified Businesses
              </span>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black text-slate-900">
                Featured Shops
              </h2>
              <p className="mt-0.5 sm:mt-1 text-slate-500 text-xs sm:text-sm">
                No shops available
              </p>
            </div>
          </div>
          <div className="text-center py-12 sm:py-16 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
            <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🏪</div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              No shops available
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Check back later for featured shops!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold inline-flex items-center gap-1 sm:gap-1.5">
              <FaCheckCircle className="text-green-500 text-[10px] sm:text-xs" />
              Verified Businesses
            </span>
            <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black text-slate-900">
              Featured Shops
            </h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
              Explore trusted local businesses offering exclusive deals every
              day.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="flex items-center gap-1.5 sm:gap-2 text-purple-600 font-semibold hover:gap-2.5 sm:hover:gap-3 transition-all group text-xs sm:text-sm"
          >
            View All
            <FaArrowRight className="group-hover:translate-x-1 transition text-[10px] sm:text-xs" />
          </button>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {shops.slice(0, 6).map((shop) => (
            <ShopCard key={shop.id} shop={shop} onClick={handleShopClick} />
          ))}
        </div>

        {/* Bottom CTA */}
        {shops.length > 0 && (
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={handleViewAll}
              className="text-xs sm:text-sm font-medium text-violet-600 hover:text-violet-700 transition flex items-center gap-1.5 sm:gap-2 mx-auto group"
            >
              View all {shops.length} shops
              <FaArrowRight className="group-hover:translate-x-1 transition text-[10px] sm:text-xs" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedShops;
