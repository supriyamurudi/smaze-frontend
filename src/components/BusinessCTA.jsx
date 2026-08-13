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
        const response = await getHomeStats();
        if (response.success) {
          setStats({
            totalShops: response.data?.totalShops || 0,
            totalCustomers: response.data?.totalCustomers || 0,
            totalOffers: response.data?.totalOffers || 0,
          });
        }
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
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] md:rounded-[40px] bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-500 px-5 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-14 md:py-16 shadow-2xl">
          {/* Background Effects */}
          <div className="absolute -top-24 -right-24 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full bg-purple-300/20 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold border border-white/20">
                For Business Owners
              </span>

              <h2 className="mt-4 sm:mt-5 md:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                Grow Your Business
                <br />
                <span className="text-yellow-300">With Smaze</span>
              </h2>

              <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-white/80 leading-6 sm:leading-7 md:leading-8 max-w-xl">
                Join local businesses on Smaze and showcase your offers, attract
                nearby customers, increase visibility and boost sales.
              </p>

              <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap gap-3 sm:gap-4 md:gap-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleListShop}
                  className="bg-white text-purple-700 px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-4 rounded-xl font-bold flex items-center gap-2 sm:gap-3 hover:scale-105 transition shadow-lg text-sm sm:text-base"
                >
                  <FaStore />
                  List Your Shop
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContactSales}
                  className="border border-white/70 text-white px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-4 rounded-xl font-bold flex items-center gap-2 sm:gap-3 hover:bg-white hover:text-purple-700 transition text-sm sm:text-base"
                >
                  Contact Sales
                  <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5"
            >
              {statItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white/15 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-white/20 hover:bg-white/25 transition"
                >
                  {item.icon ? (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FaUsers className="text-2xl sm:text-3xl text-yellow-300" />
                      <FaChartLine className="text-2xl sm:text-3xl text-white" />
                    </div>
                  ) : (
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                      {loading ? (
                        <span className="inline-block w-16 h-8 bg-white/20 rounded animate-pulse"></span>
                      ) : (
                        item.value
                      )}
                    </h3>
                  )}
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;
