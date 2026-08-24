// pages/shop/MyOffers.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlinePlusCircle,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineUsers,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import DeleteModal from "../../components/admin/DeleteModal";
import { getMyOffers, deleteOffer } from "../../services/offerService";

// ========== SKELETON LOADER (Mobile optimized) ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div>
      <div className="h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
    </div>
    <div className="relative max-w-md">
      <div className="h-11 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex gap-4">
              <div className="h-20 w-20 sm:h-28 sm:w-28 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-full max-w-md bg-slate-200 rounded animate-pulse"></div>
                <div className="flex gap-3">
                  <div className="h-7 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-7 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              <div className="h-10 w-full lg:w-20 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-full lg:w-20 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-full lg:w-20 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ========== OFFER CARD (Fully Responsive) ==========
const OfferCard = ({ offer, onDelete }) => {
  // Get saved count from various possible field names
  const savedCount =
    offer._count?.savedOffers || offer.savedOffers || offer.savedCount || 0;

  const handleDeleteClick = () => {
    console.log("🗑️ Delete clicked for offer:", offer.id);
    if (!offer.id) {
      toast.error("Invalid offer ID");
      return;
    }
    onDelete(offer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-xl"
    >
      {/* Mobile: Vertical Stack, Desktop: Horizontal */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section - Image & Content */}
        <div className="flex flex-1 gap-4">
          <img
            src={
              offer.image || "https://via.placeholder.com/120x120?text=Offer"
            }
            alt={offer.title}
            className="h-20 w-20 sm:h-28 sm:w-28 rounded-xl object-cover border border-slate-200 transition-transform group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/120x120?text=Offer";
            }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-1">
              {offer.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">
              {offer.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                <HiOutlineTag size={14} />
                {offer.category?.name || "Uncategorized"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-100 to-orange-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                {offer.discount}% OFF
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                <HiOutlineUsers size={14} />
                {savedCount} saved
              </span>
            </div>

            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <HiOutlineCalendar size={14} />
              Created on {new Date(offer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right Section - Buttons (Stacked on Mobile, Vertical on Desktop) */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-2 lg:flex-col">
          <Link
            to={`/shop/offers/${offer.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:scale-105 hover:shadow-lg"
          >
            <HiOutlineEye size={16} />
            View
          </Link>
          <Link
            to={`/shop/offers/edit/${offer.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-medium text-violet-600 transition hover:bg-violet-50 hover:scale-105"
          >
            <HiOutlinePencilSquare size={16} />
            Edit
          </Link>
          <button
            onClick={handleDeleteClick}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:scale-105"
          >
            <HiOutlineTrash size={16} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
export default function MyOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ===============================
  // Load Offers on Mount
  // ===============================
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const response = await getMyOffers();
        setOffers(response.offers || []);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  // ===============================
  // Search
  // ===============================
  const filteredOffers = useMemo(() => {
    const keyword = search.toLowerCase();
    return offers.filter((offer) => {
      return (
        offer.title.toLowerCase().includes(keyword) ||
        offer.description?.toLowerCase().includes(keyword) ||
        offer.category?.name?.toLowerCase().includes(keyword)
      );
    });
  }, [offers, search]);

  const handleDeleteConfirm = async () => {
    if (!selectedOffer) return;

    try {
      setIsDeleting(true);
      console.log("📝 Confirming delete for offer ID:", selectedOffer.id);

      await deleteOffer(selectedOffer.id);

      setOffers((prev) =>
        prev.filter((offer) => offer.id !== selectedOffer.id),
      );
      toast.success("Offer deleted successfully");
      setSelectedOffer(null);
    } catch (error) {
      console.log("❌ Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete offer");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:mr-8 lg:mb-8">
        {/* Header (Mobile optimized) */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              My Offers
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-500">
              Manage all offers created by your shop
            </p>
          </div>
          <Link
            to="/shop/add-offer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
          >
            <HiOutlinePlusCircle size={20} />
            Add New Offer
          </Link>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6 max-w-md"
        >
          <HiOutlineMagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search offers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border-0 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 shadow-md outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-4"
        >
          <div className="rounded-xl bg-white px-4 py-2 shadow-sm">
            <span className="text-sm text-slate-500">Total:</span>
            <span className="ml-2 font-bold text-slate-800">
              {offers.length}
            </span>
          </div>
          <div className="rounded-xl bg-white px-4 py-2 shadow-sm">
            <span className="text-sm text-slate-500">Showing:</span>
            <span className="ml-2 font-bold text-violet-600">
              {filteredOffers.length}
            </span>
          </div>
        </motion.div>

        {/* Offers List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 py-16 sm:py-20 text-center px-6">
              <HiOutlineTag size={48} className="text-slate-300" />
              <h3 className="mt-4 text-xl font-semibold text-slate-700">
                {search
                  ? "No offers match your search"
                  : "No offers created yet"}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                {search
                  ? "Try adjusting your search terms"
                  : "Start by adding your first offer"}
              </p>
              {!search && (
                <Link
                  to="/shop/add-offer"
                  className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 font-semibold text-white transition hover:scale-105 hover:shadow-lg"
                >
                  <HiOutlinePlusCircle size={18} />
                  Add Offer
                </Link>
              )}
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onDelete={setSelectedOffer}
              />
            ))
          )}
        </motion.div>

        {/* Delete Modal */}
        <DeleteModal
          isOpen={!!selectedOffer}
          title="Delete Offer"
          message={
            selectedOffer
              ? `Are you sure you want to delete "${selectedOffer.title}"? This action cannot be undone.`
              : ""
          }
          onCancel={() => setSelectedOffer(null)}
          onConfirm={handleDeleteConfirm}
          loading={isDeleting}
        />
      </div>
    </motion.div>
  );
}
