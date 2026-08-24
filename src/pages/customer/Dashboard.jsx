// src/pages/customer/Dashboard.jsx

import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineGift,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineStar,
  HiOutlineCog6Tooth,
  HiOutlineArrowRight,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineSparkles,
  HiOutlineShoppingBag,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { RiStore2Line } from "react-icons/ri";

import { getCustomerDashboard } from "../../services/customerService";
import HeroSection from "../../components/customer/HeroSection";

// ========== CONSTANTS ==========

const CATEGORIES = [
  {
    name: "Food",
    icon: "🍽️",
    gradient: "from-orange-400 to-amber-500",
    bg: "bg-gradient-to-br from-orange-100 to-amber-50",
    border: "border-orange-300",
    text: "text-orange-700",
    hover: "hover:shadow-lg hover:shadow-orange-200/50",
  },
  {
    name: "Fashion",
    icon: "👗",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-gradient-to-br from-rose-100 to-pink-50",
    border: "border-rose-300",
    text: "text-rose-700",
    hover: "hover:shadow-lg hover:shadow-rose-200/50",
  },
  {
    name: "Beauty",
    icon: "💄",
    gradient: "from-purple-400 to-fuchsia-500",
    bg: "bg-gradient-to-br from-purple-100 to-fuchsia-50",
    border: "border-purple-300",
    text: "text-purple-700",
    hover: "hover:shadow-lg hover:shadow-purple-200/50",
  },
  {
    name: "Home&Furniture",
    icon: "🏠",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-gradient-to-br from-emerald-100 to-teal-50",
    border: "border-emerald-300",
    text: "text-emerald-700",
    hover: "hover:shadow-lg hover:shadow-emerald-200/50",
  },
  {
    name: "Electronics",
    icon: "💻",
    gradient: "from-sky-400 to-blue-500",
    bg: "bg-gradient-to-br from-sky-100 to-blue-50",
    border: "border-sky-300",
    text: "text-sky-700",
    hover: "hover:shadow-lg hover:shadow-sky-200/50",
  },
  {
    name: "Fitness",
    icon: "💪",
    gradient: "from-violet-400 to-indigo-500",
    bg: "bg-gradient-to-br from-violet-100 to-indigo-50",
    border: "border-violet-300",
    text: "text-violet-700",
    hover: "hover:shadow-lg hover:shadow-violet-200/50",
  },
];

const STAT_CONFIGS = [
  {
    label: "Offers",
    icon: <HiOutlineGift size={20} />,
    color: "from-violet-500 to-purple-500",
    subtitle: "Available now",
  },
  {
    label: "Saved",
    icon: <HiOutlineHeart size={20} />,
    color: "from-rose-500 to-pink-500",
    subtitle: "Your favorites",
  },
  {
    label: "Alerts",
    icon: <HiOutlineBell size={20} />,
    color: "from-amber-500 to-orange-500",
    subtitle: "New updates",
  },
  {
    label: "Shops",
    icon: <RiStore2Line size={20} />,
    color: "from-emerald-500 to-teal-500",
    subtitle: "Near you",
  },
];

// ========== HELPER FUNCTIONS ==========

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const formatDate = (dateString) => {
  if (!dateString) return "Soon";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Soon";
  }
};

const getTimeRemaining = (endDate) => {
  if (!endDate) return "Soon";
  const end = new Date(endDate);
  const now = new Date();
  const diffHours = Math.ceil((end - now) / (1000 * 60 * 60));
  if (diffHours <= 0) return "Expired";
  if (diffHours === 1) return "1 hour";
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.ceil(diffHours / 24)}d`;
};

// ========== SUB-COMPONENTS ==========

// Glassmorphism Card
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/30 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
    <div className="relative">{children}</div>
  </div>
);

// Modern Stat Card
const ModernStatCard = ({ label, value, icon, color, subtitle }) => (
  <GlassCard className="p-4 sm:p-5">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-bold text-slate-900 truncate">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-[10px] text-slate-400">{subtitle}</p>
        )}
      </div>
      <div
        className={`rounded-xl bg-gradient-to-br ${color} p-2.5 text-white shadow-lg flex-shrink-0`}
      >
        {icon}
      </div>
    </div>
  </GlassCard>
);

// Modern Category Card
const ModernCategoryCard = ({
  name,
  icon,
  gradient,
  bg,
  border,
  text,
  hover,
  onClick,
  isActive,
}) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-3 transition-all duration-300 ${
      isActive
        ? `bg-gradient-to-br ${gradient} text-white shadow-lg shadow-violet-200`
        : `${bg} ${border} ${hover} shadow-sm`
    }`}
  >
    <div className="relative text-center">
      <div
        className={`text-2xl transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
      >
        {icon}
      </div>
      <span
        className={`mt-1 block text-[10px] sm:text-xs font-medium ${isActive ? "text-white" : text}`}
      >
        {name}
      </span>
    </div>
  </button>
);

// Premium Offer Card
const PremiumOfferCard = ({ offer, featured = false }) => (
  <div
    className={`group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/30 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/40 ${featured ? "ring-2 ring-violet-500/30" : ""}`}
  >
    {featured && (
      <div className="absolute top-3 right-3 z-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg">
        Featured
      </div>
    )}
    <div className="relative h-40 sm:h-48 overflow-hidden">
      <img
        src={
          offer.image ||
          "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600"
        }
        alt={offer.title || "Offer"}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) =>
          (e.target.src =
            "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600")
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {offer.discount && (
        <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg">
          {offer.discount}% OFF
        </div>
      )}
      <button className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-rose-500 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg">
        <HiOutlineHeart size={16} />
      </button>
      <div className="absolute bottom-3 left-3 right-3">
        <div className="flex items-center gap-1.5 text-white/90">
          <HiOutlineClock size={12} />
          <span className="text-[10px]">
            Valid until {formatDate(offer.endDate)}
          </span>
        </div>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-slate-800 line-clamp-1 text-sm sm:text-base">
        {offer.title || "Special Offer"}
      </h3>
      <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
        {offer.shop?.name || "Local Shop"}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-yellow-500">
            <HiOutlineStar size={14} className="fill-yellow-500" />
            <span className="text-xs font-medium text-slate-700">
              {offer.rating || "4.5"}
            </span>
          </div>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-[10px] text-slate-500">
            {offer.reviews || 12} reviews
          </span>
        </div>
        <Link
          to={`/customer/offers/${offer.id}`}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-200"
        >
          Claim
        </Link>
      </div>
    </div>
  </div>
);

// Minimal Compact Offer (Button BELOW text with proper left/right padding)
const MinimalCompactOffer = ({ offer, type }) => {
  const isEnding = type === "ending";
  return (
    <div className="group flex w-full flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-white p-3 border border-slate-100 shadow-md transition-all duration-300 hover:shadow-xl">
      {/* Top Section: Image & Text */}
      <div className="flex w-full min-w-0 items-center gap-3">
        {/* Image - NEVER shrinks */}
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl">
          <img
            src={
              offer.image ||
              "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=200"
            }
            alt={offer.title || "Offer"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) =>
              (e.target.src =
                "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=200")
            }
          />
          {isEnding && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent">
              <span className="text-xs font-bold text-white">⚡</span>
            </div>
          )}
        </div>

        {/* Text - Allows truncation */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <h4 className="font-semibold text-slate-800 truncate text-sm sm:text-base">
            {offer.title || "Special Offer"}
          </h4>
          <p
            className={`text-xs truncate ${isEnding ? "text-rose-500 font-medium" : "text-slate-500"}`}
          >
            {isEnding ? (
              <span className="flex items-center gap-1">
                <HiOutlineClock size={12} />
                {getTimeRemaining(offer.endDate)} left
              </span>
            ) : (
              offer.shop?.name || "Local Shop"
            )}
          </p>
        </div>
      </div>

      {/* Button - Full width on mobile, right aligned on desktop. Never hidden. */}
      <Link
        to={`/customer/offers/${offer.id}`}
        className={`w-full sm:w-auto flex-shrink-0 rounded-xl py-2 sm:py-2 sm:px-4 text-center text-xs font-semibold text-white transition-all duration-300 hover:scale-[1.02] ${isEnding ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-violet-600 to-purple-600"}`}
      >
        {isEnding ? "Grab" : "View"}
      </Link>
    </div>
  );
};

// Section Header
const SectionHeader = ({ title, icon, subtitle, link, linkText }) => (
  <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
    <div className="min-w-0">
      <h2 className="flex items-center gap-1.5 text-lg font-bold text-slate-800 truncate">
        {icon && <span className="text-lg">{icon}</span>}
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-slate-500 truncate">{subtitle}</p>
      )}
    </div>
    {link && (
      <Link
        to={link}
        className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-600 shadow-md border border-slate-100 hover:shadow-lg flex-shrink-0"
      >
        {linkText || "View All"} <HiOutlineChevronRight size={14} />
      </Link>
    )}
  </div>
);

// ========== MAIN COMPONENT ==========

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    customer: { name: "Customer", email: "", location: "" },
    stats: {
      availableOffers: 10,
      savedOffers: 6,
      notifications: 0,
      nearbyShops: 4,
    },
    trendingOffers: [],
    recommendedOffers: [],
    endingSoon: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getCustomerDashboard();
        if (response && response.data) {
          setData({
            customer: response.data.customer || {
              name: "Customer",
              email: "",
              location: "",
            },
            stats: response.data.stats || {
              availableOffers: 10,
              savedOffers: 6,
              notifications: 0,
              nearbyShops: 4,
            },
            trendingOffers: response.data.trendingOffers || [],
            recommendedOffers: response.data.recommendedOffers || [],
            endingSoon: response.data.endingSoon || [],
          });
        } else if (response) {
          setData({
            customer: response.customer || {
              name: "Customer",
              email: "",
              location: "",
            },
            stats: response.stats || {
              availableOffers: 10,
              savedOffers: 6,
              notifications: 0,
              nearbyShops: 4,
            },
            trendingOffers: response.trendingOffers || [],
            recommendedOffers: response.recommendedOffers || [],
            endingSoon: response.endingSoon || [],
          });
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const { customer, stats, trendingOffers, recommendedOffers, endingSoon } =
    data;

  const statValues = useMemo(
    () => [
      stats.availableOffers || 0,
      stats.savedOffers || 0,
      stats.notifications || 0,
      stats.nearbyShops || 0,
    ],
    [stats],
  );

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const query = searchQuery.trim();
      if (query)
        navigate(`/customer/offers?search=${encodeURIComponent(query)}`);
    },
    [searchQuery, navigate],
  );

  const handleCategoryClick = useCallback(
    (category) => {
      setActiveCategory(category);
      navigate(`/customer/offers?category=${encodeURIComponent(category)}`);
    },
    [navigate],
  );

  const handleLogout = useCallback(() => navigate("/login"), [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-16 sm:pb-20 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="fixed -top-40 -right-40 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl" />
      <div className="fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="relative pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-200">
                <div className="flex h-full w-full items-center justify-center text-white">
                  <HiOutlineSparkles size={24} />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-slate-900 truncate">
                  {getGreeting()}, {customer.name || "Customer"} 👋
                </h1>
                <p className="text-xs text-slate-500 truncate">
                  {customer.email || "Let's find you the best deals"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/customer/notifications"
                className="relative rounded-full bg-white p-2 shadow-md text-slate-600 border border-slate-100"
              >
                <HiOutlineBell size={20} />
                {stats.notifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[8px] font-bold text-white">
                    {stats.notifications}
                  </span>
                )}
              </Link>
              <Link
                to="/customer/profile"
                className="rounded-full bg-white p-2 shadow-md text-slate-600 border border-slate-100"
              >
                <HiOutlineCog6Tooth size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white p-2 shadow-md text-slate-600 border border-slate-100 hover:bg-rose-50"
              >
                <HiOutlineArrowRightOnRectangle size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection customer={customer} />

        {/* Search */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-4 sm:mb-6"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <HiOutlineMagnifyingGlass size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for deals, shops, or categories..."
              className="w-full rounded-full border-0 bg-white py-3 pl-11 pr-20 text-sm text-slate-800 shadow-lg shadow-slate-200/40 outline-none ring-1 ring-slate-100 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              Search
            </button>
          </form>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {STAT_CONFIGS.map((config, i) => (
            <ModernStatCard
              key={config.label}
              {...config}
              value={statValues[i] || 0}
            />
          ))}
        </motion.section>

        {/* Categories */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <SectionHeader
            title="Categories"
            subtitle="Explore by category"
            link="/customer/offers"
          />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <ModernCategoryCard
                key={cat.name}
                {...cat}
                onClick={() => handleCategoryClick(cat.name)}
                isActive={activeCategory === cat.name}
              />
            ))}
          </div>
        </motion.section>

        {/* Trending Offers */}
        {trendingOffers.length > 0 && (
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <SectionHeader
              title="Trending Now"
              subtitle="Most popular deals"
              link="/customer/offers"
              icon={<HiOutlineFire className="text-orange-500" />}
            />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {trendingOffers.slice(0, 3).map((offer, i) => (
                <PremiumOfferCard
                  key={offer.id || i}
                  offer={offer}
                  featured={i === 0}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recommended & Ending Soon */}
        {(recommendedOffers.length > 0 || endingSoon.length > 0) && (
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            {recommendedOffers.length > 0 && (
              <motion.section
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="min-w-0 overflow-hidden"
              >
                <SectionHeader
                  title="Recommended"
                  subtitle="Personalized for you"
                  link="/customer/offers"
                  icon={<HiOutlineSparkles className="text-violet-500" />}
                />
                <div className="space-y-3">
                  {recommendedOffers.slice(0, 4).map((offer, i) => (
                    <MinimalCompactOffer key={offer.id || i} offer={offer} />
                  ))}
                </div>
              </motion.section>
            )}

            {endingSoon.length > 0 && (
              <motion.section
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="min-w-0 overflow-hidden"
              >
                <SectionHeader
                  title="Ending Soon"
                  subtitle="Don't miss out!"
                  link="/customer/offers"
                  icon={<HiOutlineClock className="text-amber-500" />}
                />
                <div className="space-y-3">
                  {endingSoon.slice(0, 4).map((offer, i) => (
                    <MinimalCompactOffer
                      key={offer.id || i}
                      offer={offer}
                      type="ending"
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        )}

        {/* Location & Saved */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-5 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                <HiOutlineMapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Your Location</h3>
                <p className="text-sm text-white/70 truncate">
                  {customer.location || "Not set"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80">
              {customer.location
                ? "Showing the best offers around you"
                : "Set your location to find nearby offers"}
            </p>
            <Link
              to="/customer/profile"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-700 transition-all hover:scale-105 hover:shadow-xl"
            >
              {customer.location ? "Explore Nearby" : "Set Location"}{" "}
              <HiOutlineArrowRight size={14} />
            </Link>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-slate-800 text-base">
                  <HiOutlineHeart className="text-rose-500" size={18} /> Saved
                  Offers
                </h3>
                <p className="text-sm text-slate-500">
                  {stats.savedOffers || 0} offers saved
                </p>
              </div>
              <Link
                to="/customer/saved-offers"
                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-1 text-xs font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              >
                View All
              </Link>
            </div>
            {stats.savedOffers > 0 ? (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xs font-bold text-rose-600 shadow-md"
                    >
                      {getInitials(customer.name || "User")}
                    </div>
                  ))}
                  {stats.savedOffers > 3 && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-xs font-bold text-violet-600 shadow-md">
                      +{stats.savedOffers - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-500">Your favorites</span>
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-sm text-slate-500">No saved offers yet</p>
                <Link
                  to="/customer/offers"
                  className="mt-1 inline-block text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  Explore offers →
                </Link>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-6 sm:p-8 text-center text-white"
        >
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-3 inline-block rounded-full bg-white/20 p-3 backdrop-blur-sm">
              <HiOutlineShoppingBag size={28} />
            </div>
            <h2 className="text-2xl font-bold">Ready to Save More? 🎉</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-violet-100">
              Discover {stats.availableOffers || 0} verified offers from your
              favorite shops
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                to="/customer/offers"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-violet-700 transition-all hover:scale-105 hover:shadow-2xl"
              >
                Explore Offers
              </Link>
              <Link
                to="/customer/saved-offers"
                className="rounded-full border-2 border-white/30 px-6 py-2.5 text-sm font-semibold transition-all hover:bg-white/10 hover:scale-105"
              >
                My Favorites
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Dashboard;
