import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineBuildingStorefront,
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi2";

import ShopTable from "../../components/admin/ShopTable";
import {
  getShops,
  getShopStats,
  getCategories,
} from "../../services/adminService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-slate-200 animate-pulse"></div>
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-1 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-2 h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse"></div>
          </div>
          <div className="mt-3 h-6 w-24 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse"></div>
            <div className="mt-1 h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-12 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="h-12 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="h-12 w-20 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse"></div>
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="ml-auto flex gap-2">
                <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ========== STAT CARD ==========
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  badge,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h2 className="mt-2 text-4xl font-black text-slate-900">{value}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div
        className={`rounded-xl bg-gradient-to-br ${color} p-3 text-white shadow-lg transition-transform group-hover:scale-110`}
      >
        <Icon size={22} />
      </div>
    </div>
    {badge && (
      <div className="mt-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}
        >
          {badge.text}
        </span>
      </div>
    )}
  </motion.div>
);

// ========== MAIN COMPONENT ==========
export default function Shops() {
  const [shops, setShops] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const [shopsRes, statsRes, categoriesRes] = await Promise.all([
          getShops(),
          getShopStats(),
          getCategories(),
        ]);

        if (!ignore) {
          setShops(shopsRes.shops || []);
          // ✅ FIXED: Access the nested data correctly
          setStats(statsRes.data || {});
          setCategories(categoriesRes.categories || []);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load shops");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshShops = async () => {
    try {
      const [shopsRes, statsRes] = await Promise.all([
        getShops(),
        getShopStats(),
      ]);

      setShops(shopsRes.shops || []);
      setStats(statsRes.data || {});
    } catch {
      toast.error("Failed to refresh shops");
    }
  };

  const filteredShops = shops.filter((shop) => {
    const value = search.toLowerCase();
    const matchesSearch =
      shop.name?.toLowerCase().includes(value) ||
      shop.address?.toLowerCase().includes(value) ||
      shop.owner?.name?.toLowerCase().includes(value) ||
      shop.category?.name?.toLowerCase().includes(value);

    const matchesStatus =
      filterStatus === "all" || shop.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || shop.category?.name === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = {
    all: shops.length,
    active: shops.filter((s) => s.status === "active").length,
    pending: shops.filter((s) => s.status === "pending").length,
    inactive: shops.filter((s) => s.status === "inactive").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // ✅ FIXED: Extract stats from the nested data
  const statsData = {
    totalShops: stats.total || 0,
    activeShops: stats.active || 0,
    pendingShops: stats.pending || 0,
    shopOwners: stats.shopOwners || 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 p-4 text-white shadow-xl shadow-violet-300">
              <HiOutlineBuildingStorefront size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Shop Management
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage and monitor all registered shops on the platform
              </p>
            </div>
          </div>

          <Link to="/admin/shops/add">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:shadow-xl"
            >
              <HiOutlinePlus size={18} />
              Add Shop
            </motion.button>
          </Link>
        </motion.div>

        {/* ========== STATISTICS ========== */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Shops"
            value={statsData.totalShops}
            icon={HiOutlineBuildingStorefront}
            color="from-violet-500 to-purple-500"
            badge={{
              text: `+${stats.monthlyGrowth || 0} this month`,
              className: "bg-emerald-100 text-emerald-700",
            }}
            delay={0.1}
          />
          <StatCard
            title="Active Shops"
            value={statsData.activeShops}
            icon={HiOutlineCheckCircle}
            color="from-emerald-500 to-teal-500"
            badge={{
              text: `${stats.activePercentage || 0}% Active`,
              className: "bg-violet-100 text-violet-700",
            }}
            delay={0.2}
          />
          <StatCard
            title="Pending Approval"
            value={statsData.pendingShops}
            icon={HiOutlineClock}
            color="from-amber-500 to-orange-500"
            badge={{
              text: "Needs Review",
              className: "bg-yellow-100 text-yellow-700",
            }}
            delay={0.3}
          />
          <StatCard
            title="Shop Owners"
            value={statsData.shopOwners}
            icon={HiOutlineUsers}
            color="from-blue-500 to-indigo-500"
            subtitle="Registered shop owners"
            delay={0.4}
          />
        </div>

        {/* ========== SHOP LIST ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Top */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registered Shops
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, edit and manage shop information
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px] sm:w-64">
                  <HiOutlineMagnifyingGlass
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search shops..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-violet-50 hover:ring-violet-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentObject"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  <span className="hidden xs:inline">Filter</span>
                  <HiOutlineChevronDown
                    size={14}
                    className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  onClick={refreshShops}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                >
                  <span className="hidden xs:inline">Refresh</span>
                  <span className="inline xs:hidden">🔄</span>
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 space-y-3 pt-3 border-t border-slate-200"
              >
                {/* Status Filter */}
                <div className="flex flex-wrap gap-1.5">
                  {["all", "active", "pending", "inactive"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`text-xs whitespace-nowrap rounded-full px-3 py-1 font-medium transition ${
                        filterStatus === status
                          ? "bg-violet-600 text-white shadow-md"
                          : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                      }`}
                    >
                      {status === "all"
                        ? "All"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                      <span
                        className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${filterStatus === status ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                      >
                        {statusCounts[status] || 0}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs text-slate-400 mr-1">
                      Category:
                    </span>
                    <button
                      onClick={() => setFilterCategory("all")}
                      className={`text-xs whitespace-nowrap rounded-full px-3 py-1 font-medium transition ${
                        filterCategory === "all"
                          ? "bg-violet-600 text-white shadow-md"
                          : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.name)}
                        className={`text-xs whitespace-nowrap rounded-full px-3 py-1 font-medium transition ${
                          filterCategory === cat.name
                            ? "bg-violet-600 text-white shadow-md"
                            : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-3 sm:p-4 lg:p-6">
            <ShopTable shops={filteredShops} onRefresh={refreshShops} />
          </div>

          {/* Footer */}
          <div className="border-t bg-slate-50/50 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredShops.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {shops.length}
                </span>{" "}
                shops
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
