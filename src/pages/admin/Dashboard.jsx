import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  Store,
  Users,
  Tag,
  TrendingUp,
  ArrowUpRight,
  LayoutGrid,
  BarChart3,
  Clock,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getDashboardStats,
  getTopCategories,
  getMonthlyGrowth,
  getRecentActivity,
} from "../../services/adminService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    <div className="rounded-[35px] bg-gradient-to-r from-violet-600 to-purple-600 p-10 h-64 animate-pulse"></div>
    <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white/70 p-7 shadow-xl h-40 animate-pulse"
        ></div>
      ))}
    </div>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white p-7 shadow-lg h-36 animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

// ========== STAT CARD ==========
const StatCard = ({ title, value, icon: Icon, color, growth, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-lg transition-all duration-300 hover:shadow-2xl"
  >
    <div
      className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${color} opacity-10 blur-2xl`}
    ></div>
    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h2 className="mt-2 text-4xl font-black text-slate-800">{value}</h2>
        {growth && (
          <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-emerald-600">
            <ArrowUpRight size={16} />
            {growth}
          </div>
        )}
      </div>
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-transform group-hover:scale-110`}
      >
        <Icon size={28} />
      </div>
    </div>
    <div
      className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${color} transition-all duration-500 group-hover:w-full`}
    ></div>
  </motion.div>
);

// ========== QUICK ACTION CARD ==========
const QuickAction = ({
  title,
  description,
  path,
  icon: Icon,
  color,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -6, scale: 1.03 }}
    className="h-full"
  >
    <Link
      to={path}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl ${color} p-6 text-white shadow-lg transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="relative flex flex-col items-start">
        <div className="rounded-xl bg-white/20 p-3 transition-all group-hover:scale-110 group-hover:bg-white/30">
          <Icon size={24} />
        </div>
        <h3 className="mt-4 text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm opacity-80">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium opacity-0 transition-all group-hover:opacity-100">
          <span>Get Started</span>
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 h-20 w-20 translate-y-4 translate-x-4 rounded-full bg-white/5 blur-xl"></div>
    </Link>
  </motion.div>
);

// ========== CUSTOM TOOLTIP ==========
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm text-slate-600">
            {item.name}: <span className="font-bold">{item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ========== MAIN COMPONENT ==========
const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalOffers: 0,
    totalCategories: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsRes, growthRes, categoriesRes, activityRes] =
          await Promise.all([
            getDashboardStats(),
            getMonthlyGrowth(),
            getTopCategories(),
            getRecentActivity(),
          ]);

        // Set Dashboard Stats
        setDashboard(statsRes.dashboard || {});

        // Set Monthly Growth Data
        const growthData = growthRes.data || growthRes || [];
        setMonthlyData(
          growthData.map((item) => ({
            month: item.month || item._id?.month || "",
            users: Number(item.count || item.users || 0),
          })),
        );

        // Set Top Categories
        const categories = categoriesRes.data || categoriesRes || [];
        setTopCategories(
          categories.map((cat) => ({
            name: cat.name || cat.category?.name || "",
            count: Number(cat.count || cat._count?.offers || 0),
            icon: cat.icon || "📦",
          })),
        );

        // Set Recent Activities
        const activities = activityRes.data || activityRes || [];
        setRecentActivities(
          activities.slice(0, 5).map((item) => ({
            title: item.message || item.title || "Activity",
            time: item.timestamp
              ? new Date(item.timestamp).toLocaleDateString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now",
            color:
              item.type === "user"
                ? "bg-blue-500"
                : item.type === "shop"
                  ? "bg-violet-500"
                  : item.type === "offer"
                    ? "bg-emerald-500"
                    : "bg-amber-500",
            icon:
              item.type === "user"
                ? Users
                : item.type === "shop"
                  ? Store
                  : item.type === "offer"
                    ? Tag
                    : LayoutGrid,
          })),
        );
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error(
          error.response?.data?.message || "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statsData = [
    {
      id: "users",
      title: "Total Users",
      valueKey: "totalUsers",
      icon: Users,
      color: "from-violet-500 to-purple-600",
    },
    {
      id: "shops",
      title: "Total Shops",
      valueKey: "totalShops",
      icon: Store,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "offers",
      title: "Total Offers",
      valueKey: "totalOffers",
      icon: Tag,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: "categories",
      title: "Categories",
      valueKey: "totalCategories",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  const quickActions = [
    {
      title: "Add Shop",
      description: "Register a new shop",
      path: "/admin/shops/add",
      icon: Store,
      color: "bg-gradient-to-br from-violet-600 to-purple-600",
    },
    {
      title: "Add Offer",
      description: "Publish new offers",
      path: "/admin/offers/add",
      icon: Tag,
      color: "bg-gradient-to-br from-blue-600 to-indigo-600",
    },
    {
      title: "Manage Categories",
      description: "Create & edit categories",
      path: "/admin/categories",
      icon: LayoutGrid,
      color: "bg-gradient-to-br from-emerald-600 to-teal-600",
    },
    {
      title: "View Reports",
      description: "Analytics & insights",
      path: "/admin/reports",
      icon: BarChart3,
      color: "bg-gradient-to-br from-orange-600 to-red-600",
    },
  ];

  const healthMetrics = [
    { title: "Users", value: 90, color: "bg-violet-600" },
    { title: "Shops", value: 82, color: "bg-blue-600" },
    { title: "Offers", value: 74, color: "bg-emerald-600" },
    { title: "Categories", value: 95, color: "bg-amber-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== HERO SECTION ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-[35px] bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-10 text-white shadow-2xl"
        >
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Sparkles size={16} />
                SMAZE ADMIN PANEL
              </div>
              <h1 className="mt-4 text-5xl font-black">Welcome Back 👋</h1>
              <p className="mt-3 max-w-xl text-lg text-violet-100">
                Monitor customers, shop owners, offers and categories from one
                beautiful dashboard.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-violet-200">
                <Activity size={16} />
                <span>All systems operational</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Users", value: dashboard.totalUsers || 0 },
                { label: "Shops", value: dashboard.totalShops || 0 },
                { label: "Offers", value: dashboard.totalOffers || 0 },
                { label: "Categories", value: dashboard.totalCategories || 0 },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-white/15 p-5 backdrop-blur-xl transition hover:bg-white/25"
                >
                  <p className="text-sm text-violet-200">{item.label}</p>
                  <h2 className="mt-1 text-3xl font-bold">{item.value}</h2>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ========== STATISTICS ========== */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={dashboard[stat.valueKey] || 0}
              icon={stat.icon}
              color={stat.color}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* ========== QUICK ACTIONS ========== */}
        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Quick Actions
              </h2>
              <p className="text-sm text-slate-500">Common admin tasks</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Zap size={16} />
              <span>4 Actions</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action, i) => (
              <QuickAction key={action.title} {...action} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* ========== ANALYTICS & ACTIVITY ========== */}
        <div className="mt-10 grid gap-8 xl:grid-cols-3">
          {/* Monthly Growth Chart */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2 rounded-[30px] bg-white p-8 shadow-xl border border-slate-200/50"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Monthly Growth
                </h2>
                <p className="text-sm text-slate-500">
                  User registrations over last 6 months
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                <BarChart3 size={16} />
                Live Analytics
              </div>
            </div>

            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="New Users"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[320px] items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No growth data available</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-[30px] bg-white p-8 shadow-xl border border-slate-200/50"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Recent Activity
                </h2>
                <p className="text-sm text-slate-500">
                  Latest platform updates
                </p>
              </div>
              <Clock size={20} className="text-slate-400" />
            </div>

            {recentActivities.length > 0 ? (
              <div className="space-y-5">
                {recentActivities.map((item, i) => (
                  <motion.div
                    key={item.title + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-start gap-4 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <div
                      className={`mt-0.5 rounded-full ${item.color} p-2 text-white`}
                    >
                      <item.icon size={14} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-slate-400">
                <div className="text-center">
                  <Activity size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No recent activity</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ========== PLATFORM HEALTH & TOP CATEGORIES ========== */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Platform Health */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-[30px] bg-white p-8 shadow-xl border border-slate-200/50"
          >
            <h2 className="text-2xl font-bold text-slate-800">
              Platform Health
            </h2>
            <p className="text-sm text-slate-500">Key metrics overview</p>

            <div className="mt-6 space-y-5">
              {healthMetrics.map((item) => (
                <div key={item.title}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {item.title}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className={`${item.color} h-full rounded-full transition-all`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Categories */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-[30px] bg-white p-8 shadow-xl border border-slate-200/50"
          >
            <h2 className="text-2xl font-bold text-slate-800">
              Top Categories
            </h2>
            <p className="text-sm text-slate-500">Most popular categories</p>

            {topCategories.length > 0 ? (
              <div className="mt-6 space-y-3">
                {topCategories.map((category, i) => (
                  <motion.div
                    key={category.name + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="group flex items-center justify-between rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon || "📦"}</span>
                      <span className="font-medium text-slate-700">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-600">
                        {category.count}
                      </span>
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                        {i === 0 ? "Top" : "Popular"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-slate-400">
                <div className="text-center">
                  <LayoutGrid size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No categories data</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
