// frontend/src/pages/admin/ShopVerification.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBuildingStorefront,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineRefresh,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import { getShops, updateShopStatus } from "../../services/adminService";

const ShopVerification = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await getShops();
      setShops(response.shops || []);
    } catch (error) {
      console.error("Error fetching shops:", error);
      toast.error("Failed to load shops");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (shopId, status) => {
    try {
      await updateShopStatus(shopId, { status });
      toast.success(
        `Shop ${status === "approved" ? "approved" : "rejected"} successfully!`,
      );
      fetchShops(); // Refresh the list
    } catch (error) {
      console.error("Error updating shop status:", error);
      toast.error("Failed to update shop status");
    }
  };

  const filteredShops = shops.filter((shop) => {
    if (filter === "all") return true;
    return shop.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      inactive: "bg-gray-100 text-gray-700",
    };
    const icons = {
      pending: <HiOutlineClock size={14} />,
      approved: <HiOutlineCheckCircle size={14} />,
      rejected: <HiOutlineXCircle size={14} />,
      inactive: <HiOutlineXCircle size={14} />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}
      >
        {icons[status] || icons.pending}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-slate-200 rounded"></div>
            <div className="h-12 w-64 bg-slate-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100"
                >
                  <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <HiOutlineBuildingStorefront className="text-violet-600" />
              Shop Verification
            </h1>
            <p className="text-slate-500 mt-1">
              Review and verify shop registrations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchShops}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <HiOutlineRefresh className="w-5 h-5 text-slate-500" />
            </button>
            <span className="text-sm text-slate-500">
              {filteredShops.length} shops
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                filter === status
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs opacity-70">
                (
                {
                  shops.filter((s) => status === "all" || s.status === status)
                    .length
                }
                )
              </span>
            </button>
          ))}
        </div>

        {/* Shops Grid */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-bold text-slate-800">
              No shops to verify
            </h3>
            <p className="text-slate-500 mt-2">
              {filter === "pending"
                ? "All shops have been reviewed"
                : `No ${filter} shops found`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all"
              >
                {/* Shop Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {shop.image ? (
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl">
                        🏪
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-800">{shop.name}</h3>
                      <p className="text-xs text-slate-500">
                        {shop.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(shop.status)}
                </div>

                {/* Shop Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <HiOutlineUser className="text-slate-400" size={16} />
                    <span>{shop.owner?.name || "Unknown Owner"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <HiOutlinePhone className="text-slate-400" size={16} />
                    <span>{shop.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <HiOutlineMapPin className="text-slate-400" size={16} />
                    <span className="truncate">
                      {shop.address || "No address"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <HiOutlineTag className="text-slate-400" size={16} />
                    <span>{shop._count?.offers || 0} offers</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {shop.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(shop.id, "approved")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition font-medium text-sm"
                    >
                      <HiOutlineCheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(shop.id, "rejected")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition font-medium text-sm"
                    >
                      <HiOutlineXCircle size={18} />
                      Reject
                    </button>
                  </div>
                )}

                {shop.status === "approved" && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleStatusUpdate(shop.id, "rejected")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition font-medium text-sm"
                    >
                      <HiOutlineXCircle size={18} />
                      Revoke Approval
                    </button>
                  </div>
                )}

                {shop.status === "rejected" && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleStatusUpdate(shop.id, "approved")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition font-medium text-sm"
                    >
                      <HiOutlineCheckCircle size={18} />
                      Re-approve
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopVerification;
