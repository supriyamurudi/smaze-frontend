// frontend/src/components/Testimonials.jsx
import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { getPublicFeedback } from "../services/feedbackService";

const Testimonials = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await getPublicFeedback();
        // Map API feedback to a displayable format
        const displayData = response.feedback.map((item) => ({
          id: item.id,
          name: item.user?.name || "Anonymous User",
          role: "Smaze User",
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user?.name || "A")}&background=7c3aed&color=fff&size=128`,
          review: item.message,
          rating: item.rating || 5, // ✅ Use the actual rating
        }));
        setFeedback(displayData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs sm:text-sm font-semibold">
            Testimonials
          </span>

          <h2 className="mt-4 sm:mt-5 md:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            What Our Users Say
          </h2>

          <p className="mt-3 sm:mt-4 md:mt-5 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-500 leading-6 sm:leading-7 md:leading-8">
            Thousands of customers and businesses trust Smaze to discover, share
            and grow with the best local offers.
          </p>
        </div>

        {/* Cards Grid - Responsive */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading Skeleton
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-purple-100 shadow-sm"
              >
                <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse mb-6"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-8"></div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : feedback.length === 0 ? (
            <div className="col-span-3 text-center py-16">
              <p className="text-slate-500 text-lg">
                No testimonials yet. Be the first to share your feedback!
              </p>
            </div>
          ) : (
            feedback.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-purple-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-500 overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-bl-full opacity-40" />

                {/* Quote Icon */}
                <div className="relative w-12 sm:w-13 md:w-14 h-12 sm:h-13 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200 mb-4 sm:mb-5 md:mb-6">
                  <FaQuoteLeft className="text-white text-xl sm:text-2xl" />
                </div>

                {/* Review */}
                <p className="relative text-sm sm:text-base text-slate-600 leading-6 sm:leading-7 md:leading-8">
                  "{item.review}"
                </p>

                {/* Rating */}
                <div className="flex mt-4 sm:mt-5 md:mt-6 mb-5 sm:mb-6 md:mb-7">
                  {[...Array(item.rating)].map((_, index) => (
                    <FaStar
                      key={index}
                      className="text-yellow-400 mr-1 text-base sm:text-lg"
                    />
                  ))}
                </div>

                {/* User */}
                <div className="flex items-center gap-3 sm:gap-4 border-t border-slate-100 pt-4 sm:pt-5 md:pt-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-full object-cover border-4 border-purple-100"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.name,
                      )}&background=7c3aed&color=fff&size=128`;
                    }}
                  />

                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-600 font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA - Optional */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p className="text-sm sm:text-base text-slate-500">
            Join thousands of satisfied users.{" "}
            <a
              href="/signup"
              className="text-purple-600 font-semibold hover:text-purple-700 transition"
            >
              Get started today →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
