// frontend/src/components/Offers.jsx
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

// ========== SKELETON LOADER ==========
const OffersSkeleton = () => (
  <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse overflow-hidden rounded-[32px] bg-white shadow-xl border border-white/60"
      >
        <div className="h-72 bg-slate-200"></div>
        <div className="p-7 space-y-4">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-4 w-full bg-slate-200 rounded"></div>
          <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
          <div className="flex justify-between pt-5 border-t">
            <div className="h-9 w-9 bg-slate-200 rounded-full"></div>
            <div className="h-9 w-20 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-12 w-full bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    ))}
  </div>
);

// ========== MAIN COMPONENT ==========
export default function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOffers({
          limit: 6,
          featured: true,
        });
        setOffers(response.offers || []);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError("Failed to load offers. Please try again.");
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleViewAll = () => {
    navigate("/offers");
  };

  const handleOfferClick = (offerId) => {
    navigate(`/offers/${offerId}`);
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
    if (days < 7) return `Ends in ${days} Days`;
    return `Ends in ${Math.ceil(days / 7)} Weeks`;
  };

  const getLocation = (offer) => {
    return offer.shop?.address || offer.shop?.city || "Near You";
  };

  if (error) {
    return (
      <section className="relative overflow-hidden py-28 bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-6xl mb-4">😅</div>
          <h3 className="text-2xl font-bold text-slate-800">
            Oops! Something went wrong
          </h3>
          <p className="text-slate-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-gradient-to-r from-violet-700 to-pink-500 px-6 py-3 font-semibold text-white hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-28 bg-gradient-to-br from-violet-50 via-white to-pink-50">
      {/* Decorative Background */}
      <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16"
        >
          <div>
            <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-5 py-2 rounded-full font-semibold">
              <FaFire />
              Trending Deals
            </span>

            <h2 className="mt-6 text-5xl font-black text-gray-900 leading-tight">
              Exclusive Offers
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Around You
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-lg text-gray-600">
              Save more every day by discovering exclusive deals from trusted
              local businesses near you.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="group flex items-center gap-3 rounded-full border border-violet-200 bg-white px-7 py-4 font-semibold text-violet-700 shadow-lg transition hover:-translate-y-1 hover:bg-violet-600 hover:text-white"
          >
            View All
            <FaArrowRight className="group-hover:translate-x-1 transition" />
          </button>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <OffersSkeleton />
        ) : offers.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-slate-800">
              No offers available
            </h3>
            <p className="text-slate-500 mt-2">
              Check back later for exciting deals!
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => handleOfferClick(offer.id)}
                className="group overflow-hidden rounded-[32px] bg-white shadow-xl border border-white/60 backdrop-blur-xl cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={
                      offer.image ||
                      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=900&q=80"
                    }
                    alt={offer.title}
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=900&q=80";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                  {/* Discount Badge */}
                  {offer.discount && (
                    <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-violet-700 to-pink-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
                      {offer.discount}% OFF
                    </span>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Login to save offers!");
                    }}
                    className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-xl backdrop-blur transition hover:scale-110 hover:text-pink-500"
                  >
                    <FaHeart />
                  </button>

                  {/* Category */}
                  {offer.category?.name && (
                    <div className="absolute left-5 bottom-5">
                      <span className="rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold text-violet-700 shadow">
                        {offer.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col p-7 h-full">
                  <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                    {offer.shop?.name || "Local Shop"}
                  </p>

                  <h3 className="mt-3 min-h-[70px] text-2xl font-extrabold leading-tight text-gray-900 line-clamp-2">
                    {offer.title}
                  </h3>

                  <p className="mt-3 text-gray-500 leading-7 line-clamp-2">
                    {offer.description ||
                      "Enjoy premium savings from verified businesses around your city."}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                        <FaMapMarkerAlt />
                      </div>
                      <span>{getLocation(offer)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                        <FaClock />
                      </div>
                      <span>{formatExpiry(offer.endDate)}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOfferClick(offer.id);
                    }}
                    className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
                  >
                    View Offer
                    <FaArrowRight className="transition group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
