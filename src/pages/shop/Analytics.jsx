// pages/shop/Analytics.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  HiOutlineTag,
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlineChartBar,
  HiOutlineArrowUp,
  HiOutlineUsers,
  HiOutlineChevronRight,
} from "react-icons/hi2";

import toast from "react-hot-toast";
import { getShopAnalytics } from "../../services/shopService";

// ========== SKELETON LOADER (Mobile optimized) ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div>
      <div className="h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm"
        >
          <div className="h-10 w-10 sm:h-14 sm:w-14 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="mt-3 sm:mt-5 h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-2 h-6 sm:h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
    <div className="rounded-2xl border bg-white p-5 sm:p-6 shadow-sm">
      <div className="h-5 w-48 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-4 h-40 sm:h-64 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b">
        <div className="h-5 w-48 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="p-5 sm:p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ========== STAT CARD (Mobile optimized) ==========
const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-xl"
  >
    <div className={`inline-flex rounded-xl ${color} p-2.5 sm:p-3 text-white`}>
      <Icon size={20} className="sm:h-6 sm:w-6" />
    </div>
    <p className="mt-3 sm:mt-5 text-xs sm:text-sm text-slate-500">{title}</p>
    <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-800">
      {value.toLocaleString()}
    </h2>
  </motion.div>
);

// ========== MAIN COMPONENT ==========
export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getShopAnalytics();
        setAnalytics(response.analytics);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load analytics",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Offers",
      value: analytics?.totalOffers || 0,
      icon: HiOutlineTag,
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      title: "Total Views",
      value: analytics?.totalViews || 0,
      icon: HiOutlineEye,
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
    {
      title: "Saved Customers",
      value: analytics?.savedCustomers || 0,
      icon: HiOutlineHeart,
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
    },
    {
      title: "Redemptions",
      value: analytics?.redemptions || 0,
      icon: HiOutlineChartBar,
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:mr-8 lg:mb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              Analytics
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-500">
              Track your offer performance and customer engagement
            </p>
          </div>
          <span className="self-start sm:self-center rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <HiOutlineArrowUp className="inline mr-1" size={14} /> Live
          </span>
        </div>

        {/* Stats Cards (2x2 Grid on Mobile, 4x1 on Desktop) */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.title} {...stat} delay={i * 0.1} />
          ))}
        </div>

        {/* Chart Section */}
        <div className="mb-6 sm:mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Monthly Performance
            </h2>
            <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs sm:text-sm text-slate-600 hover:bg-slate-50">
              View Details{" "}
              <HiOutlineChevronRight className="inline" size={14} />
            </button>
          </div>
          <div className="flex h-40 sm:h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/40 text-violet-400">
            <HiOutlineChartBar size={35} className="sm:h-12 sm:w-12" />
            <p className="mt-2 text-xs sm:text-sm font-medium">
              Analytics chart coming soon
            </p>
          </div>
        </div>

        {/* Top Offers Table (Horizontally Scrollable on Mobile) */}
        <div className="mb-6 sm:mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 sm:px-6 py-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              🏆 Top Performing Offers
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-violet-50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm">
                    Offer
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm">
                    Saves
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center text-xs sm:text-sm">
                    Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topOffers?.map((offer) => (
                  <tr key={offer.id} className="border-t hover:bg-violet-50/40">
                    <td className="px-4 sm:px-6 py-4 font-medium text-slate-800 text-sm">
                      {offer.title}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-slate-600 text-sm">
                      {offer.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center font-semibold text-rose-500 text-sm">
                      <HiOutlineHeart className="inline mr-1" size={14} />
                      {offer._count?.savedOffers || 0}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white">
                        {offer.discount}% OFF
                      </span>
                    </td>
                  </tr>
                ))}
                {analytics?.topOffers?.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-slate-500 text-sm"
                    >
                      No offers available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights (Stacks on Mobile) */}
        <div className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-5 sm:p-6 text-white">
            <div className="flex items-center gap-3">
              <HiOutlineUsers size={24} />
              <div>
                <p className="text-xs sm:text-sm text-violet-200">
                  Total Reach
                </p>
                <p className="text-xl sm:text-2xl font-black">
                  {analytics?.totalViews || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 p-5 sm:p-6 text-white">
            <div className="flex items-center gap-3">
              <HiOutlineHeart size={24} />
              <div>
                <p className="text-xs sm:text-sm text-rose-200">
                  Saved by Customers
                </p>
                <p className="text-xl sm:text-2xl font-black">
                  {analytics?.savedCustomers || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 sm:p-6 text-white">
            <div className="flex items-center gap-3">
              <HiOutlineChartBar size={24} />
              <div>
                <p className="text-xs sm:text-sm text-emerald-200">
                  Redemption Rate
                </p>
                <p className="text-xl sm:text-2xl font-black">
                  {analytics?.totalViews > 0
                    ? Math.round(
                        ((analytics?.redemptions || 0) /
                          analytics?.totalViews) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
