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
  HiOutlineChartBar,
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
const GlassCard = ({ children, className = "", hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -4, scale: 1.01 } : {}}
    className={`relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/30 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
    <div className="relative">{children}</div>
  </motion.div>
);

// Modern Stat Card
const ModernStatCard = ({ label, value, icon, color, subtitle }) => (
  <GlassCard className="p-5 md:p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-[10px] sm:text-xs text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      <div
        className={`rounded-2xl bg-gradient-to-br ${color} p-2.5 sm:p-3 text-white shadow-lg flex-shrink-0`}
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
  <motion.button
    whileHover={{ y: -4, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl p-3 sm:p-4 transition-all duration-300 ${
      isActive
        ? `bg-gradient-to-br ${gradient} text-white shadow-lg shadow-violet-200`
        : `${bg} ${border} ${hover} shadow-sm`
    }`}
  >
    <div className="relative text-center">
      <div
        className={`text-2xl sm:text-3xl transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
      >
        {icon}
      </div>
      <span
        className={`mt-1 sm:mt-2 block text-xs sm:text-sm font-medium ${isActive ? "text-white" : text}`}
      >
        {name}
      </span>
    </div>
    {isActive && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
    )}
  </motion.button>
);

// Premium Offer Card
const PremiumOfferCard = ({ offer, featured = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8 }}
    className={`group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/30 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/40 ${
      featured ? "ring-2 ring-violet-500/30" : ""
    }`}
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
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              {offer.rating || "4.5"}
            </span>
          </div>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-[10px] sm:text-xs text-slate-500">
            {offer.reviews || 12} reviews
          </span>
        </div>
        <Link
          to={`/customer/offers/${offer.id}`}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-200"
        >
          Claim
        </Link>
      </div>
    </div>
  </motion.div>
);

// Minimal Compact Offer
// Minimal Compact Offer (FIXED - Buttons always visible on mobile)
const MinimalCompactOffer = ({ offer, type }) => {
  const isEnding = type === "ending";
  return (
    <div className="group flex w-full items-center gap-3 rounded-xl bg-white p-3 border border-slate-100 shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden">
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

      <Link
        to={`/customer/offers/${offer.id}`}
        className={`flex-shrink-0 rounded-xl px-3 sm:px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 ${isEnding ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-violet-600 to-purple-600"}`}
      >
        {isEnding ? "Grab" : "View"}
      </Link>
    </div>
  );
};

// Section Header
const SectionHeader = ({ title, icon, subtitle, link, linkText }) => (
  <div className="mb-3 sm:mb-4 flex items-center justify-between">
    <div>
      <h2 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-bold text-slate-800">
        {icon && <span className="text-lg sm:text-xl">{icon}</span>}
        {title}
      </h2>
      {subtitle && (
        <p className="text-[10px] sm:text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
    {link && (
      <Link
        to={link}
        className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-violet-600 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl border border-white/50"
      >
        {linkText || "View All"} <HiOutlineChevronRight size={12} />
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

  // Fetch dashboard data
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
          // If response doesn't have data property
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
        } else {
          // Use fallback data if response is empty
          console.warn("Using fallback dashboard data");
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
        // Keep using the fallback data from initial state
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const { customer, stats, trendingOffers, recommendedOffers, endingSoon } =
    data;

  // Memoized stat values
  const statValues = useMemo(
    () => [
      stats.availableOffers || 0,
      stats.savedOffers || 0,
      stats.notifications || 0,
      stats.nearbyShops || 0,
    ],
    [stats],
  );

  // Search handler - FIXED
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const query = searchQuery.trim();
      console.log("🔍 Searching for:", query);
      if (query) {
        navigate(`/customer/offers?search=${encodeURIComponent(query)}`);
      }
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

  const handleLogout = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  // Loading state
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-16 sm:pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed -top-40 -right-40 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl" />
      <div className="fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-200/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <header className="relative pt-4 sm:pt-6 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 p-0.5 shadow-lg shadow-violet-200">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/10 text-base sm:text-xl font-bold text-white backdrop-blur-sm">
                    {getInitials(customer.name)}
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-emerald-500 p-0.5 ring-2 ring-white">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  {getGreeting()}, {customer.name || "Customer"} 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 truncate max-w-[180px] sm:max-w-none">
                  {customer.email || "Let's find you the best deals"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/customer/notifications"
                className="relative rounded-full bg-white/80 backdrop-blur-xl p-2 sm:p-2.5 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl border border-white/50"
              >
                <HiOutlineBell
                  size={18}
                  className="sm:w-5 sm:h-5 text-slate-600"
                />
                {stats.notifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[8px] sm:text-[10px] font-bold text-white shadow-lg shadow-rose-200">
                    {stats.notifications}
                  </span>
                )}
              </Link>
              <Link
                to="/customer/profile"
                className="rounded-full bg-white/80 backdrop-blur-xl p-2 sm:p-2.5 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl border border-white/50"
              >
                <HiOutlineCog6Tooth
                  size={18}
                  className="sm:w-5 sm:h-5 text-slate-600"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white/80 backdrop-blur-xl p-2 sm:p-2.5 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl border border-white/50 hover:bg-rose-50"
              >
                <HiOutlineArrowRightOnRectangle
                  size={18}
                  className="sm:w-5 sm:h-5 text-slate-600"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection customer={customer} />

        {/* Search - FIXED with proper form handling */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-4 sm:mb-6"
        >
          <form onSubmit={handleSearch} className="relative" role="search">
            <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <HiOutlineMagnifyingGlass
                size={16}
                className="sm:w-[18px] sm:h-[18px]"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for deals, shops, or categories..."
              className="w-full rounded-full border-0 bg-white/80 backdrop-blur-xl py-2.5 sm:py-3 pl-9 sm:pl-11 pr-24 sm:pr-32 text-xs sm:text-sm text-slate-800 shadow-lg shadow-slate-200/30 outline-none ring-1 ring-white/50 transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
              aria-label="Search for deals, shops, or categories"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-3 sm:px-5 py-1 sm:py-1.5 text-[10px] sm:text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-200"
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
          className="mb-4 sm:mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
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
          className="mb-4 sm:mb-6"
        >
          <SectionHeader
            title="Categories"
            subtitle="Explore by category"
            link="/customer/offers"
          />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
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
            className="mb-4 sm:mb-6"
          >
            <SectionHeader
              title="Trending Now"
              subtitle="Most popular deals"
              link="/customer/offers"
              icon={<HiOutlineFire className="text-orange-500" />}
            />
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mb-4 sm:mb-6 grid gap-4 sm:gap-6 lg:grid-cols-2">
            {recommendedOffers.length > 0 && (
              <motion.section
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <SectionHeader
                  title="Recommended"
                  subtitle="Personalized for you"
                  link="/customer/offers"
                  icon={<HiOutlineSparkles className="text-violet-500" />}
                />
                <div className="space-y-2">
                  {recommendedOffers.slice(0, 3).map((offer, i) => (
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
              >
                <SectionHeader
                  title="Ending Soon"
                  subtitle="Don't miss out!"
                  link="/customer/offers"
                  icon={<HiOutlineClock className="text-amber-500" />}
                />
                <div className="space-y-2">
                  {endingSoon.slice(0, 3).map((offer, i) => (
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
        <div className="mb-4 sm:mb-6 grid gap-4 sm:gap-6 lg:grid-cols-2">
          <GlassCard className="p-5 sm:p-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="rounded-xl bg-white/20 p-2 sm:p-2.5 backdrop-blur-sm">
                <HiOutlineMapPin
                  size={18}
                  className="sm:w-[22px] sm:h-[22px]"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  Your Location
                </h3>
                <p className="text-xs sm:text-sm text-white/70 truncate max-w-[150px] sm:max-w-none">
                  {customer.location || "Not set"}
                </p>
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/80">
              {customer.location
                ? "Showing the best offers around you"
                : "Set your location to find nearby offers"}
            </p>
            <Link
              to="/customer/profile"
              className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-violet-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {customer.location ? "Explore Nearby" : "Set Location"}{" "}
              <HiOutlineArrowRight size={14} />
            </Link>
          </GlassCard>

          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-1.5 sm:gap-2 font-bold text-slate-800 text-sm sm:text-base">
                  <HiOutlineHeart className="text-rose-500" size={18} /> Saved
                  Offers
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  {stats.savedOffers || 0} offers saved
                </p>
              </div>
              <Link
                to="/customer/saved-offers"
                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-200"
              >
                View All
              </Link>
            </div>
            {stats.savedOffers > 0 ? (
              <div className="mt-3 sm:mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-rose-600 shadow-md"
                    >
                      {getInitials(customer.name || "User")}
                    </div>
                  ))}
                  {stats.savedOffers > 3 && (
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-[10px] sm:text-xs font-bold text-violet-600 shadow-md">
                      +{stats.savedOffers - 3}
                    </div>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500">
                  Your favorites
                </span>
              </div>
            ) : (
              <div className="mt-3 sm:mt-4 rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs sm:text-sm text-slate-500">
                  No saved offers yet
                </p>
                <Link
                  to="/customer/offers"
                  className="mt-1 inline-block text-[10px] sm:text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  Explore offers →
                </Link>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Recent Activity */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-4 sm:mb-6"
        >
          <GlassCard className="p-5 sm:p-6">
            <SectionHeader
              title="Recent Activity"
              subtitle="Your latest interactions"
              link="/customer/activity"
              icon={<HiOutlineChartBar className="text-emerald-500" />}
              linkText="View History"
            />
            <div className="space-y-2">
              {[
                {
                  icon: "👀",
                  text: `You viewed ${trendingOffers.length || 0} new offers`,
                  time: "Just now",
                  gradient: "from-violet-50 to-purple-50",
                },
                {
                  icon: "❤️",
                  text: `You have ${stats.savedOffers || 0} saved offers`,
                  time: "Today",
                  gradient: "from-rose-50 to-pink-50",
                },
                {
                  icon: "🔔",
                  text: `${stats.notifications || 0} new notifications`,
                  time: "Recent",
                  gradient: "from-amber-50 to-orange-50",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-2 sm:gap-3 rounded-xl bg-gradient-to-r ${item.gradient} p-2.5 sm:p-3 transition-all duration-300`}
                >
                  <span className="text-lg sm:text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                      {item.text}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">
                      {item.time}
                    </p>
                  </div>
                  <HiOutlineChevronRight
                    className="text-slate-400 flex-shrink-0"
                    size={14}
                  />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-6 sm:p-8 text-center text-white"
        >
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="mx-auto mb-2 sm:mb-3 inline-block rounded-full bg-white/20 p-2.5 sm:p-3 backdrop-blur-sm"
            >
              <HiOutlineShoppingBag
                size={24}
                className="sm:w-[32px] sm:h-[32px]"
              />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Ready to Save More? 🎉
            </h2>
            <p className="mx-auto mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm text-violet-100">
              Discover {stats.availableOffers || 0} verified offers from your
              favorite shops
            </p>
            <div className="mt-3 sm:mt-5 flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link
                to="/customer/offers"
                className="rounded-full bg-white px-4 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold text-violet-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Explore Offers
              </Link>
              <Link
                to="/customer/saved-offers"
                className="rounded-full border-2 border-white/30 px-4 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:scale-105"
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
