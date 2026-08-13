import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlinePlus,
  HiOutlineTag,
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowPath,
  HiOutlineFolder,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi2";

import { getCategories, deleteCategory } from "../../services/categoryService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 bg-slate-200 rounded-xl animate-pulse"></div>
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-12 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-2 h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>

    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div className="rounded-2xl bg-white shadow-sm">
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ========== STATS CARD ==========
const StatsCard = ({ icon: Icon, label, value, color, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div
        className={`rounded-xl ${color.replace("text", "bg").replace("font-bold", "")} bg-opacity-10 p-3`}
      >
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
    </div>
  </motion.div>
);

// ========== CATEGORY TABLE ==========
const CategoryTable = ({ categories, setCategories }) => {
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsDeleting(id);
    try {
      await deleteCategory(id);
      const updatedCategories = categories.filter((cat) => cat.id !== id);
      setCategories(updatedCategories);
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setIsDeleting(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <HiOutlineFolder size={40} className="text-slate-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          No categories found
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Get started by creating your first category
        </p>
        <Link
          to="/admin/categories/add"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          <HiOutlinePlus size={16} />
          Add Category
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Category
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Created
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {categories.map((category) => (
            <motion.tr
              key={category.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group hover:bg-slate-50/50 transition"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700">
                      <HiOutlineTag size={18} />
                    </div>
                  )}
                  <span className="font-medium text-slate-800">
                    {category.name}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                    category.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : category.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {category.status === "active" && (
                    <HiOutlineCheckCircle size={12} />
                  )}
                  {category.status === "pending" && (
                    <HiOutlineClock size={12} />
                  )}
                  {category.status === "inactive" && (
                    <HiOutlineXCircle size={12} />
                  )}
                  {category.status || "Active"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/admin/categories/edit/${category.id}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                    title="Edit Category"
                  >
                    <HiOutlinePencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    disabled={isDeleting === category.id}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    title="Delete Category"
                  >
                    {isDeleting === category.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"></div>
                    ) : (
                      <HiOutlineTrash size={18} />
                    )}
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ========== FETCH CATEGORIES ==========
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategories();

      // Handle different response structures
      const categoriesData =
        response.categories || response.data || response || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message || "Failed to load categories");
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  // ========== FILTER CATEGORIES ==========
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Filter by search query - ✅ Removed slug reference
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((category) =>
        category.name?.toLowerCase().includes(query),
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      const statusLower = filterStatus.toLowerCase();
      filtered = filtered.filter((category) => {
        const categoryStatus = (category.status || "active").toLowerCase();
        return categoryStatus === statusLower;
      });
    }

    console.log(
      "🔍 Filtered categories:",
      filtered.length,
      "Status filter:",
      filterStatus,
    );
    return filtered;
  }, [categories, searchQuery, filterStatus]);

  // ========== HANDLER FUNCTIONS ==========
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCategories();
    setIsRefreshing(false);
    toast.success("Categories refreshed!");
  };

  // Status counts
  const statusCounts = categories.reduce((acc, category) => {
    const status = category.status?.toLowerCase() || "active";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

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
              Failed to Load Categories
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
          className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3 text-violet-700">
              <HiOutlineFolder size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Category Management
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage categories used across Smaze marketplace
              </p>
            </div>
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
            <Link
              to="/admin/categories/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-200 transition hover:shadow-xl"
            >
              <HiOutlinePlus className="text-lg" />
              Add Category
            </Link>
          </div>
        </motion.div>

        {/* ========== STATS CARDS ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatsCard
            icon={HiOutlineFolder}
            label="Total Categories"
            value={categories.length}
            color="text-violet-600"
          />
          <StatsCard
            icon={HiOutlineCheckCircle}
            label="Active"
            value={statusCounts.active || 0}
            color="text-emerald-600"
          />
          <StatsCard
            icon={HiOutlineClock}
            label="Pending"
            value={statusCounts.pending || 0}
            color="text-amber-600"
          />
          <StatsCard
            icon={HiOutlineXCircle}
            label="Inactive"
            value={statusCounts.inactive || 0}
            color="text-rose-600"
          />
        </motion.div>

        {/* ========== SEARCH & FILTER ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiOutlineMagnifyingGlass size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories by name..."
                  className="w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineAdjustmentsHorizontal
                className="text-slate-400"
                size={18}
              />
              <select
                value={filterStatus}
                onChange={(e) => {
                  console.log("📊 Status filter changed to:", e.target.value);
                  setFilterStatus(e.target.value);
                }}
                className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* ========== CATEGORIES TABLE ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                All Categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredCategories.length} category
                {filteredCategories.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="rounded-lg bg-violet-50 px-4 py-2">
              <span className="text-sm font-medium text-violet-700">
                Total: {categories.length} categories
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <CategoryTable
              categories={filteredCategories}
              setCategories={setCategories}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
