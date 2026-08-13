import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineTag,
  HiOutlineArrowPath,
  HiOutlineArrowDownTray,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineXCircle,
  HiOutlineShoppingBag,
} from "react-icons/hi2";

import { getReports } from "../../services/adminService";

const COLORS = [
  "#7C3AED",
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="h-12 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-3 h-10 w-16 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-14 w-14 bg-slate-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>

    <div className="grid gap-8 xl:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-6"></div>
          <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>

    <div className="rounded-3xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ========== STATS CARD ==========
const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-violet-200"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div
        className={`rounded-2xl bg-${color}-100 p-3 text-${color}-700 transition group-hover:scale-110 group-hover:shadow-lg`}
      >
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

// ========== CUSTOM TOOLTIP ==========
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm text-slate-600">
            {item.name}: <span className="font-semibold">{item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ========== MAIN COMPONENT ==========
export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // ========== FETCH REPORTS ==========
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReports();

      console.log("📦 Reports response:", response);

      // Handle different response structures
      const data = response.data || response || {};

      // Ensure stats exist with fallbacks
      const stats = data.stats || {};
      const monthlyData = data.monthlyData || data.monthlyOffers || [];
      const categoryData = data.categoryData || data.categoryDistribution || [];
      const reports = data.reports || [];

      setReport({
        totalUsers: Number(stats.totalUsers) || 0,
        totalShops: Number(stats.totalShops) || 0,
        totalOffers: Number(stats.totalOffers) || 0,
        totalCategories: Number(stats.totalCategories) || 0,
        monthlyData: monthlyData,
        categoryData: categoryData,
        reports: reports,
      });

      // Show info message if no data
      if (monthlyData.length === 0 && categoryData.length === 0) {
        toast.info(
          "No report data available yet. Start adding shops and offers!",
        );
      }
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      setError(error.response?.data?.message || "Failed to load reports");
      toast.error(error.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
  }, []);

  // ========== HANDLERS ==========
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReports();
    setIsRefreshing(false);
    toast.success("Reports refreshed!");
  };

  // ========== EXPORT REPORT ==========
  const handleExport = () => {
    try {
      setIsExporting(true);

      // Prepare data for export
      const exportData = [];

      // Add summary stats
      exportData.push({
        Type: "SUMMARY",
        Metric: "Total Users",
        Value: report?.totalUsers || 0,
      });
      exportData.push({
        Type: "SUMMARY",
        Metric: "Total Shops",
        Value: report?.totalShops || 0,
      });
      exportData.push({
        Type: "SUMMARY",
        Metric: "Total Offers",
        Value: report?.totalOffers || 0,
      });
      exportData.push({
        Type: "SUMMARY",
        Metric: "Total Categories",
        Value: report?.totalCategories || 0,
      });

      // Add monthly data
      const monthlyData = report?.monthlyData || [];
      monthlyData.forEach((item) => {
        exportData.push({
          Type: "MONTHLY",
          Month: item.month || "Unknown",
          Offers: item.offers || 0,
          Users: item.users || 0,
          Growth: item.growth || "0%",
          Status: item.status || "Active",
        });
      });

      // If no monthly data, add a placeholder
      if (monthlyData.length === 0) {
        exportData.push({
          Type: "MONTHLY",
          Month: "No Data Available",
          Offers: 0,
          Users: 0,
          Growth: "0%",
          Status: "N/A",
        });
      }

      // Add category distribution
      const categoryData = report?.categoryData || [];
      categoryData.forEach((item) => {
        exportData.push({
          Type: "CATEGORY",
          Category: item.name || "Unknown",
          Count: item.value || 0,
        });
      });

      if (categoryData.length === 0) {
        exportData.push({
          Type: "CATEGORY",
          Category: "No Data Available",
          Count: 0,
        });
      }

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Type
        { wch: 25 }, // Metric/Category/Month
        { wch: 15 }, // Value/Count/Offers
        { wch: 15 }, // Additional fields
        { wch: 15 },
        { wch: 15 },
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Report");

      // Generate filename with date
      const date = new Date().toISOString().slice(0, 10);
      const filename = `Smaze_Report_${date}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      toast.success(`Report exported successfully as ${filename}! 🎉`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  // ========== DATA PROCESSING ==========
  const stats = [
    {
      title: "Total Users",
      value: report?.totalUsers?.toLocaleString() || 0,
      icon: HiOutlineUsers,
      color: "violet",
      subtitle: "Registered users",
    },
    {
      title: "Total Shops",
      value: report?.totalShops?.toLocaleString() || 0,
      icon: HiOutlineBuildingStorefront,
      color: "blue",
      subtitle: "Active shops",
    },
    {
      title: "Total Offers",
      value: report?.totalOffers?.toLocaleString() || 0,
      icon: HiOutlineShoppingBag,
      color: "emerald",
      subtitle: "Published offers",
    },
    {
      title: "Categories",
      value: report?.totalCategories?.toLocaleString() || 0,
      icon: HiOutlineTag,
      color: "amber",
      subtitle: "Total categories",
    },
  ];

  const monthlyData = report?.monthlyData || [];
  const categoryData = report?.categoryData || [];
  const reportsData = report?.reports || [];

  // Calculate total offers from monthly data for summary
  const totalMonthlyOffers = monthlyData.reduce(
    (sum, item) => sum + Number(item.offers || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <HiOutlineXCircle size={32} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-rose-800">
              Failed to Load Reports
            </h2>
            <p className="mt-2 text-rose-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              <HiOutlineArrowPath className="text-lg" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
              <HiOutlineChartBar className="text-lg" />
              Reports & Analytics
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Reports & Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor platform performance and business insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <HiOutlineArrowPath
                className={`text-lg ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-200 transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <HiOutlineArrowDownTray className="text-lg" />
                  Export Report
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* ========== STATS CARDS ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((item) => (
            <StatsCard key={item.title} {...item} />
          ))}
        </motion.div>

        {/* ========== CHARTS ========== */}
        <div className="mb-8 grid gap-8 xl:grid-cols-2">
          {/* Monthly Offers - Bar Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-2.5 text-violet-700">
                  <HiOutlineCalendar size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Monthly Offers
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {monthlyData.length} months
              </span>
            </div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="offers"
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#7C3AED"
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-slate-400">
                <HiOutlineChartBar size={48} className="mb-2 text-slate-300" />
                <p>No monthly data available</p>
              </div>
            )}
          </motion.div>

          {/* Category Distribution - Pie Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 p-2.5 text-emerald-700">
                  <HiOutlineChartPie size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Category Distribution
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {categoryData.length} categories
              </span>
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    label={{
                      fill: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {categoryData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                            <p className="text-sm font-semibold text-slate-800">
                              {payload[0].name}
                            </p>
                            <p className="text-sm text-violet-600">
                              {payload[0].value} offers
                            </p>
                            <p className="text-xs text-slate-400">
                              {((payload[0].percent || 0) * 100).toFixed(1)}% of
                              total
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      fontSize: 12,
                      paddingLeft: 20,
                    }}
                    formatter={(value, entry) => {
                      const total = categoryData.reduce(
                        (sum, item) => sum + item.value,
                        0,
                      );
                      const percentage = (
                        (entry.payload.value / total) *
                        100
                      ).toFixed(1);
                      return `${value} (${percentage}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-slate-400">
                <HiOutlineChartPie size={48} className="mb-2 text-slate-300" />
                <p>No category data available</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ========== TABLE ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Monthly Summary
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Detailed platform metrics by month
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 px-4 py-2">
                <span className="text-sm font-medium text-violet-700">
                  {reportsData.length} months
                </span>
              </div>
              <div className="rounded-lg bg-emerald-50 px-4 py-2">
                <span className="text-sm font-medium text-emerald-700">
                  {totalMonthlyOffers} total offers
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Month
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Users
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Offers
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Growth
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportsData.length > 0 ? (
                  reportsData.map((item, index) => (
                    <motion.tr
                      key={item.month || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="transition hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {item.month || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {Number(item.users || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {Number(item.offers || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                            typeof item.growth === "string"
                              ? item.growth.startsWith("+")
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                              : Number(item.growth) > 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {typeof item.growth === "string"
                            ? item.growth
                            : `${Number(item.growth || 0)}%`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : item.status === "inactive"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.status || "Active"}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-12 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <HiOutlineChartBar
                          size={40}
                          className="text-slate-300"
                        />
                        <p>No report data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
