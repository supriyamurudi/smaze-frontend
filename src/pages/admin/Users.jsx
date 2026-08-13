import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
} from "react-icons/hi2";

import UserTable from "../../components/admin/UserTable";
import { getUsers, getDashboardStats } from "../../services/adminService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-slate-200 animate-pulse sm:h-20 sm:w-20"></div>
        <div>
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse sm:h-8 sm:w-48"></div>
          <div className="mt-1 h-4 w-40 bg-slate-200 rounded animate-pulse sm:h-5 sm:w-64"></div>
        </div>
      </div>
      <div className="h-20 w-full rounded-2xl bg-slate-200 animate-pulse sm:h-28 sm:w-56"></div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="h-1.5 bg-slate-200"></div>
          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
                <div className="mt-2 h-8 w-12 bg-slate-200 rounded animate-pulse"></div>
                <div className="mt-1 h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-xl">
      <div className="border-b p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 flex-1 max-w-xs bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <div className="h-5 w-16 bg-slate-200 rounded-full animate-pulse"></div>
              <div className="h-5 w-16 bg-slate-200 rounded-full animate-pulse"></div>
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
const StatCard = ({ title, value, subtitle, icon: Icon, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
  >
    <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            {title}
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900">
            {value}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 truncate">
            {subtitle}
          </p>
        </div>
        <div
          className={`rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} p-3 sm:p-4 text-white shadow-lg transition-transform group-hover:scale-110 flex-shrink-0`}
        >
          <Icon size={20} className="sm:w-7 sm:h-7" />
        </div>
      </div>
    </div>
  </motion.div>
);

// ========== STATS DATA ==========
const statsData = [
  {
    id: "totalUsers",
    title: "Total Users",
    valueKey: "totalUsers",
    subtitle: "All registered accounts",
    gradient: "from-violet-500 to-purple-600",
    icon: HiOutlineUsers,
    delay: 0.1,
  },
  {
    id: "totalCustomers",
    title: "Customers",
    valueKey: "totalCustomers",
    subtitle: "Active customers",
    gradient: "from-emerald-500 to-green-600",
    icon: HiOutlineUserGroup,
    delay: 0.2,
  },
  {
    id: "totalAdmins",
    title: "Admins",
    valueKey: "totalAdmins",
    subtitle: "System administrators",
    gradient: "from-orange-500 to-red-500",
    icon: HiOutlineShieldCheck,
    delay: 0.3,
  },
];

// ========== MAIN COMPONENT ==========
export default function Users() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          getUsers(),
          getDashboardStats(),
        ]);

        if (!ignore) {
          setUsers(usersRes.users || []);
          setStats(statsRes.dashboard || {});
        }
      } catch (error) {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load users");
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

  const refreshUsers = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        getUsers(),
        getDashboardStats(),
      ]);

      setUsers(usersRes.users || []);
      setStats(statsRes.dashboard || {});
    } catch {
      toast.error("Failed to refresh users");
    }
  };

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();
    const matchesSearch =
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value);

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    all: users.length,
    CUSTOMER: users.filter((u) => u.role === "CUSTOMER").length,
    SHOP_OWNER: users.filter((u) => u.role === "SHOP_OWNER").length,
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // Extract stats with fallbacks
  const dashboardStats = {
    totalUsers: stats.totalUsers || 0,
    totalCustomers: stats.totalCustomers || 0,
    totalAdmins: stats.totalAdmins || 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-8 lg:mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-3 sm:p-5 text-white shadow-xl shadow-violet-300">
              <HiOutlineUsers size={24} className="sm:w-9 sm:h-9" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                User Management
              </h1>
              <p className="text-sm sm:text-base text-slate-500">
                Manage customers, shop owners and administrators
              </p>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <HiOutlineSparkles size={24} className="sm:w-8 sm:h-8" />
              <div>
                <p className="text-xs sm:text-sm opacity-80">Total Users</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
                  {stats.totalUsers || 0}
                </h2>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ========== STATS ========== */}
        <div className="mb-6 sm:mb-8 lg:mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statsData.map((stat) => (
            <StatCard
              key={stat.id} // ✅ FIXED: key passed directly
              title={stat.title}
              value={dashboardStats[stat.valueKey] || 0}
              subtitle={stat.subtitle}
              gradient={stat.gradient}
              icon={stat.icon}
              delay={stat.delay}
            />
          ))}
        </div>

        {/* ========== TABLE ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="overflow-hidden rounded-2xl sm:rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-xl"
        >
          {/* Table Header with Search & Filters */}
          <div className="border-b bg-gradient-to-r from-violet-50 to-indigo-50 p-4 sm:p-5 lg:p-7">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-xs">
                <HiOutlineMagnifyingGlass
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-violet-50 hover:ring-violet-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                    />
                  </svg>
                  <span className="hidden xs:inline">Filters</span>
                  <HiOutlineChevronDown
                    size={14}
                    className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  onClick={refreshUsers}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
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
                className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-slate-200"
              >
                {["all", "CUSTOMER", "SHOP_OWNER", "ADMIN"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`text-xs whitespace-nowrap rounded-full px-3 py-1 font-medium transition ${
                      filterRole === role
                        ? "bg-violet-600 text-white shadow-md"
                        : "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    {role === "all" ? "All" : role}
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                        filterRole === role
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {roleCounts[role] || 0}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Table */}
          <div className="p-3 sm:p-4 lg:p-7 overflow-x-auto">
            <UserTable users={filteredUsers} onRefresh={refreshUsers} />
          </div>

          {/* Table Footer */}
          <div className="border-t bg-slate-50/50 px-4 sm:px-6 lg:px-7 py-3 sm:py-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {users.length}
                </span>{" "}
                users
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
