import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineFolder,
} from "react-icons/hi2";

import {
  getCategoryById,
  deleteCategory,
} from "../../services/categoryService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4 mb-8">
      <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse"></div>
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-1 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
        <div className="md:col-span-2">
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
          <div className="h-20 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-end gap-4 border-t pt-8">
        <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

// ========== STATUS BADGE ==========
const StatusBadge = ({ status }) => {
  const statusLower = status?.toLowerCase() || "active";

  const config = {
    active: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: <HiOutlineCheckCircle size={16} className="text-emerald-600" />,
      label: "Active",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <HiOutlineClock size={16} className="text-amber-600" />,
      label: "Pending",
    },
    inactive: {
      bg: "bg-rose-100",
      text: "text-rose-700",
      icon: <HiOutlineXCircle size={16} className="text-rose-600" />,
      label: "Inactive",
    },
  };

  const { bg, text, icon, label } = config[statusLower] || config.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${bg} px-3 py-1 text-sm font-medium ${text}`}
    >
      {icon}
      {label}
    </span>
  );
};

// ========== INFO CARD ==========
const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
  <div
    className={`rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 ${className}`}
  >
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800 break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ========== FETCH CATEGORY ==========
  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoryById(id);

      // Handle different response structures
      const data = response.category || response.data || response;
      setCategory(data);
    } catch (error) {
      console.error("Error fetching category:", error);
      setError(error.message || "Failed to load category");
      toast.error(error.response?.data?.message || "Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategory();
  }, [id]);

  // ========== DELETE CATEGORY ==========
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${category?.name}"? This action cannot be undone.`,
      )
    )
      return;

    setIsDeleting(true);
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully!");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <HiOutlineXCircle size={32} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-rose-800">
              Category Not Found
            </h2>
            <p className="mt-2 text-rose-600">
              {error ||
                "The category you're looking for doesn't exist or has been removed."}
            </p>
            <Link
              to="/admin/categories"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              <HiOutlineArrowLeft size={18} />
              Back to Categories
            </Link>
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
      <div className="mx-auto max-w-5xl">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link to="/admin/categories">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
              >
                <HiOutlineArrowLeft size={20} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Category Details
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View complete category information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="h-12 w-12 rounded-xl object-cover border-2 border-slate-200"
              />
            )}
            <StatusBadge status={category.status} />
          </div>
        </motion.div>

        {/* ========== MAIN CONTENT ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="p-6 sm:p-8">
            {/* Title Section */}
            <div className="mb-8 flex flex-col gap-2 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-2.5 text-violet-700">
                  <HiOutlineFolder size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {category.name}
                </h2>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoCard
                icon={HiOutlineTag}
                label="Category Name"
                value={category.name}
              />

              <InfoCard
                icon={HiOutlineBuildingStorefront}
                label="Total Shops"
                value={category.shops || category.totalShops || 0}
              />

              <InfoCard
                icon={HiOutlineCalendar}
                label="Created At"
                value={
                  category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "—"
                }
              />

              <InfoCard
                icon={HiOutlineCalendar}
                label="Updated At"
                value={
                  category.updatedAt
                    ? new Date(category.updatedAt).toLocaleDateString()
                    : "—"
                }
              />

              <InfoCard
                icon={HiOutlineFolder}
                label="Category ID"
                value={category.id}
              />
            </div>

            {/* Description */}
            {category.description && (
              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <HiOutlineDocumentText size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Description
                    </p>
                    <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:justify-end sm:gap-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-rose-300 px-6 py-3 font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 sm:w-auto"
              >
                {isDeleting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash size={18} />
                    Delete Category
                  </>
                )}
              </button>

              <Link
                to={`/admin/categories/edit/${category.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                <HiOutlinePencil size={18} />
                Edit Category
              </Link>

              <Link
                to="/admin/categories"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:shadow-xl sm:w-auto"
              >
                <HiOutlineArrowLeft size={18} />
                Back to Categories
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
