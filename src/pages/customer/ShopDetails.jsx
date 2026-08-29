// frontend/src/pages/customer/ShopDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineArrowLeft,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineStar,
  HiOutlineTag,
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineLink, // ✅ Changed from HiOutlineExternalLink
  HiOutlineBuildingStorefront,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

import { getShopById } from "../../services/shopService";
import ShopRating from "../../components/ShopRating"; // ✅ ADD THIS IMPORT

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
      <div className="h-8 w-48 bg-slate-200 rounded"></div>
    </div>
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="h-96 bg-slate-200 rounded-2xl"></div>
      </div>
      <div className="space-y-4">
        <div className="h-10 w-3/4 bg-slate-200 rounded"></div>
        <div className="h-6 w-1/2 bg-slate-200 rounded"></div>
        <div className="h-20 w-full bg-slate-200 rounded"></div>
        <div className="h-12 w-full bg-slate-200 rounded-xl"></div>
        <div className="h-12 w-full bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// ========== OFFER CARD ==========
const ShopOfferCard = ({ offer, onClick }) => {
  const getTimeRemaining = (endDate) => {
    if (!endDate) return "No expiry";
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff < 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h left`;
    return "Ending soon!";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick(offer.id)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-100 cursor-pointer group"
    >
      <div className="relative h-40 bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
        {offer.image ? (
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">🎉</span>
        )}
        {offer.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {offer.discount}% OFF
          </div>
        )}
        {offer.endDate && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
            ⏰ {getTimeRemaining(offer.endDate)}
          </div>
        )}
        {offer.category?.name && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-violet-600 text-xs font-medium px-3 py-1 rounded-full shadow-lg">
            {offer.category.name}
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-violet-600 transition-colors">
          {offer.title}
        </h4>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
            {offer.discount}% OFF
          </span>
          <span className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1">
            View →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getShopById(id);
        setShop(response.shop);
        document.title = `${response.shop?.name || "Shop"} - Smaze`;
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError("Failed to load shop details");
        toast.error("Failed to load shop");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShop();
    }
  }, [id]);

  const handleOfferClick = (offerId) => {
    navigate(`/customer/offers/${offerId}`);
  };

  const handleSaveShop = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Shop saved successfully!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: shop?.name,
          text: `Check out ${shop?.name} on Smaze!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-2xl font-bold text-slate-800">Shop not found</h3>
          <p className="text-slate-500 mt-2">
            {error || "The shop you're looking for doesn't exist."}
          </p>
          <Link
            to="/customer/shops"
            className="mt-4 inline-block text-violet-600 font-semibold hover:text-violet-700"
          >
            ← Back to shops
          </Link>
        </div>
      </div>
    );
  }

  const getOfferCount = () => {
    return shop.offers?.length || shop._count?.offers || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-6"
        >
          <HiOutlineArrowLeft size={20} />
          Back to shops
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Info */}
          <div className="lg:col-span-2">
            {/* Shop Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 shadow-lg">
              <img
                src={
                  shop.image ||
                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                }
                alt={shop.name}
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800";
                }}
              />
              <button
                onClick={handleSaveShop}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full hover:bg-white transition-all shadow-lg"
              >
                <HiOutlineHeart
                  className={`text-2xl ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"}`}
                />
              </button>
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-green-700 flex items-center gap-2 shadow-lg">
                  <HiOutlineCheckCircle className="text-green-500" size={16} />
                  Verified
                </span>
                {shop.category?.name && (
                  <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-violet-700 shadow-lg">
                    {shop.category.name}
                  </span>
                )}
                {getOfferCount() > 0 && (
                  <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-amber-700 shadow-lg">
                    🎯 {getOfferCount()} Offers
                  </span>
                )}
              </div>
            </div>

            {/* Offers Section */}
            {shop.offers && shop.offers.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <HiOutlineTag className="text-violet-600" />
                  Offers from {shop.name}
                  <span className="text-sm font-normal text-slate-400">
                    ({shop.offers.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shop.offers.slice(0, 4).map((offer) => (
                    <ShopOfferCard
                      key={offer.id}
                      offer={offer}
                      onClick={handleOfferClick}
                    />
                  ))}
                </div>
                {shop.offers.length > 4 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() =>
                        navigate(`/customer/offers?shop=${shop.id}`)
                      }
                      className="text-sm font-medium text-violet-600 hover:text-violet-700 transition"
                    >
                      View all {shop.offers.length} offers →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Shop Name & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{shop.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-yellow-400">
                  <HiOutlineStar className="fill-yellow-400" size={20} />
                  <span className="font-bold text-slate-700">4.5</span>
                </div>
                <span className="text-sm text-slate-400">(12 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="text-slate-600 leading-relaxed">
                {shop.description ||
                  `${shop.name} is a verified business on Smaze offering great deals and services.`}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
              <h4 className="font-semibold text-slate-800">
                Contact Information
              </h4>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <HiOutlineMapPin className="text-violet-500" size={18} />
                <span>{shop.address || "Address not available"}</span>
              </div>
              {shop.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <HiOutlinePhone className="text-violet-500" size={18} />
                  <a
                    href={`tel:${shop.phone}`}
                    className="hover:text-violet-600"
                  >
                    {shop.phone}
                  </a>
                </div>
              )}
              {shop.owner?.email && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <HiOutlineEnvelope className="text-violet-500" size={18} />
                  <a
                    href={`mailto:${shop.owner.email}`}
                    className="hover:text-violet-600"
                  >
                    {shop.owner.email}
                  </a>
                </div>
              )}
            </div>

            {/* Shop Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
              <h4 className="font-semibold text-slate-800">Shop Information</h4>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <HiOutlineCalendar className="text-violet-500" size={18} />
                <span>
                  Joined{" "}
                  {new Date(shop.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <HiOutlineBuildingStorefront
                  className="text-violet-500"
                  size={18}
                />
                <span>{getOfferCount()} Active Offers</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h4 className="font-semibold text-slate-800 mb-3">
                Connect With Us
              </h4>
              <div className="flex gap-3">
                <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                  <FaFacebook size={20} />
                </button>
                <button className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition">
                  <FaTwitter size={20} />
                </button>
                <button className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition">
                  <FaInstagram size={20} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition"
                >
                  <HiOutlineShare size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/customer/offers?shop=${shop.id}`)}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition shadow-lg shadow-violet-200"
              >
                View All Offers
              </button>
              {shop.googleMapLink && (
                <a
                  href={shop.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                >
                  <HiOutlineLink size={20} className="text-slate-600" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ✅ ADD SHOP RATING SECTION HERE */}
        <div className="mt-12">
          <ShopRating shopId={shop.id} />
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
