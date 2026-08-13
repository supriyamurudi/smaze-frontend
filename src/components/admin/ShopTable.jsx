/* eslint-disable no-undef */
// frontend/src/components/admin/ShopTable.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingStorefront, // ✅ ADD THIS IMPORT
} from "react-icons/hi2";
import { approveShop, rejectShop } from "../../services/adminService";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    inactive: "bg-red-100 text-red-700",
    rejected: "bg-rose-100 text-rose-700",
  };

  const icons = {
    active: <HiOutlineCheckCircle className="inline mr-1" size={14} />,
    pending: <HiOutlineClock className="inline mr-1" size={14} />,
    inactive: <HiOutlineXCircle className="inline mr-1" size={14} />,
    rejected: <HiOutlineXCircle className="inline mr-1" size={14} />,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status?.toLowerCase()] || styles.pending
      }`}
    >
      {icons[status?.toLowerCase()] || icons.pending}
      {status || "Pending"}
    </span>
  );
};

const ShopTable = ({ shops = [], onRefresh }) => {
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (shopId) => {
    if (!window.confirm("Are you sure you want to approve this shop?")) return;

    try {
      setProcessingId(shopId);
      await approveShop(shopId);
      toast.success("Shop approved successfully!");
      if (onRefresh) await onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve shop");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (shopId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason === null) return; // User cancelled

    try {
      setProcessingId(shopId);
      await rejectShop(shopId, { reason });
      toast.success("Shop rejected");
      if (onRefresh) await onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject shop");
    } finally {
      setProcessingId(null);
    }
  };

  if (!shops || shops.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <HiOutlineBuildingStorefront size={32} />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">No shops found</h3>
        <p className="mt-2 text-sm text-slate-500">
          No shops match your current filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="pb-3 pr-4 font-medium">Shop</th>
            <th className="pb-3 pr-4 font-medium">Owner</th>
            <th className="pb-3 pr-4 font-medium">Category</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Offers</th>
            <th className="pb-3 pr-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {shops.map((shop, index) => (
            <motion.tr
              key={shop.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-slate-50/50 transition-colors"
            >
              {/* Shop Info */}
              <td className="py-4 pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    {shop.image ? (
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="h-11 w-11 rounded-xl object-cover"
                      />
                    ) : (
                      <HiOutlineBuildingStorefront size={22} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 line-clamp-1">
                      {shop.name}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {shop.address || "No address"}
                    </p>
                  </div>
                </div>
              </td>

              {/* Owner */}
              <td className="py-4 pr-4">
                <p className="text-sm font-medium text-slate-700">
                  {shop.owner?.name || "N/A"}
                </p>
                <p className="text-xs text-slate-400">
                  {shop.owner?.email || "No email"}
                </p>
              </td>

              {/* Category */}
              <td className="py-4 pr-4">
                <span className="inline-block rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                  {shop.category?.name || "Uncategorized"}
                </span>
              </td>

              {/* Status */}
              <td className="py-4 pr-4">
                <StatusBadge status={shop.status} />
              </td>

              {/* Offers */}
              <td className="py-4 pr-4">
                <span className="text-sm font-semibold text-slate-700">
                  {shop._count?.offers || 0}
                </span>
              </td>

              {/* Actions */}
              <td className="py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {/* View */}
                  <Link to={`/admin/shops/${shop.id}`}>
                    <button
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                      title="View Details"
                    >
                      <HiOutlineEye size={18} />
                    </button>
                  </Link>

                  {/* Edit */}
                  <Link to={`/admin/shops/edit/${shop.id}`}>
                    <button
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      title="Edit Shop"
                    >
                      <HiOutlinePencil size={18} />
                    </button>
                  </Link>

                  {/* Approval Actions - Only show for pending shops */}
                  {shop.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(shop.id)}
                        disabled={processingId === shop.id}
                        className="rounded-lg p-2 text-emerald-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                        title="Approve Shop"
                      >
                        {processingId === shop.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                        ) : (
                          <HiOutlineCheckCircle size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(shop.id)}
                        disabled={processingId === shop.id}
                        className="rounded-lg p-2 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                        title="Reject Shop"
                      >
                        {processingId === shop.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></div>
                        ) : (
                          <HiOutlineXCircle size={18} />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopTable;
