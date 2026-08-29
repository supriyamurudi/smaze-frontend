// frontend/src/components/BusinessCTA.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStore, FaArrowRight, FaUsers, FaChartLine } from "react-icons/fa";

import { getHomeStats } from "../services/homeService";

const BusinessCTA = () => {
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
        // ✅ getHomeStats() now returns ONLY { totalShops, totalCustomers, totalOffers }
        const statsData = await getHomeStats();

        // ✅ No double .data, no checking response.success
        setStats({
          totalShops: statsData.totalShops || 0,
          totalCustomers: statsData.totalCustomers || 0,
          totalOffers: statsData.totalOffers || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // ✅ Keep actual zeros, not fake numbers
        setStats({
          totalShops: 0,
          totalCustomers: 0,
          totalOffers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleListShop = () => {
    navigate("/signup");
  };

  const handleContactSales = () => {
    navigate("/contact");
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M+";
    }
    return num + "+";
  };

  const statItems = [
    {
      value: formatNumber(stats.totalShops),
      label: "Verified Shops",
      delay: 0.1,
    },
    {
      value: formatNumber(stats.totalCustomers),
      label: "Happy Customers",
      delay: 0.2,
    },
    {
      value: formatNumber(stats.totalOffers),
      label: "Active Offers",
      delay: 0.3,
    },
    {
      icon: true,
      label: "Reach More Customers",
      delay: 0.4,
    },
  ];

  return (
    <section className="py-10 sm:py-14 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[30px] lg:rounded-[40px] bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-500 px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-14 lg:py-16 shadow-2xl"
        >
          {/* Background Effects */}
          <div className="absolute -top-20 sm:-top-24 md:-top-28 -right-20 sm:-right-24 md:-right-28 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 sm:-bottom-28 md:-bottom-32 -left-16 sm:-left-20 md:-left-24 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs md:text-sm font-semibold border border-white/20">
                For Business Owners
              </span>

              <h2 className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                Grow Your Business
                <br />
                <span className="text-yellow-300">With Smaze</span>
              </h2>

              <p className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 text-xs sm:text-sm md:text-base lg:text-lg text-white/80 leading-5 sm:leading-6 md:leading-7 lg:leading-8 max-w-xl mx-auto lg:mx-0">
                Join local businesses on Smaze and showcase your offers, attract
                nearby customers, increase visibility and boost sales.
              </p>

              <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleListShop}
                  className="bg-white text-purple-700 px-4 sm:px-5 md:px-6 lg:px-7 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-xl font-bold flex items-center gap-1.5 sm:gap-2 md:gap-3 hover:scale-105 transition shadow-lg text-xs sm:text-sm md:text-base"
                >
                  <FaStore className="text-sm sm:text-base" />
                  List Your Shop
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContactSales}
                  className="border border-white/70 text-white px-4 sm:px-5 md:px-6 lg:px-7 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-xl font-bold flex items-center gap-1.5 sm:gap-2 md:gap-3 hover:bg-white hover:text-purple-700 transition text-xs sm:text-sm md:text-base"
                >
                  Contact Sales
                  <FaArrowRight className="text-xs sm:text-sm" />
                </motion.button>
              </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5"
            >
              {statItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: item.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/15 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 border border-white/20 hover:bg-white/25 transition"
                >
                  {item.icon ? (
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <FaUsers className="text-xl sm:text-2xl md:text-3xl text-yellow-300" />
                      <FaChartLine className="text-xl sm:text-2xl md:text-3xl text-white" />
                    </div>
                  ) : (
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white">
                      {loading ? (
                        <span className="inline-block w-12 sm:w-14 md:w-16 h-6 sm:h-7 md:h-8 bg-white/20 rounded animate-pulse"></span>
                      ) : (
                        item.value
                      )}
                    </h3>
                  )}
                  <p className="mt-0.5 sm:mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm text-white/80">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessCTA;
