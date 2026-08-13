import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineSquares2X2,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import DeleteModal from "./DeleteModal";
import { deleteCategory } from "../../services/categoryService";

// ========== STATUS BADGE ==========
const StatusBadge = ({ status }) => {
  const statusLower = status?.toLowerCase() || "active";

  const config = {
    active: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: <HiOutlineCheckCircle size={14} className="text-emerald-600" />,
      label: "Active",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: <HiOutlineClock size={14} className="text-amber-600" />,
      label: "Pending",
    },
    inactive: {
      bg: "bg-rose-100",
      text: "text-rose-700",
      icon: <HiOutlineXCircle size={14} className="text-rose-600" />,
      label: "Inactive",
    },
  };

  const { bg, text, icon, label } = config[statusLower] || config.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${bg} px-3 py-1 text-xs font-medium ${text}`}
    >
      {icon}
      {label}
    </span>
  );
};

export default function CategoryTable({ categories, setCategories }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);
    try {
      await deleteCategory(selectedCategory.id);
      setCategories(
        categories.filter((item) => item.id !== selectedCategory.id),
      );
      toast.success(`"${selectedCategory.name}" deleted successfully`);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <HiOutlineSquares2X2 size={40} className="text-slate-400" />
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
          Add Category
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Category
              </th>
              {/* ✅ Slug column removed */}
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
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex-shrink-0">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-violet-700">
                          <HiOutlineSquares2X2 size={22} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        ID: #{category.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ✅ Slug row removed */}

                <td className="px-6 py-4">
                  <StatusBadge status={category.status} />
                </td>

                <td className="px-6 py-4 text-sm text-slate-500">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : "—"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/categories/${category.id}`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                      title="View Details"
                    >
                      <HiOutlineEye size={18} />
                    </Link>

                    <Link
                      to={`/admin/categories/edit/${category.id}`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      title="Edit Category"
                    >
                      <HiOutlinePencilSquare size={18} />
                    </Link>

                    <button
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      title="Delete Category"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={!!selectedCategory}
        title="Delete Category"
        message={
          selectedCategory
            ? `Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`
            : ""
        }
        onCancel={() => setSelectedCategory(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
