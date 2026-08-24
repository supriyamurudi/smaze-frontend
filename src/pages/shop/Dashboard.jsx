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
  HiOutlineBuildingStorefront,
  HiOutlineChevronRight,
  HiOutlineUser,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

import { getShopDashboard } from "../../services/shopService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="mt-4 md:mt-0 h-10 w-40 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white border p-4 sm:p-5 shadow-sm animate-pulse"
        >
          <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
          <div className="mt-3 h-3 w-20 bg-slate-200 rounded"></div>
          <div className="mt-1 h-6 w-14 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-14 md:h-20 bg-slate-200 rounded-xl animate-pulse"
        ></div>
      ))}
    </div>
    <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b">
        <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-1 h-4 w-40 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-1 h-3 w-36 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-14 bg-slate-200 rounded-full animate-pulse"></div>
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
    <div className="rounded-2xl bg-amber-50 p-6 text-center border border-amber-200 max-w-md w-full">
      <div className="text-6xl mb-4">⏳</div>
      <h2 className="text-xl font-bold text-amber-800 mb-2">
        Shop Pending Approval
      </h2>
      <p className="text-amber-700 mb-4">
        {message ||
          "Your shop is currently under review by our admin team. You'll get access to the dashboard once your shop is approved."}
      </p>
      <div className="bg-white rounded-lg p-4 mb-4 text-left">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Status:</span>
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Pending Review
          </span>
        </p>
        <p className="text-sm text-slate-600 mt-2">
          <span className="font-semibold">What happens next?</span>
        </p>
        <ul className="text-sm text-slate-500 mt-1 space-y-1">
          <li>• Admin will review your shop details</li>
          <li>• You'll receive a notification once approved</li>
          <li>• This usually takes 24-48 hours</li>
        </ul>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="w-full sm:w-auto rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition"
      >
        Check Status
      </button>
    </div>
  </motion.div>
);

// ========== ERROR COMPONENT ==========
const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-[300px] items-center justify-center p-4">
    <div className="rounded-2xl bg-red-50 px-6 py-6 text-center text-red-600 border border-red-200 max-w-md w-full">
      <div className="text-5xl mb-3">⚠️</div>
      <p className="font-semibold">{message || "Failed to load dashboard"}</p>
      <button
        onClick={onRetry}
        className="mt-3 w-full sm:w-auto rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  </div>
);

// ========== MERCHANT HEADER (PERFECT TEXT DISPLAY FIX) ==========
const MerchantHeader = ({ shopName }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="mb-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-5 sm:p-6 text-white shadow-xl"
  >
    {/* Stack on Mobile, Horizontal on Desktop */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: Icon & Text (Flex-row inside so text doesn't split into vertical letters!) */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="rounded-2xl bg-white/20 p-3 sm:p-4 flex-shrink-0">
          <HiOutlineBuildingStorefront size={24} className="text-white" />
        </div>

        {/* Remove break-words! Use whitespace-normal so words wrap naturally */}
        <div className="min-w-0 whitespace-normal">
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {shopName || "Pizza Hut"}
          </h1>
          <p className="text-xs sm:text-sm text-violet-200 mt-0.5">
            Welcome to the Smaze Portal
          </p>
        </div>
      </div>

      {/* Right: Badges */}
      <div className="flex items-center gap-2 sm:flex-shrink-0">
        <span className="hidden sm:inline-flex items-center rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
          🏪 Merchant
        </span>
        <span className="inline-flex items-center rounded-full bg-emerald-400/30 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
          Active
        </span>
      </div>
    </div>
  </motion.div>
);

// ========== STAT CARD (PERFECT TITLE DISPLAY FIX) ==========
const StatCard = ({ title, value, icon: Icon, color, growth }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/30 p-4 sm:p-5 transition-all hover:shadow-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
    <div className="relative flex items-start justify-between">
      <div className="flex-1 min-w-0">
        {/* Removed truncate so title is always fully visible! */}
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div
        className={`rounded-xl ${color} p-2.5 text-white shadow-lg flex-shrink-0`}
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
  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
    <Link
      to={path}
      className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/30 p-4 transition-all hover:shadow-2xl"
    >
      <div className="rounded-xl bg-violet-50 p-3 text-violet-600 flex-shrink-0">
        <Icon size={22} />
      </div>
      <span className="font-medium text-slate-700 text-sm sm:text-base flex-1 truncate">
        {title}
      </span>
      <HiOutlineChevronRight
        className="text-slate-400 flex-shrink-0"
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
          navigate("/shop/create-shop", { replace: true });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (pending) {
    return <PendingApproval message={error} />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

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
    },
    {
      title: "Active Offers",
      value: activeOffersCount,
      icon: HiOutlinePlusCircle,
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      title: "Total Views",
      value: dashboardData?.stats?.totalViews || 0,
      icon: HiOutlineEye,
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
    {
      title: "Saved Offers",
      value: dashboardData?.stats?.savedOffers || 0,
      icon: HiOutlineHeart,
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Merchant Header */}
        <MerchantHeader shopName={dashboardData?.shop?.name || "Pizza Hut"} />

        {/* Stats: Always fit properly - 1 col on tiny screens, 2 col on mobile, 4 on desktop */}
        <div className="mb-6 grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-slate-800">
            Quick Actions
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map((action) => (
              <QuickAction key={action.title} {...action} />
            ))}
          </div>
        </motion.div>

        {/* Recent Offers */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
          <div className="relative flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-4 sm:py-5">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                Recent Offers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 truncate">
                Track your latest promotions
              </p>
            </div>
            <Link
              to="/shop/my-offers"
              className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700 flex-shrink-0"
            >
              View All <HiOutlineChevronRight size={16} />
            </Link>
          </div>
          <div className="relative divide-y divide-slate-100">
            {recentOffers.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center px-6">
                <HiOutlineClipboardDocumentList
                  size={48}
                  className="text-slate-300"
                />
                <p className="mt-3 font-medium text-slate-500">
                  No offers created yet
                </p>
                <p className="text-sm text-slate-400">
                  Start by adding your first offer
                </p>
                <Link
                  to="/shop/add-offer"
                  className="mt-4 w-full sm:w-auto rounded-xl bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700"
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
                    className="flex items-center justify-between px-5 sm:px-6 py-4 transition hover:bg-violet-50/50"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <h3 className="font-semibold text-slate-800 truncate text-sm sm:text-base">
                        {offer.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">
                        {offer.category?.name || "Uncategorized"} • {savedCount}{" "}
                        saved
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0 ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      ></span>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Account & Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/30 p-4 sm:p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
            <div className="relative flex items-center gap-3">
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600 flex-shrink-0">
                <HiOutlineUser size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-slate-800 truncate">Account</h4>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Manage profile
                </p>
              </div>
              <Link
                to="/shop/profile"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 flex-shrink-0"
              >
                Manage
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/30 p-4 sm:p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
            <div className="relative flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3 text-slate-600 flex-shrink-0">
                <HiOutlineCog6Tooth size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-slate-800 truncate">
                  Settings
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Preferences
                </p>
              </div>
              <Link
                to="/shop/settings"
                className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 flex-shrink-0"
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
