// frontend/src/components/HomeOffers.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaFire,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { getOffers } from "../services/offerService";

const HomeOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await getOffers({ limit: 10, featured: true });
        setOffers(response.offers || []);
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleOfferClick = (offerId) => {
    navigate(`/offers/${offerId}`);
  };

  const handleViewAll = () => {
    navigate("/offers");
  };

  const formatExpiry = (endDate) => {
    if (!endDate) return "No expiry";
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff < 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Ends Today";
    if (days === 1) return "Ends Tomorrow";
    if (days < 7) return `${days}d left`;
    return `${Math.ceil(days / 7)}w left`;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-5 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[280px] animate-pulse flex-shrink-0"
              >
                <div className="rounded-2xl bg-white shadow-xl border border-white/60 overflow-hidden">
                  <div className="h-52 bg-slate-200"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-20 bg-slate-200 rounded"></div>
                    <div className="h-5 w-3/4 bg-slate-200 rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-slate-200 rounded"></div>
                      <div className="h-3 w-16 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-9 w-full bg-slate-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-semibold">
              <FaFire />
              Trending Deals
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-gray-900">
              Exclusive Offers
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Around You
              </span>
            </h2>
          </div>

          <button
            onClick={handleViewAll}
            className="group flex items-center gap-2 rounded-full border border-violet-200 bg-white px-5 py-2.5 font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-600 hover:text-white text-sm"
          >
            View All
            <FaArrowRight
              className="group-hover:translate-x-1 transition"
              size={14}
            />
          </button>
        </div>

        {/* Horizontal Scroll - Single Row */}
        <div className="overflow-x-auto pb-4 scroll-smooth hide-scrollbar">
          <div className="flex gap-5" style={{ width: "max-content" }}>
            {offers.slice(0, 8).map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ y: -6 }}
                onClick={() => handleOfferClick(offer.id)}
                className="w-[280px] flex-shrink-0 cursor-pointer group"
              >
                <div className="rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100/50 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    <img
                      src={
                        offer.image ||
                        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=250&fit=crop"
                      }
                      alt={offer.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=250&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {offer.discount && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {offer.discount}% OFF
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success("Login to save offers!");
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white transition shadow-lg"
                    >
                      <FaHeart className="text-slate-600 hover:text-rose-500 transition text-sm" />
                    </button>

                    {offer.category?.name && (
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-violet-600 text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                        {offer.category.name}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 truncate">
                      {offer.shop?.name || "Local Shop"}
                    </p>

                    <h3 className="mt-1.5 text-sm font-bold text-slate-800 line-clamp-2 min-h-[44px]">
                      {offer.title}
                    </h3>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 truncate max-w-[140px]">
                        <FaMapMarkerAlt
                          className="text-violet-500 flex-shrink-0"
                          size={12}
                        />
                        {offer.shop?.address?.split(",")[0] || "Near You"}
                      </span>
                      <span className="flex items-center gap-1.5 flex-shrink-0">
                        <FaClock className="text-amber-500" size={12} />
                        {formatExpiry(offer.endDate)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOfferClick(offer.id);
                      }}
                      className="mt-3.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:scale-[1.02] transition shadow-md shadow-violet-200/50 flex-shrink-0"
                    >
                      View Offer →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* View More Card */}
            {offers.length > 6 && (
              <motion.div
                whileHover={{ y: -6 }}
                onClick={handleViewAll}
                className="w-[280px] flex-shrink-0 cursor-pointer group"
              >
                <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-dashed border-violet-200 hover:border-violet-400 transition-all duration-300 h-full flex flex-col items-center justify-center p-6 text-center min-h-[320px]">
                  <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    <FaArrowRight className="text-violet-600" size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-800">
                    View More
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    See all {offers.length} offers
                  </p>
                  <button className="mt-4 px-6 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition">
                    Explore All →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        {offers.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={handleViewAll}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 transition flex items-center gap-2 mx-auto"
            >
              View all {offers.length} offers
              <FaArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeOffers;
