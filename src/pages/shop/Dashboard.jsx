// frontend/src/pages/shop/Dashboard.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineTag,
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlinePlusCircle,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowTrendingUp,
  HiOutlineChevronRight,
  HiOutlineUser,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

import { getShopDashboard } from "../../services/shopService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-5 sm:space-y-6">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border bg-white p-4 shadow-sm animate-pulse sm:p-5"
        >
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div className="mt-3 h-3 w-20 rounded bg-slate-200" />
          <div className="mt-2 h-6 w-14 rounded bg-slate-200" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-slate-200 animate-pulse sm:h-20"
        />
      ))}
    </div>

    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-4 sm:px-5">
        <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-4 w-40 rounded bg-slate-200 animate-pulse" />
      </div>

      <div className="divide-y divide-slate-100">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"
          >
            <div className="min-w-0 flex-1">
              <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
              <div className="mt-2 h-3 w-36 rounded bg-slate-200 animate-pulse" />
            </div>

            <div className="h-5 w-14 flex-shrink-0 rounded-full bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ========== PENDING APPROVAL COMPONENT ==========
const PendingApproval = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex min-h-[400px] items-center justify-center p-4"
  >
    <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center sm:p-6">
      <div className="mb-4 text-5xl sm:text-6xl">⏳</div>

      <h2 className="mb-2 text-lg font-bold text-amber-800 sm:text-xl">
        Shop Pending Approval
      </h2>

      <p className="mb-4 text-sm text-amber-700 sm:text-base">
        {message ||
          "Your shop is currently under review by our admin team. You'll get access to the dashboard once your shop is approved."}
      </p>

      <div className="mb-4 rounded-lg bg-white p-4 text-left">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Status:</span>

          <span className="ml-2 mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 sm:mt-0">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending Review
          </span>
        </p>

        <p className="mt-3 text-sm font-semibold text-slate-600">
          What happens next?
        </p>

        <ul className="mt-2 space-y-1 text-sm text-slate-500">
          <li>• Admin will review your shop details</li>
          <li>• You'll receive a notification once approved</li>
          <li>• This usually takes 24-48 hours</li>
        </ul>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="w-full rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 active:scale-[0.98] sm:w-auto"
      >
        Check Status
      </button>
    </div>
  </motion.div>
);

// ========== ERROR COMPONENT ==========
const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-[300px] items-center justify-center p-4">
    <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center text-red-600 sm:px-6">
      <div className="mb-3 text-4xl sm:text-5xl">⚠️</div>

      <p className="font-semibold">{message || "Failed to load dashboard"}</p>

      <button
        onClick={onRetry}
        className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] sm:w-auto"
      >
        Try Again
      </button>
    </div>
  </div>
);

// ========== STAT CARD ==========
const StatCard = ({ title, value, icon: Icon, color, growth }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="relative min-w-0 overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl shadow-slate-200/30 backdrop-blur-xl transition-all hover:shadow-2xl sm:p-5"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />

    <div className="relative flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="break-words text-xs font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>

      <div
        className={`flex-shrink-0 rounded-xl ${color} p-2.5 text-white shadow-lg`}
      >
        <Icon size={18} className="text-white" />
      </div>
    </div>

    {growth && (
      <div className="relative mt-2">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
          <HiOutlineArrowTrendingUp size={12} />
          {growth}
        </span>
      </div>
    )}
  </motion.div>
);

// ========== QUICK ACTION ==========
const QuickAction = ({ title, path, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="min-w-0"
  >
    <Link
      to={path}
      className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl shadow-slate-200/30 backdrop-blur-xl transition-all hover:shadow-2xl sm:gap-4"
    >
      <div className="flex-shrink-0 rounded-xl bg-violet-50 p-3 text-violet-600">
        <Icon size={22} />
      </div>

      <span className="min-w-0 flex-1 break-words text-sm font-medium text-slate-700 sm:text-base">
        {title}
      </span>

      <HiOutlineChevronRight
        className="flex-shrink-0 text-slate-400"
        size={18}
      />
    </Link>
  </motion.div>
);

// ========== MAIN COMPONENT ==========
export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        setPending(false);

        const data = await getShopDashboard();

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard loading error:", error);

        if (error.response?.status === 403) {
          setPending(true);

          setError(
            error.response?.data?.message || "Your shop is pending approval",
          );
        } else if (error.response?.status === 404) {
          toast.error("Shop not found. Please create a shop first.");

          navigate("/shop/create-shop", {
            replace: true,
          });
        } else {
          setError(
            error.response?.data?.message || "Failed to load dashboard data.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // ========== PENDING ==========
  if (pending) {
    return <PendingApproval message={error} />;
  }

  // ========== ERROR ==========
  if (error) {
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

  // ========== NO DATA ==========
  if (!dashboardData) {
    return (
      <ErrorState
        message="No dashboard data available"
        onRetry={() => window.location.reload()}
      />
    );
  }

  const recentOffers = dashboardData?.recentOffers || [];

  const activeOffersCount = recentOffers.filter(
    (offer) => offer.status === "active" || offer.isActive === true,
  ).length;

  const stats = [
    {
      title: "Total Offers",
      value: dashboardData?.stats?.totalOffers || 0,
      icon: HiOutlineTag,
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
      growth: "+12%",
    },
    {
      title: "Active Offers",
      value: activeOffersCount,
      icon: HiOutlinePlusCircle,
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
      growth: "+8%",
    },
    {
      title: "Total Views",
      value: dashboardData?.stats?.totalViews || 0,
      icon: HiOutlineEye,
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      growth: "+24%",
    },
    {
      title: "Saved Offers",
      value: dashboardData?.stats?.savedOffers || 0,
      icon: HiOutlineHeart,
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
      growth: "+15%",
    },
  ];

  const quickActions = [
    {
      title: "Add New Offer",
      path: "/shop/add-offer",
      icon: HiOutlinePlusCircle,
    },
    {
      title: "Manage Offers",
      path: "/shop/my-offers",
      icon: HiOutlineClipboardDocumentList,
    },
    {
      title: "View Analytics",
      path: "/shop/analytics",
      icon: HiOutlineChartBar,
    },
  ];

  const getSavedCount = (offer) => {
    return (
      offer._count?.savedOffers || offer.savedOffers || offer.savedCount || 0
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-16 sm:pb-20"
    >
      {/* No mL added here - your Layout handles the sidebar margin! */}
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        {/* ========== STATS ========== */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* ========== QUICK ACTIONS ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-5 sm:mb-6"
        >
          <h2 className="mb-3 text-base font-semibold text-slate-800 sm:text-lg">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {quickActions.map((action) => (
              <QuickAction key={action.title} {...action} />
            ))}
          </div>
        </motion.div>

        {/* ========== RECENT OFFERS ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-xl shadow-slate-200/30 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />

          {/* Header */}
          <div className="relative flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-800 sm:text-xl">
                Recent Offers
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Track your latest promotions
              </p>
            </div>

            <Link
              to="/shop/my-offers"
              className="flex flex-shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-violet-600 transition hover:text-violet-700 sm:text-sm"
            >
              View All
              <HiOutlineChevronRight size={16} />
            </Link>
          </div>

          {/* Offers */}
          <div className="relative divide-y divide-slate-100">
            {recentOffers.length === 0 ? (
              <div className="flex flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-12">
                <HiOutlineClipboardDocumentList
                  size={44}
                  className="text-slate-300 sm:h-12 sm:w-12"
                />

                <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
                  No offers created yet
                </p>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Start by adding your first offer
                </p>

                <Link
                  to="/shop/add-offer"
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98] sm:w-auto"
                >
                  Add Offer
                </Link>
              </div>
            ) : (
              recentOffers.map((offer) => {
                const isActive =
                  offer.status === "active" || offer.isActive === true;

                const savedCount = getSavedCount(offer);

                return (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between gap-3 px-4 py-4 transition hover:bg-violet-50/50 sm:px-6"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
                        {offer.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                        {offer.category?.name || "Uncategorized"} • {savedCount}{" "}
                        saved
                      </p>
                    </div>

                    <span
                      className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:px-3 sm:text-xs ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* ========== ACCOUNT & SETTINGS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 md:grid-cols-2"
        >
          {/* Account */}
          <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl shadow-slate-200/30 backdrop-blur-xl sm:p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />

            <div className="relative flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center">
              {/* Icon and Text */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex-shrink-0 rounded-xl bg-violet-50 p-3 text-violet-600">
                  <HiOutlineUser size={22} />
                </div>

                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800">Account</h4>

                  <p className="text-xs text-slate-500 sm:text-sm">
                    Manage your profile
                  </p>
                </div>
              </div>

              {/* Button */}
              <Link
                to="/shop/profile"
                className="flex w-full flex-shrink-0 items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98] min-[480px]:w-auto"
              >
                Manage
              </Link>
            </div>
          </div>

          {/* Settings */}
          <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl shadow-slate-200/30 backdrop-blur-xl sm:p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />

            <div className="relative flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center">
              {/* Icon and Text */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex-shrink-0 rounded-xl bg-slate-100 p-3 text-slate-600">
                  <HiOutlineCog6Tooth size={22} />
                </div>

                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800">Settings</h4>

                  <p className="text-xs text-slate-500 sm:text-sm">
                    Manage your preferences
                  </p>
                </div>
              </div>

              {/* Button */}
              <Link
                to="/shop/settings"
                className="flex w-full flex-shrink-0 items-center justify-center rounded-lg bg-slate-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.98] min-[480px]:w-auto"
              >
                Manage
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
