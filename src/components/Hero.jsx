// frontend/src/components/Hero.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaStore,
  FaUsers,
  FaLightbulb,
  FaStar,
  FaFire,
  FaMapMarkerAlt,
  FaClock,
  FaShieldAlt,
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getHomeStats();
        setStats({
          totalShops: response.data?.totalShops || 0,
          totalCustomers: response.data?.totalCustomers || 0,
          totalOffers: response.data?.totalOffers || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback data
        setStats({
          totalShops: 500,
          totalCustomers: 10000,
          totalOffers: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExplore = () => {
    navigate("/offers");
  };

  const handleJoinBusiness = () => {
    navigate("/signup");
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+";
    }
    return num + "+";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
      {/* Background Shapes */}
      <div className="absolute -top-40 -left-32 h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-32 h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96 rounded-full bg-pink-300/20 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-60 w-60 sm:h-72 sm:w-72 lg:h-80 lg:w-80 rounded-full bg-fuchsia-200/10 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 px-4 py-1.5 sm:px-5 sm:py-2 font-semibold shadow text-xs sm:text-sm"
            >
              <FaFire className="text-violet-500 text-sm" />
              India's Smart Local Discovery Platform
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 sm:mt-6 lg:mt-7 text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black leading-tight text-gray-900"
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
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-3 sm:mt-4 lg:mt-6 text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed sm:leading-8 max-w-xl mx-auto lg:mx-0"
            >
              Discover the best restaurants, fashion stores, electronics,
              grocery shops and exclusive discounts from trusted local
              businesses in your city.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-6 lg:mt-7 justify-center lg:justify-start"
            >
              <button
                onClick={handleExplore}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                Explore Deals
                <FaArrowRight className="text-sm sm:text-base" />
              </button>

              <button
                onClick={handleJoinBusiness}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-violet-200 bg-white text-violet-700 font-semibold hover:bg-violet-50 transition-all duration-300 text-sm sm:text-base"
              >
                Join Business
              </button>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-5 sm:mt-6 lg:mt-7"
            >
              <div className="flex text-yellow-400 gap-0.5 sm:gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-base sm:text-xl" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Trusted by{" "}
                <span className="font-bold text-violet-700">
                  {formatNumber(stats.totalCustomers)}
                </span>{" "}
                customers across India.
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT - Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative mt-6 lg:mt-0"
          >
            {/* Image Container */}
            <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[35px] overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[500px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1400"
                  alt="Hero"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Gradient Overlay for better text visibility on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden"></div>
            </div>

            {/* Card 1 - Trending Offer */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-3 sm:top-4 lg:top-6 -left-2 sm:-left-4 lg:-left-8 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 shadow-xl border border-white/50"
            >
              <p className="text-gray-500 text-[10px] sm:text-xs lg:text-sm flex items-center gap-1">
                <FaFire className="text-orange-500 text-xs sm:text-sm" />{" "}
                Trending
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-violet-700">
                50% OFF
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">Fashion Stores</p>
            </motion.div>

            {/* Card 2 - Verified Shops */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1 }}
              className="absolute bottom-3 sm:bottom-4 lg:bottom-8 -right-2 sm:-right-4 lg:-right-8 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 shadow-xl border border-white/50"
            >
              <p className="text-gray-500 text-[10px] sm:text-xs lg:text-sm flex items-center gap-1">
                <FaShieldAlt className="text-green-500 text-xs sm:text-sm" />{" "}
                Verified
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-pink-600">
                {formatNumber(stats.totalShops)}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">Growing Daily</p>
            </motion.div>

            {/* Mobile Quick Info Badges */}
            <div className="lg:hidden flex gap-2 mt-3 justify-center">
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-medium text-gray-600 shadow-sm border border-white">
                <FaMapMarkerAlt className="text-violet-500 text-[10px]" />
                Local Shops
              </span>
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-medium text-gray-600 shadow-sm border border-white">
                <FaClock className="text-violet-500 text-[10px]" />
                24/7 Deals
              </span>
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-medium text-gray-600 shadow-sm border border-white">
                <FaShieldAlt className="text-green-500 text-[10px]" />
                Verified
              </span>
            </div>
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-10 lg:mt-14"
        >
          <Stat
            icon={<FaStore />}
            number={formatNumber(stats.totalShops)}
            text="Verified Shops"
            loading={loading}
          />
          <Stat
            icon={<FaUsers />}
            number={formatNumber(stats.totalCustomers)}
            text="Happy Customers"
            loading={loading}
          />
          <Stat
            icon={<FaLightbulb />}
            number={formatNumber(stats.totalOffers)}
            text="Active Offers"
            loading={loading}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ icon, number, text, loading }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl border border-white flex items-center gap-3 sm:gap-4 lg:gap-5"
    >
      <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white flex items-center justify-center text-base sm:text-lg lg:text-xl flex-shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900">
          {loading ? (
            <span className="inline-block w-12 sm:w-16 h-6 sm:h-8 bg-slate-200 rounded animate-pulse"></span>
          ) : (
            number
          )}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">{text}</p>
      </div>
    </motion.div>
  );
}
