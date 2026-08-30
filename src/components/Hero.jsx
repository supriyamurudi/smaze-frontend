// frontend/src/components/Hero.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaFire,
  FaClock,
  FaGift,
  FaShoppingBag,
  FaStar,
  FaShieldAlt,
  FaMobileAlt,
  FaApple,
} from "react-icons/fa";

import { getHomeStats } from "../services/homeService";

export default function Hero() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalShops: 0,
    totalCustomers: 0,
    totalOffers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showAppModal, setShowAppModal] = useState(false);

  // ✅ FIX: Detect browser directly during initial render (No useEffect, No ESLint error)
  const [isIOS] = useState(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return (
      /iphone|ipad|ipod/.test(userAgent) ||
      (userAgent.includes("mac") && "ontouchend" in document)
    );
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await getHomeStats();
        setStats({
          totalShops: statsData.totalShops || 0,
          totalCustomers: statsData.totalCustomers || 0,
          totalOffers: statsData.totalOffers || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({ totalShops: 0, totalCustomers: 0, totalOffers: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExplore = () => navigate("/offers");
  const handleJoinBusiness = () => navigate("/signup");

  const handleDownloadClick = () => {
    if (isIOS) {
      // iOS: Open a modal to instruct them to add to home screen
      setShowAppModal(true);
    } else {
      // Android/Windows: Redirect to your APK or Play Store link
      // Replace 'YOUR_ANDROID_LINK_HERE' with your actual store link
      window.open("YOUR_ANDROID_LINK_HERE", "_blank");
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K+";
    return num + "+";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 pt-6 sm:pt-8 md:pt-10 lg:pt-14 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      {/* Background Shapes */}
      <div className="absolute -top-40 -left-32 h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-32 h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full bg-pink-300/20 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-60 w-60 sm:h-72 sm:w-72 lg:h-80 lg:w-80 rounded-full bg-fuchsia-200/10 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          {/* LEFT CONTENT */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 px-3 py-1.5 sm:px-4 sm:py-1.5 font-semibold shadow text-[10px] sm:text-xs"
            >
              <FaFire className="text-violet-500 text-[10px] sm:text-xs" />
              India's Smart Local Discovery Platform
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 sm:mt-4 lg:mt-5 text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black leading-tight text-gray-900"
            >
              Discover Amazing
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Local Deals
              </span>
              Near You
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Discover the best restaurants, fashion stores, electronics,
              grocery shops and exclusive discounts from trusted local
              businesses in your city.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 lg:mt-6 justify-center lg:justify-start"
            >
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                Explore Deals
                <FaArrowRight className="text-xs sm:text-sm" />
              </button>

              <button
                onClick={handleJoinBusiness}
                className="w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-violet-200 bg-white text-violet-700 font-semibold hover:bg-violet-50 transition-all duration-300 text-sm"
              >
                Join Business
              </button>

              {/* ✅ Download App Button */}
              <button
                onClick={handleDownloadClick}
                className="w-full sm:w-auto px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg"
              >
                <FaMobileAlt className="text-xs sm:text-sm" />
                Get App
              </button>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 mt-4 sm:mt-5"
            >
              <div className="flex text-yellow-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm sm:text-base" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Trusted by{" "}
                <span className="font-bold text-violet-700">
                  {loading ? "..." : formatNumber(stats.totalCustomers)}
                </span>{" "}
                customers across Belagavi.
              </p>
            </motion.div>
          </div>

          {/* RIGHT - Hero Image */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1400"
                    alt="Hero"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
              </div>

              {/* Feature Cards - Clean grid below image */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                {/* Trending Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-lg border border-white/50"
                >
                  <div className="flex items-center gap-1 text-orange-500 text-[10px] sm:text-xs font-medium">
                    <FaFire className="text-[10px] sm:text-xs" />
                    Trending
                  </div>
                  <div className="mt-0.5">
                    <span className="text-lg sm:text-xl lg:text-2xl font-black text-violet-700">
                      50%
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg font-black text-violet-700">
                      {" "}
                      OFF
                    </span>
                  </div>
                  <p className="text-gray-600 text-[10px] sm:text-xs">
                    Fashion Stores
                  </p>
                </motion.div>

                {/* Shops Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-lg border border-white/50"
                >
                  <div className="flex items-center gap-1 text-green-500 text-[10px] sm:text-xs font-medium">
                    <FaShieldAlt className="text-[10px] sm:text-xs" />
                    Verified
                  </div>
                  <div className="mt-0.5">
                    <span className="text-lg sm:text-xl lg:text-2xl font-black text-pink-600">
                      {loading ? "..." : formatNumber(stats.totalShops)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[10px] sm:text-xs">
                    Active Shops
                  </p>
                </motion.div>
              </div>

              {/* Mobile Quick Info - Hidden on desktop */}
              <div className="lg:hidden flex flex-wrap gap-1.5 justify-center mt-2.5">
                <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-gray-600 shadow-sm border border-white">
                  <FaShoppingBag className="text-violet-500 text-[9px] sm:text-[10px]" />
                  Local Shops
                </span>
                <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-gray-600 shadow-sm border border-white">
                  <FaClock className="text-violet-500 text-[9px] sm:text-[10px]" />
                  24/7 Deals
                </span>
                <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-gray-600 shadow-sm border border-white">
                  <FaGift className="text-pink-500 text-[9px] sm:text-[10px]" />
                  Exclusive Offers
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ✅ App Installation Modal (For iPhone Users) */}
      <AnimatePresence>
        {showAppModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAppModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-violet-600 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-4">
                  <FaApple />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Install Smaze on iPhone
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Follow these simple steps to add Smaze to your home screen:
                </p>
                <ol className="text-left text-sm text-gray-700 space-y-3 mb-6 bg-gray-50 p-4 rounded-xl">
                  <li>
                    1. Tap the <strong>Share</strong> icon{" "}
                    <span className="text-blue-500">
                      (Square with arrow up)
                    </span>{" "}
                    in Safari.
                  </li>
                  <li>
                    2. Scroll down and tap <strong>"Add to Home Screen"</strong>
                    .
                  </li>
                  <li>
                    3. Tap <strong>"Add"</strong> in the top right corner.
                  </li>
                  <li>
                    4. Find the Smaze app icon on your home screen and start
                    exploring!
                  </li>
                </ol>
                <button
                  onClick={() => setShowAppModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
