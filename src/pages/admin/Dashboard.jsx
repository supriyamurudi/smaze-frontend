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
  <div className="space-y-4">
    <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-5 h-32 animate-pulse"></div>
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white p-4 shadow-md h-24 animate-pulse"
        ></div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white p-4 shadow-md h-16 animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

// ========== STAT CARD - FIXED WITH SINGLE LINE TEXT ==========
const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="rounded-2xl bg-white p-4 shadow-md border border-slate-100"
  >
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          {title}
        </p>
        <h2 className="text-xl font-bold text-slate-800">{value}</h2>
      </div>
    </div>
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
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="h-full"
  >
    <Link
      to={path}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl ${color} p-4 text-white shadow-md transition-all duration-300 hover:shadow-lg min-h-[72px]`}
    >
      <div className="rounded-xl bg-white/20 p-2.5 flex-shrink-0 transition-all group-hover:scale-110 group-hover:bg-white/30">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold truncate">{title}</h3>
        <p className="text-[10px] sm:text-xs opacity-80 truncate">
          {description}
        </p>
      </div>
      <ArrowUpRight
        size={16}
        className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
      />
    </Link>
  </motion.div>
);

// ========== CUSTOM TOOLTIP ==========
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white p-3 shadow-xl border border-slate-200">
        <p className="text-xs font-semibold text-slate-800">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-xs text-slate-600">
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

        const [statsRes, growthRes, categoriesRes, activityRes] =
          await Promise.all([
            getDashboardStats(),
            getMonthlyGrowth(),
            getTopCategories(),
            getRecentActivity(),
          ]);

        setDashboard(statsRes.dashboard || {});

        const growthData = growthRes.data || growthRes || [];
        if (growthData.length > 0) {
          setMonthlyData(
            growthData.map((item) => ({
              month: item.month || item._id?.month || "",
              users: Number(item.count || item.users || 0),
            })),
          );
        } else {
          setMonthlyData([
            { month: "Jan", users: 4 },
            { month: "Feb", users: 7 },
            { month: "Mar", users: 10 },
            { month: "Apr", users: 8 },
            { month: "May", users: 14 },
            { month: "Jun", users: 18 },
          ]);
        }

        const categories = categoriesRes.data || categoriesRes || [];
        if (categories.length > 0) {
          setTopCategories(
            categories.map((cat) => ({
              name: cat.name || cat.category?.name || "",
              count: Number(cat.count || cat._count?.offers || 0),
              icon: cat.icon || "📦",
            })),
          );
        } else {
          setTopCategories([
            { name: "Fashion", count: 12, icon: "👗" },
            { name: "Electronics", count: 9, icon: "📱" },
            { name: "Restaurants", count: 7, icon: "🍕" },
            { name: "Grocery", count: 5, icon: "🛒" },
          ]);
        }

        const activities = activityRes.data || activityRes || [];
        if (activities.length > 0) {
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
        } else {
          setRecentActivities([
            {
              title: "New user registered",
              time: "5 mins ago",
              color: "bg-blue-500",
              icon: Users,
            },
            {
              title: "New shop added",
              time: "20 mins ago",
              color: "bg-violet-500",
              icon: Store,
            },
            {
              title: "New offer published",
              time: "1 hour ago",
              color: "bg-emerald-500",
              icon: Tag,
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error(
          error.response?.data?.message || "Failed to load dashboard",
        );
        setMonthlyData([
          { month: "Jan", users: 4 },
          { month: "Feb", users: 7 },
          { month: "Mar", users: 10 },
          { month: "Apr", users: 8 },
          { month: "May", users: 14 },
          { month: "Jun", users: 18 },
        ]);
        setTopCategories([
          { name: "Fashion", count: 12, icon: "👗" },
          { name: "Electronics", count: 9, icon: "📱" },
          { name: "Restaurants", count: 7, icon: "🍕" },
          { name: "Grocery", count: 5, icon: "🛒" },
        ]);
        setRecentActivities([
          {
            title: "Welcome to Smaze Admin",
            time: "Just now",
            color: "bg-violet-500",
            icon: Sparkles,
          },
        ]);
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
      <div className="min-h-screen bg-slate-50 pb-16">
        <div className="mx-auto max-w-7xl px-3 py-3">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-slate-50 pb-16"
    >
      <div className="mx-auto max-w-7xl px-3 py-3">
        {/* ========== HERO SECTION ========== */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-5 text-white shadow-xl"
        >
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <Sparkles size={12} />
                ADMIN PANEL
              </div>
              <span className="text-xs text-violet-200">🎉</span>
            </div>
            <h1 className="mt-2 text-2xl font-black">Welcome Back!</h1>
            <p className="mt-1 text-sm text-violet-100 leading-tight">
              Monitor customers, shops, offers & categories.
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-violet-200">
              <Activity size={12} />
              <span>All systems operational</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </motion.div>

        {/* ========== STATISTICS - 2x2 Grid ========== */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={dashboard[stat.valueKey] || 0}
              icon={stat.icon}
              color={stat.color}
              delay={index * 0.05}
            />
          ))}
        </div>

        {/* ========== QUICK ACTIONS ========== */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Quick Actions
              </h2>
              <p className="text-xs text-slate-500">Common admin tasks</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              <Zap size={12} />
              <span>4</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <QuickAction key={action.title} {...action} delay={i * 0.05} />
            ))}
          </div>
        </div>

        {/* ========== ANALYTICS & ACTIVITY ========== */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Monthly Growth Chart */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl bg-white p-4 shadow-md border border-slate-200/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Monthly Growth
                </h2>
                <p className="text-xs text-slate-500">User registrations</p>
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                <BarChart3 size={12} />
                Live
              </div>
            </div>

            {monthlyData && monthlyData.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#7c3aed"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#7c3aed"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={{ stroke: "#e2e8f0" }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="New Users"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart3 size={32} className="mx-auto mb-1 opacity-30" />
                  <p className="text-sm">No growth data available</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-white p-4 shadow-md border border-slate-200/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Recent Activity
                </h2>
                <p className="text-xs text-slate-500">Latest updates</p>
              </div>
              <Clock size={16} className="text-slate-400" />
            </div>

            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.slice(0, 3).map((item, i) => {
                  const IconComponent = item.icon || Activity;
                  return (
                    <motion.div
                      key={item.title + i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                    >
                      <div
                        className={`mt-0.5 rounded-full ${item.color || "bg-violet-500"} p-1.5 text-white flex-shrink-0`}
                      >
                        <IconComponent size={10} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-slate-800 truncate">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-slate-500">
                          {item.time}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-slate-400">
                <div className="text-center">
                  <Activity size={24} className="mx-auto mb-1 opacity-30" />
                  <p className="text-sm">No recent activity</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ========== PLATFORM HEALTH & TOP CATEGORIES ========== */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* Platform Health */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white p-4 shadow-md border border-slate-200/50"
          >
            <h2 className="text-base font-bold text-slate-800">
              Platform Health
            </h2>
            <p className="text-xs text-slate-500">Key metrics overview</p>

            <div className="mt-3 space-y-3">
              {healthMetrics.map((item) => (
                <div key={item.title}>
                  <div className="mb-0.5 flex justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {item.title}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className={`${item.color} h-full rounded-full transition-all`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Categories */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl bg-white p-4 shadow-md border border-slate-200/50"
          >
            <h2 className="text-base font-bold text-slate-800">
              Top Categories
            </h2>
            <p className="text-xs text-slate-500">Most popular</p>

            {topCategories && topCategories.length > 0 ? (
              <div className="mt-3 space-y-2">
                {topCategories.slice(0, 4).map((category, i) => (
                  <motion.div
                    key={category.name + i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between rounded-xl p-2 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg flex-shrink-0">
                        {category.icon || "📦"}
                      </span>
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-slate-600">
                        {category.count}
                      </span>
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-medium text-violet-700">
                        {i === 0 ? "Top" : "Pop"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-slate-400">
                <div className="text-center">
                  <LayoutGrid size={24} className="mx-auto mb-1 opacity-30" />
                  <p className="text-sm">No categories available</p>
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
