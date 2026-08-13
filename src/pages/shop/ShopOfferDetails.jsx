import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineCalendarDays,
  HiOutlineTag,
  HiOutlineCurrencyRupee,
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
  HiOutlineArrowLeft,
  HiOutlinePencilSquare,
  HiOutlineClock,
  HiOutlineUsers,
} from "react-icons/hi2";

import { getMyOfferById } from "../../services/offerService";

// ========== DETAIL CARD ==========
const DetailCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:shadow-md hover:bg-white">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
      <Icon size={22} />
    </div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 font-semibold text-slate-800">{value || "-"}</p>
  </div>
);

// ========== MAIN COMPONENT ==========
export default function ShopOfferDetails() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await getMyOfferById(id);
        setOffer(response.offer);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOffer();
  }, [id]);

  if (!offer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-700">Offer not found</h2>
          <p className="text-slate-500 mt-2">
            The offer you're looking for doesn't exist.
          </p>
          <Link
            to="/shop/my-offers"
            className="mt-4 inline-block rounded-xl bg-violet-600 px-6 py-2.5 text-white hover:bg-violet-700"
          >
            Back to Offers
          </Link>
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Link
            to="/shop/my-offers"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-medium text-slate-600 shadow-sm transition hover:shadow-md hover:text-violet-600"
          >
            <HiOutlineArrowLeft size={18} />
            Back to Offers
          </Link>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm"
        >
          {/* Image */}
          <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-slate-100 to-violet-50">
            <img
              src={offer.image || "https://placehold.co/1200x500?text=No+Image"}
              alt={offer.title}
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
              onError={(e) => {
                e.target.src = "https://placehold.co/1200x500?text=No+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <span className="absolute right-6 top-6 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-lg">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              Active
            </span>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  {offer.title}
                </h1>
                <p className="mt-1 text-slate-500 flex items-center gap-2">
                  <HiOutlineBuildingStorefront size={16} />
                  {offer.shop?.name || "Uncategorized"}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 text-center border border-violet-100">
                <p className="text-sm text-slate-500">Discount</p>
                <p className="text-3xl font-bold text-violet-700">
                  {offer.discount}%
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailCard
                icon={HiOutlineTag}
                label="Category"
                value={offer.category?.name}
              />
              <DetailCard
                icon={HiOutlineCurrencyRupee}
                label="Discount"
                value={`${offer.discount}%`}
              />
              <DetailCard
                icon={HiOutlineBuildingStorefront}
                label="Shop"
                value={offer.shop?.name}
              />
              <DetailCard
                icon={HiOutlineMapPin}
                label="Address"
                value={offer.shop?.address}
              />
              <DetailCard
                icon={HiOutlineCalendarDays}
                label="Created On"
                value={new Date(offer.createdAt).toLocaleDateString()}
              />
              <DetailCard
                icon={HiOutlineClock}
                label="Last Updated"
                value={new Date(offer.updatedAt).toLocaleDateString()}
              />
            </div>

            {/* Description */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineDocumentText size={22} className="text-violet-600" />
                Description
              </h2>
              <p className="mt-3 leading-7 text-slate-600 bg-slate-50 rounded-xl p-5 border border-slate-100">
                {offer.description || "No description provided."}
              </p>
            </div>

            {/* Shop Information */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <HiOutlineBuildingStorefront
                  size={22}
                  className="text-violet-600"
                />
                Shop Information
              </h2>
              <div className="mt-4 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-r from-slate-50 to-white">
                <img
                  src={
                    offer.shop?.image ||
                    "https://placehold.co/100x100?text=Shop"
                  }
                  alt={offer.shop?.name}
                  className="h-24 w-24 rounded-xl object-cover border-2 border-violet-100"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=Shop";
                  }}
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {offer.shop?.name || "Unknown Shop"}
                  </h3>
                  <p className="mt-1 text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                    <HiOutlineMapPin size={16} />
                    {offer.shop?.address || "Address not available"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    <HiOutlineUsers className="inline mr-1" size={14} />
                    Shop since{" "}
                    {new Date(offer.shop?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap justify-end gap-4 pt-6 border-t border-slate-200">
              <Link
                to={`/shop/offers/edit/${offer.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02] hover:shadow-xl"
              >
                <HiOutlinePencilSquare size={18} />
                Edit Offer
              </Link>
              <Link
                to="/shop/my-offers"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-medium text-slate-600 transition hover:bg-slate-50 hover:scale-[1.02]"
              >
                Back
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ========== MISSING IMPORT ==========
const HiOutlineDocumentText = () => <span>📄</span>; // Placeholder if not imported
