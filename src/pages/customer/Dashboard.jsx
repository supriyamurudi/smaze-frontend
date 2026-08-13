import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineGift,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineStar,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRight,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineSparkles,
  HiOutlineShoppingBag,
  HiOutlineChartBar,
} from "react-icons/hi2";

import { getCustomerDashboard } from "../../services/customerService";

// ========== COMPONENTS ==========

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
const ModernStatCard = ({ label, value, icon, color, trend, subtitle }) => (
  <GlassCard className="p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                trend > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        )}
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div
        className={`rounded-2xl bg-gradient-to-br ${color} p-3 text-white shadow-lg`}
      >
        {icon}
      </div>
    </div>
    <div
      className={`absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl`}
    />
  </GlassCard>
);

// Modern Quick Action
const ModernQuickAction = ({
  title,
  subtitle,
  path,
  icon,
  gradient,
  color,
}) => (
  <motion.div whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
    <Link to={path} className="block">
      <GlassCard className="p-5 text-center hover:border-violet-200/50 transition-all duration-300">
        <div
          className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-3 text-white shadow-lg shadow-${color}-200/50`}
        >
          {icon}
        </div>
        <h3 className="mt-3 font-semibold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </GlassCard>
    </Link>
  </motion.div>
);

// Modern Category Card
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
    className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
      isActive
        ? `bg-gradient-to-br ${gradient} text-white shadow-lg shadow-violet-200`
        : `${bg} ${border} ${hover} shadow-sm`
    }`}
  >
    <div className="relative text-center">
      <div
        className={`text-3xl transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
      >
        {icon}
      </div>
      <span
        className={`mt-2 block text-sm font-medium ${
          isActive ? "text-white" : text
        }`}
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
const PremiumOfferCard = ({ offer, featured = false }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/30 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/40 ${
        featured ? "ring-2 ring-violet-500/30" : ""
      }`}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          Featured
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
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
          <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            {offer.discount}% OFF
          </div>
        )}
        <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-rose-500 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg">
          <HiOutlineHeart size={18} />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-white/90">
            <HiOutlineClock size={14} />
            <span className="text-xs">
              Valid until {formatDate(offer.endDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-800 line-clamp-1">
          {offer.title || "Special Offer"}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {offer.shop?.name || "Local Shop"}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-yellow-500">
              <HiOutlineStar size={16} className="fill-yellow-500" />
              <span className="text-sm font-medium text-slate-700">
                {offer.rating || "4.5"}
              </span>
            </div>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">
              {offer.reviews || 12} reviews
            </span>
          </div>
          <Link
            to={`/customer/offers/${offer.id}`}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-200"
          >
            Claim
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Minimal Compact Offer
const MinimalCompactOffer = ({ offer, type }) => {
  const isEnding = type === "ending";
  const getHoursRemaining = () => {
    if (!offer.endDate) return "Soon";
    const end = new Date(offer.endDate);
    const now = new Date();
    const diffHours = Math.ceil((end - now) / (1000 * 60 * 60));
    if (diffHours <= 0) return "Expired";
    if (diffHours === 1) return "1 hour";
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.ceil(diffHours / 24)}d`;
  };

  return (
    <motion.div
      whileHover={{ x: 4, scale: 1.01 }}
      className="group flex items-center gap-4 rounded-xl bg-white/70 backdrop-blur-xl p-3 border border-white/50 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
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
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 truncate text-sm">
          {offer.title || "Special Offer"}
        </h4>
        <p
          className={`text-xs ${isEnding ? "text-rose-500 font-medium" : "text-slate-500"}`}
        >
          {isEnding ? (
            <span className="flex items-center gap-1">
              <HiOutlineClock size={12} />
              {getHoursRemaining()} left
            </span>
          ) : (
            offer.shop?.name || "Local Shop"
          )}
        </p>
      </div>
      <Link
        to={`/customer/offers/${offer.id}`}
        className={`rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 ${
          isEnding
            ? "bg-gradient-to-r from-amber-500 to-orange-500"
            : "bg-gradient-to-r from-violet-600 to-purple-600"
        }`}
      >
        {isEnding ? "Grab" : "View"}
      </Link>
    </motion.div>
  );
};

// Section Header
const SectionHeader = ({ title, icon, subtitle, link, linkText }) => (
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
        {icon && <span className="text-xl">{icon}</span>}
        {title}
      </h2>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
    {link && (
      <Link
        to={link}
        className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-xl px-3 py-1.5 text-xs font-semibold text-violet-600 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl border border-white/50"
      >
        {linkText || "View All"} <HiOutlineChevronRight size={14} />
      </Link>
    )}
  </div>
);

// ========== HELPERS ==========

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

// ========== DATA ==========

const QUICK_ACTIONS = [
  {
    title: "Explore",
    subtitle: "Find deals",
    path: "/customer/offers",
    icon: <HiOutlineGift size={20} />,
    gradient: "from-violet-500 to-purple-500",
    color: "violet",
  },
  {
    title: "Favorites",
    subtitle: "Saved offers",
    path: "/customer/saved-offers",
    icon: <HiOutlineHeart size={20} />,
    gradient: "from-rose-500 to-pink-500",
    color: "rose",
  },
  {
    title: "Alerts",
    subtitle: "Notifications",
    path: "/customer/notifications",
    icon: <HiOutlineBell size={20} />,
    gradient: "from-amber-500 to-orange-500",
    color: "amber",
  },
  {
    title: "Profile",
    subtitle: "Settings",
    path: "/customer/profile",
    icon: <HiOutlineUser size={20} />,
    gradient: "from-emerald-500 to-teal-500",
    color: "emerald",
  },
];

const CATEGORIES = [
  {
    name: "Food",
    icon: "🍽️",
    gradient: "from-orange-400 to-amber-500",
    bg: "bg-gradient-to-br from-orange-100 to-amber-50",
    border: "border-orange-300",
    text: "text-orange-700",
    hover: "hover:shadow-lg hover:shadow-orange-200/50",
    activeBg: "bg-gradient-to-br from-orange-500 to-amber-600",
  },
  {
    name: "Fashion",
    icon: "👗",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-gradient-to-br from-rose-100 to-pink-50",
    border: "border-rose-300",
    text: "text-rose-700",
    hover: "hover:shadow-lg hover:shadow-rose-200/50",
    activeBg: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
  {
    name: "Beauty",
    icon: "💄",
    gradient: "from-purple-400 to-fuchsia-500",
    bg: "bg-gradient-to-br from-purple-100 to-fuchsia-50",
    border: "border-purple-300",
    text: "text-purple-700",
    hover: "hover:shadow-lg hover:shadow-purple-200/50",
    activeBg: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
  },
  {
    name: "Grocery",
    icon: "🛒",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-gradient-to-br from-emerald-100 to-teal-50",
    border: "border-emerald-300",
    text: "text-emerald-700",
    hover: "hover:shadow-lg hover:shadow-emerald-200/50",
    activeBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
  {
    name: "Tech",
    icon: "💻",
    gradient: "from-sky-400 to-blue-500",
    bg: "bg-gradient-to-br from-sky-100 to-blue-50",
    border: "border-sky-300",
    text: "text-sky-700",
    hover: "hover:shadow-lg hover:shadow-sky-200/50",
    activeBg: "bg-gradient-to-br from-sky-500 to-blue-600",
  },
  {
    name: "Fitness",
    icon: "💪",
    gradient: "from-violet-400 to-indigo-500",
    bg: "bg-gradient-to-br from-violet-100 to-indigo-50",
    border: "border-violet-300",
    text: "text-violet-700",
    hover: "hover:shadow-lg hover:shadow-violet-200/50",
    activeBg: "bg-gradient-to-br from-violet-500 to-indigo-600",
  },
];

const STAT_CONFIGS = [
  {
    label: "Offers",
    icon: <HiOutlineGift size={20} />,
    color: "from-violet-500 to-purple-500",
    trend: 12,
    subtitle: "Available now",
  },
  {
    label: "Saved",
    icon: <HiOutlineHeart size={20} />,
    color: "from-rose-500 to-pink-500",
    trend: 8,
    subtitle: "Your favorites",
  },
  {
    label: "Alerts",
    icon: <HiOutlineBell size={20} />,
    color: "from-amber-500 to-orange-500",
    trend: 5,
    subtitle: "New updates",
  },
  {
    label: "Shops",
    icon: <HiOutlineMapPin size={20} />,
    color: "from-emerald-500 to-teal-500",
    trend: 3,
    subtitle: "Near you",
  },
];

// ========== MAIN COMPONENT ==========

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    customer: { name: "Customer", email: "", location: "" },
    stats: {
      availableOffers: 0,
      savedOffers: 0,
      notifications: 0,
      nearbyShops: 0,
    },
    trendingOffers: [],
    recommendedOffers: [],
    endingSoon: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getCustomerDashboard();
        setData({
          customer: response.customer || {
            name: "Customer",
            email: "",
            location: "",
          },
          stats: response.stats || {
            availableOffers: 0,
            savedOffers: 0,
            notifications: 0,
            nearbyShops: 0,
          },
          trendingOffers: response.trendingOffers || [],
          recommendedOffers: response.recommendedOffers || [],
          endingSoon: response.endingSoon || [],
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    };
    fetchDashboard();
  }, []);

  const { customer, stats, trendingOffers, recommendedOffers, endingSoon } =
    data;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    navigate(`/customer/offers?search=${encodeURIComponent(searchQuery)}`);
    setIsSearching(false);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    navigate(`/customer/offers?category=${encodeURIComponent(category)}`);
  };

  const statValues = [
    stats.availableOffers || 0,
    stats.savedOffers || 0,
    stats.notifications || 0,
    stats.nearbyShops || 0,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
      {/* Decorative Elements */}
      <div className="fixed -top-40 -right-40 h-96 w-96 rounded-full bg-violet-200/20 blur-3xl" />
      <div className="fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="relative pt-6 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 p-0.5 shadow-lg shadow-violet-200">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-white backdrop-blur-sm">
                    {getInitials(customer.name)}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5 ring-2 ring-white">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {getGreeting()}, {customer.name || "Customer"} 👋
                </h1>
                <p className="text-sm text-slate-500">
                  {customer.email || "Let's find you the best deals"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/customer/notifications"
                className="relative rounded-full bg-white/80 backdrop-blur-xl p-2.5 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl border border-white/50"
              >
                <HiOutlineBell size={20} className="text-slate-600" />
                {stats.notifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-rose-200">
                    {stats.notifications}
                  </span>
                )}
              </Link>
              <Link
                to="/customer/profile"
                className="rounded-full bg-white/80 backdrop-blur-xl p-2.5 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl border border-white/50"
              >
                <HiOutlineCog6Tooth size={20} className="text-slate-600" />
              </Link>
            </div>
          </div>
        </header>

        {/* Search */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <HiOutlineMagnifyingGlass size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for deals, shops, or categories..."
              className="w-full rounded-full border-0 bg-white/80 backdrop-blur-xl py-3 pl-11 pr-32 text-sm text-slate-800 shadow-lg shadow-slate-200/30 outline-none ring-1 ring-white/50 transition-all duration-300 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-200 disabled:opacity-50"
            >
              {isSearching ? "..." : "Search"}
            </button>
          </form>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {STAT_CONFIGS.map((config, i) => (
            <ModernStatCard
              key={config.label}
              {...config}
              value={statValues[i]}
            />
          ))}
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <SectionHeader
            title="Quick Actions"
            subtitle="Your shortcuts to savings"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <ModernQuickAction key={action.title} {...action} />
            ))}
          </div>
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
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                <HiOutlineMapPin size={22} />
              </div>
              <div>
                <h3 className="font-bold">Your Location</h3>
                <p className="text-sm text-white/70">
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
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-violet-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {customer.location ? "Explore Nearby" : "Set Location"}{" "}
              <HiOutlineArrowRight size={14} />
            </Link>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-slate-800">
                  <HiOutlineHeart className="text-rose-500" /> Saved Offers
                </h3>
                <p className="text-sm text-slate-500">
                  {stats.savedOffers || 0} offers saved
                </p>
              </div>
              <Link
                to="/customer/saved-offers"
                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-1.5 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-200"
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

        {/* Recent Activity */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
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
                  text: `You viewed ${trendingOffers.length} new offers`,
                  time: "Just now",
                  gradient: "from-violet-50 to-purple-50",
                },
                {
                  icon: "❤️",
                  text: `You have ${stats.savedOffers} saved offers`,
                  time: "Today",
                  gradient: "from-rose-50 to-pink-50",
                },
                {
                  icon: "🔔",
                  text: `${stats.notifications} new notifications`,
                  time: "Recent",
                  gradient: "from-amber-50 to-orange-50",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 rounded-xl bg-gradient-to-r ${item.gradient} p-3 transition-all duration-300`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {item.text}
                    </p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                  <HiOutlineChevronRight className="text-slate-400" size={16} />
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
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 p-8 text-center text-white"
        >
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="mx-auto mb-3 inline-block rounded-full bg-white/20 p-3 backdrop-blur-sm"
            >
              <HiOutlineShoppingBag size={32} />
            </motion.div>
            <h2 className="text-2xl font-bold">Ready to Save More? 🎉</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-violet-100">
              Discover {stats.availableOffers || 0} verified offers from your
              favorite shops
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                to="/customer/offers"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-violet-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Explore Offers
              </Link>
              <Link
                to="/customer/saved-offers"
                className="rounded-full border-2 border-white/30 px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:scale-105"
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
