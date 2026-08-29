// frontend/src/pages/shop/Ratings.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { getMyShopRatings } from "../../services/ratingService";
import toast from "react-hot-toast";

const ShopRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await getMyShopRatings();
        setRatings(response.ratings || []);
        setAverageRating(response.averageRating || 0);
        setTotalRatings(response.totalRatings || 0);
      } catch (error) {
        console.error("Error fetching my shop ratings:", error);
        toast.error("Failed to load ratings");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
            <div className="h-32 bg-slate-200 rounded-2xl mb-4"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
          My Shop Ratings
        </h1>

        {/* Average Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-slate-900">
              {averageRating || "N/A"}
            </div>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={20}
                    className={
                      star <= Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {totalRatings} ratings
              </p>
            </div>
          </div>
        </div>

        {/* Previous Ratings */}
        <div className="space-y-4">
          {ratings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⭐</div>
              <p className="text-slate-500">
                No ratings yet. Promote your shop to get your first rating!
              </p>
            </div>
          ) : (
            ratings.map((rating) => (
              <div
                key={rating.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-800">
                    {rating.user?.name || "Anonymous"}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={14}
                        className={
                          star <= rating.rating
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                {rating.comment && (
                  <p className="text-sm text-slate-600">{rating.comment}</p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShopRatings;
