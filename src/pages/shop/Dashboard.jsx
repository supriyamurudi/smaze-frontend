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
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-6 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="mt-4 md:mt-0 h-10 w-40 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="h-14 w-14 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="mt-5 h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-1 h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-slate-200 rounded-xl animate-pulse"
        ></div>
      ))}
    </div>
    <div className="rounded-2xl bg-white border shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-1 h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-5">
            <div>
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-1 h-4 w-40 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
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
    className="flex min-h-[400px] items-center justify-center"
  >
    <div className="rounded-2xl bg-amber-50 px-8 py-6 text-center border border-amber-200 max-w-md">
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
        className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition"
      >
        Check Status
      </button>
    </div>
  </motion.div>
);

// ========== ERROR COMPONENT ==========
const ErrorState = ({ message, onRetry }) => (
  <div className="flex min-h-[300px] items-center justify-center">
    <div className="rounded-2xl bg-red-50 px-8 py-6 text-center text-red-600 border border-red-200 max-w-md">
      <div className="text-5xl mb-3">⚠️</div>
      <p className="font-semibold">{message || "Failed to load dashboard"}</p>
      <button
        onClick={onRetry}
        className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  </div>
);

// ========== MERCHANT HEADER ==========
const MerchantHeader = ({ shopName }) => (
  <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="mb-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-8 text-white shadow-xl"
  >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/20 p-4">
          <HiOutlineBuildingStorefront size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black">{shopName || "Pizza Hut"}</h1>
          <p className="text-violet-200">
            Welcome to the Smaze Merchant Portal
          </p>
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex items-center gap-3">
        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          🏪 Merchant
        </span>
        <span className="rounded-full bg-emerald-400/30 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
          ● Active
        </span>
      </div>
    </div>
  </motion.div>
);

// ========== STAT CARD ==========
const StatCard = ({ title, value, icon: Icon, color, growth }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm transition-all hover:shadow-xl"
  >
    <div className="flex items-start justify-between">
      <div className={`rounded-xl ${color} p-3`}>
        <Icon size={24} className="text-white" />
      </div>
      {growth && (
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <HiOutlineArrowTrendingUp size={14} />
          {growth}
        </span>
      )}
    </div>
    <p className="mt-5 text-sm text-slate-500">{title}</p>
    <h2 className="mt-1 text-3xl font-black text-slate-800">{value}</h2>
  </motion.div>
);

// ========== QUICK ACTION ==========
const QuickAction = ({ title, path, icon: Icon }) => (
  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
    <Link
      to={path}
      className="flex items-center gap-4 rounded-xl bg-white border border-slate-200 p-4 shadow-sm transition-all hover:shadow-md hover:border-violet-300"
    >
      <div className="rounded-lg bg-violet-50 p-2.5 text-violet-600">
        <Icon size={22} />
      </div>
      <span className="font-medium text-slate-700">{title}</span>
      <HiOutlineChevronRight className="ml-auto text-slate-400" size={18} />
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

        // ✅ Handle 403 - Shop pending/rejected
        if (error.response?.status === 403) {
          setPending(true);
          setError(
            error.response?.data?.message || "Your shop is pending approval",
          );
        }
        // ✅ Handle 404 - No shop found
        else if (error.response?.status === 404) {
          toast.error("Shop not found. Please create a shop first.");
          navigate("/shop/create-shop", { replace: true });
        }
        // ✅ Handle other errors
        else {
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

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // ✅ Show pending approval state
  if (pending) {
    return <PendingApproval message={error} />;
  }

  // ✅ Show error state
  if (error) {
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  }

  // ✅ No data - show error
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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Merchant Header */}
        <MerchantHeader shopName={dashboardData?.shop?.name || "Pizza Hut"} />

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
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
          className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Offers
              </h2>
              <p className="text-sm text-slate-500">
                Track your latest promotions
              </p>
            </div>
            <Link
              to="/shop/my-offers"
              className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              View All <HiOutlineChevronRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOffers.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
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
                  className="mt-4 rounded-xl bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700"
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
                    className="flex items-center justify-between px-6 py-5 transition hover:bg-violet-50/50"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {offer.category?.name || "Uncategorized"} • {savedCount}{" "}
                        saved
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
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
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 p-2.5 text-violet-600">
                <HiOutlineUser size={22} />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Account</h4>
                <p className="text-sm text-slate-500">Manage profile</p>
              </div>
              <Link
                to="/shop/profile"
                className="ml-auto rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                Manage
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                <HiOutlineCog6Tooth size={22} />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Settings</h4>
                <p className="text-sm text-slate-500">Preferences</p>
              </div>
              <Link
                to="/shop/settings"
                className="ml-auto rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
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
