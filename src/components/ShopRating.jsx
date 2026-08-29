// frontend/src/components/ShopRating.jsx
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import {
  getShopRatings,
  submitRating,
  getMyShopRating,
} from "../services/ratingService";
import toast from "react-hot-toast";

const ShopRating = ({ shopId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopRatingsRes, myRatingRes] = await Promise.all([
          getShopRatings(shopId),
          getMyShopRating(shopId),
        ]);

        setRatings(shopRatingsRes.ratings || []);
        setAverageRating(shopRatingsRes.averageRating || 0);
        setMyRating(myRatingRes.rating?.rating || 0);
        setComment(myRatingRes.rating?.comment || "");
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchData();
  }, [shopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!myRating) {
      toast.error("Please select a star rating");
      return;
    }

    try {
      setSaving(true);
      await submitRating(shopId, myRating, comment);
      toast.success("Rating submitted successfully!");

      // Refresh data
      const shopRatingsRes = await getShopRatings(shopId);
      setRatings(shopRatingsRes.ratings || []);
      setAverageRating(shopRatingsRes.averageRating || 0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Shop Ratings</h2>

      {/* Average Rating */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl font-bold text-slate-900">
          {averageRating || "N/A"}
        </div>
        <div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={18}
                className={
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-slate-300"
                }
              />
            ))}
          </div>
          <p className="text-sm text-slate-500">{ratings.length} ratings</p>
        </div>
      </div>

      {/* Submit Rating */}
      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setMyRating(star)}
              className="p-1 transition-transform hover:scale-125"
            >
              <FaStar
                size={28}
                className={
                  myRating >= star ? "text-yellow-400" : "text-slate-300"
                }
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this shop..."
          rows="3"
          className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 mb-3"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50"
        >
          {saving ? "Saving..." : "Submit Rating"}
        </button>
      </form>

      {/* Previous Ratings */}
      <div className="space-y-3">
        {ratings.map((rating) => (
          <div key={rating.id} className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-800">
                {rating.user?.name || "Anonymous"}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={12}
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
            <p className="text-xs text-slate-400 mt-1">
              {new Date(rating.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopRating;
