import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlinePlus,
  HiOutlineTag,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
} from "react-icons/hi2";

import { getOffers, deleteOffer } from "../../services/adminService";

// ========== HELPER: Check if offer is expired ==========
const isOfferExpired = (offer) => {
  if (!offer.endDate) return false;
  const endDate = new Date(offer.endDate);
  const now = new Date();
  return endDate < now;
};

// ========== HELPER: Get offer status ==========
const getOfferStatus = (offer) => {
  // If status is explicitly set in DB, use it
  if (offer.status) {
    const statusLower = offer.status.toLowerCase();

    // If it's already expired, keep it expired
    if (statusLower === "expired") return "expired";

    // If it's active, check if it's actually expired
    if (statusLower === "active") {
      return isOfferExpired(offer) ? "expired" : "active";
    }

    // Other statuses (pending, inactive, etc.)
    return statusLower;
  }

  // No status in DB - check if expired
  if (isOfferExpired(offer)) {
    return "expired";
  }

  // Default to pending for new offers without status
  return "pending";
};

// ========== CUSTOM HOOK FOR FETCHING OFFERS ==========
function useOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOffers, setTotalOffers] = useState(0);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getOffers();

      let offersData = [];

      if (Array.isArray(response)) {
        offersData = response;
      } else if (response.offers && Array.isArray(response.offers)) {
        offersData = response.offers;
      } else if (response.data && Array.isArray(response.data)) {
        offersData = response.data;
      } else {
        console.warn("⚠️ Unexpected response structure:", response);
        offersData = [];
      }

      // ✅ Process offers to set correct status
      const processedOffers = offersData.map((offer) => ({
        ...offer,
        status: getOfferStatus(offer),
        isExpired: isOfferExpired(offer),
      }));

      setOffers(processedOffers);
      setTotalOffers(processedOffers.length);
    } catch (error) {
      console.error("❌ Error fetching offers:", error);
      setError(error.message);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load offers");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOffers();
  }, []);

  // ✅ Auto-refresh every minute to check for expired offers
  useEffect(() => {
    const interval = setInterval(() => {
      if (offers.length > 0) {
        const updatedOffers = offers.map((offer) => {
          // Only check active offers for expiry
          if (offer.status === "active" && isOfferExpired(offer)) {
            return { ...offer, status: "expired", isExpired: true };
          }
          // Check pending offers - keep as pending but mark isExpired
          if (offer.status === "pending" && isOfferExpired(offer)) {
            return { ...offer, isExpired: true };
          }
          return offer;
        });

        const hasChanges = updatedOffers.some(
          (offer, index) =>
            offer.status !== offers[index].status ||
            offer.isExpired !== offers[index].isExpired,
        );

        if (hasChanges) {
          setOffers(updatedOffers);
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [offers]);

  return { offers, loading, totalOffers, fetchOffers, setOffers, error };
}

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="h-8 w-40 bg-slate-200 rounded-full animate-pulse"></div>
        <div className="mt-4 h-10 w-64 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-5 w-96 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mb-5"></div>
      <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-200 px-6 py-5">
        <div>
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="mt-1 h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
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

// ========== OFFER CARD COMPONENT ==========
const OfferCard = ({ offer, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${offer.title}"?`))
      return;

    setIsDeleting(true);
    try {
      await onDelete(offer.id);
      toast.success("Offer deleted successfully!");
    } catch {
      toast.error("Failed to delete offer");
    } finally {
      setIsDeleting(false);
    }
  };

  const status = offer.status || "pending";
  const isExpired = offer.isExpired || status.toLowerCase() === "expired";

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    switch (statusLower) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "expired":
        return "bg-rose-100 text-rose-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    switch (statusLower) {
      case "active":
        return <HiOutlineCheckCircle size={14} />;
      case "pending":
        return <HiOutlineClock size={14} />;
      case "expired":
        return <HiOutlineXCircle size={14} />;
      default:
        return <HiOutlineClock size={14} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isEndingSoon = () => {
    if (!offer.endDate) return false;
    const endDate = new Date(offer.endDate);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 3;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group rounded-xl border p-5 transition hover:shadow-md ${
        isExpired
          ? "border-rose-200 bg-rose-50/30"
          : isEndingSoon()
            ? "border-amber-200 bg-amber-50/30"
            : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
              isExpired
                ? "bg-rose-100 text-rose-700"
                : isEndingSoon()
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700"
            }`}
          >
            <HiOutlineTag size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-base font-semibold truncate ${
                  isExpired ? "text-rose-700" : "text-slate-800"
                }`}
              >
                {offer.title || "Untitled Offer"}
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
              >
                {getStatusIcon(status)}
                {status}
              </span>
              {isEndingSoon() && !isExpired && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  ⚠️ Ending Soon
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>
                🏪 {offer.shop?.name || offer.shopName || "Unknown Shop"}
              </span>
              <span>📅 Created: {formatDate(offer.createdAt)}</span>
              {offer.endDate && (
                <span className={isExpired ? "text-rose-600 font-medium" : ""}>
                  ⏰ Ends: {formatDate(offer.endDate)}
                  {isExpired && " (Expired)"}
                </span>
              )}
              <span>👁️ {offer.views || 0} views</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/offers/${offer.id}`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
            title="View Details"
          >
            <HiOutlineEye size={18} />
          </Link>
          <Link
            to={`/admin/offers/${offer.id}/edit`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
            title="Edit Offer"
          >
            <HiOutlinePencil size={18} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            title="Delete Offer"
          >
            {isDeleting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"></div>
            ) : (
              <HiOutlineTrash size={18} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
export default function Offers() {
  const { offers, loading, totalOffers, fetchOffers, setOffers, error } =
    useOffers();

  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOffers = useMemo(() => {
    let filtered = [...offers];

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (offer) =>
          (offer.status || "pending").toLowerCase() ===
          filterStatus.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((offer) => {
        const title = String(offer.title || "").toLowerCase();
        const shopName = String(
          offer.shop?.name || offer.shopName || "",
        ).toLowerCase();
        const category = String(
          offer.category || offer.category?.name || "",
        ).toLowerCase();
        const description = String(offer.description || "").toLowerCase();

        return (
          title.includes(query) ||
          shopName.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        );
      });
    }

    return filtered;
  }, [offers, searchQuery, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts = {
      all: offers.length,
      active: 0,
      pending: 0,
      expired: 0,
      inactive: 0,
    };

    offers.forEach((offer) => {
      const status = (offer.status || "pending").toLowerCase();
      if (Object.prototype.hasOwnProperty.call(counts, status)) {
        counts[status]++;
      }
    });

    return counts;
  }, [offers]);

  const handleDeleteOffer = async (offerId) => {
    try {
      await deleteOffer(offerId);
      const updatedOffers = offers.filter((offer) => offer.id !== offerId);
      setOffers(updatedOffers);
      toast.success("Offer deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete offer");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOffers();
    setIsRefreshing(false);
    toast.success("Offers refreshed!");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <HiOutlineXCircle size={32} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-rose-800">
              Failed to Load Offers
            </h2>
            <p className="mt-2 text-rose-600">
              {error.includes("401")
                ? "Session expired. Please login again."
                : error}
            </p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
              <HiOutlineTag className="text-lg" />
              Offer Management
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Manage Offers
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Create, edit and manage promotional offers for all registered
              shops across the Smaze platform.
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
            <Link
              to="/admin/offers/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-200 transition hover:shadow-xl"
            >
              <HiOutlinePlus className="text-lg" />
              Add Offer
            </Link>
          </div>
        </motion.div>

        {/* ========== STATS CARDS ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Offers</p>
            <p className="text-2xl font-bold text-slate-900">{totalOffers}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <p className="text-sm text-emerald-600">Active</p>
            <p className="text-2xl font-bold text-emerald-700">
              {statusCounts.active || 0}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
            <p className="text-sm text-amber-600">Pending</p>
            <p className="text-2xl font-bold text-amber-700">
              {statusCounts.pending || 0}
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
            <p className="text-sm text-rose-600">Expired</p>
            <p className="text-2xl font-bold text-rose-700">
              {statusCounts.expired || 0}
            </p>
          </div>
        </motion.div>

        {/* ========== SEARCH & FILTERS ========== */}
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
                  placeholder="Search offers by title, shop, or category..."
                  className="w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="inactive">Inactive</option>
              </select>
              <span className="text-sm text-slate-500 whitespace-nowrap">
                {filteredOffers.length} offer
                {filteredOffers.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========== OFFERS LIST ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                All Offers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredOffers.length} offer
                {filteredOffers.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
                Total: {totalOffers} offers
              </span>
              <span className="text-xs text-slate-400">
                Auto-updates every minute
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {filteredOffers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-slate-100 p-4">
                  <HiOutlineTag size={40} className="text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  No offers found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {searchQuery
                    ? "No offers match your search criteria"
                    : "Get started by creating your first offer"}
                </p>
                {!searchQuery && (
                  <Link
                    to="/admin/offers/add"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                  >
                    <HiOutlinePlus size={16} />
                    Create Offer
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onDelete={handleDeleteOffer}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
