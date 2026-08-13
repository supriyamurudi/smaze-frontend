// frontend/src/components/Hero.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaArrowRight,
  FaStore,
  FaUsers,
  FaLightbulb,
  FaStar,
  FaFire,
} from "react-icons/fa";

import { getHomeStats } from "../services/homeService";

export default function Hero() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalShops: 0,
    totalCustomers: 0,
    totalOffers: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Belagavi");
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/offers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

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
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 py-20">
      {/* Background Shapes */}
      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-pink-300/20 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-fuchsia-200/10 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 px-5 py-2 font-semibold shadow">
              <FaFire className="text-violet-500" />
              India's Smart Local Discovery Platform
            </span>

            {/* Heading */}
            <h1 className="mt-7 text-4xl md:text-5xl xl:text-6xl font-black leading-tight text-gray-900">
              Discover Amazing
              <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
                Local Deals
              </span>
              Near You
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
              Discover the best restaurants, fashion stores, electronics,
              grocery shops and exclusive discounts from trusted local
              businesses in your city.
            </p>

            {/* Search Box */}
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSearch}
              className="mt-8 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-2xl p-4"
            >
              <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-4">
                <div className="flex items-center gap-3 h-14 px-5 rounded-2xl border border-gray-200 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                  <FaSearch className="text-violet-600 text-lg flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search shops, offers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                  />
                </div>

                <div className="flex items-center gap-3 h-14 px-5 rounded-2xl border border-gray-200 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                  <FaMapMarkerAlt className="text-pink-500 text-lg flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="h-14 px-8 rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white font-semibold flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Explore
                  <FaArrowRight />
                </button>
              </div>
            </motion.form>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 mt-7"
            >
              <button
                onClick={handleExplore}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white font-bold shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                Explore Deals
                <FaArrowRight />
              </button>

              <button
                onClick={handleJoinBusiness}
                className="px-8 py-4 rounded-2xl border-2 border-violet-200 bg-white text-violet-700 font-semibold hover:bg-violet-50 transition-all duration-300"
              >
                Join Business
              </button>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mt-7"
            >
              <div className="flex text-yellow-400 gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="text-gray-600">
                Trusted by{" "}
                <span className="font-bold text-violet-700">
                  {formatNumber(stats.totalCustomers)}
                </span>{" "}
                customers across India.
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1400"
              alt="Hero"
              className="rounded-[35px] h-[500px] w-full object-cover shadow-2xl"
            />

            {/* Card 1 - Trending Offer */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-6 -left-8 bg-white rounded-3xl p-5 shadow-xl"
            >
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <FaFire className="text-orange-500" /> Trending
              </p>
              <h2 className="text-3xl font-black text-violet-700">50% OFF</h2>
              <p className="text-gray-600">Fashion Stores</p>
            </motion.div>

            {/* Card 2 - Verified Shops */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute bottom-8 -right-8 bg-white rounded-3xl p-5 shadow-xl"
            >
              <p className="text-gray-500 text-sm flex items-center gap-1">
                🏪 Verified Shops
              </p>
              <h2 className="text-3xl font-black text-pink-600">
                {formatNumber(stats.totalShops)}
              </h2>
              <p className="text-gray-600">Growing Daily</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mt-14">
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
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, number, text, loading }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white flex items-center gap-5"
    >
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>

      <div>
        <h3 className="text-2xl font-black text-gray-900">
          {loading ? (
            <span className="inline-block w-16 h-8 bg-slate-200 rounded animate-pulse"></span>
          ) : (
            number
          )}
        </h3>
        <p className="text-gray-500">{text}</p>
      </div>
    </motion.div>
  );
}
