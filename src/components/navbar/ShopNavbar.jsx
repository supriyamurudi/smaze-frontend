// frontend/src/components/navbar/ShopNavbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Using your actual file: smazeLogo.jpeg
import smazeLogo from "../../assets/icons/smazeLogo.jpeg";

import {
  HiOutlineUser,
  HiOutlineBell,
  HiBars3,
  HiOutlineChevronDown,
  HiArrowRightOnRectangle,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineTag,
  HiOutlineChartBar,
  NavLink,
} from "react-icons/hi2";

import { getMyShop } from "../../services/shopService";
import { getUnreadCount } from "../../services/notificationService";
import toast from "react-hot-toast";
import { logoutUser } from "../../services/authService";

// ✅ IMPORT THE SHOP SIDEBAR
import ShopSidebar from "../ShopSidebar";

// ========== MAIN COMPONENT ==========
const ShopNavbar = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Load Shop
  useEffect(() => {
    const loadShop = async () => {
      try {
        const res = await getMyShop();
        setShop(res.shop);
      } catch (err) {
        if (err.response?.status === 404) {
          setShop(null);
        } else {
          console.error(err);
        }
      }
    };

    loadShop();
  }, []);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Unread Count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadCount();
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Fixed Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-100"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* ========== LEFT: Smaze Logo & Name ========== */}
            <Link
              to="/shop/dashboard"
              className="flex items-center gap-2 shrink-0"
            >
              <img
                src={smazeLogo}
                alt="Smaze Logo"
                className="h-10 w-10 rounded-full object-cover border border-violet-200 shadow-sm"
              />

              <span className="text-xl sm:text-3xl font-black tracking-tight whitespace-nowrap">
                <span className="text-purple-600">S</span>
                <span className="text-gray-900">maze</span>
              </span>

              <span className="hidden sm:block text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Shop
              </span>
            </Link>

            {/* ========== CENTER: Desktop Navigation ========== */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink
                to="/shop/dashboard"
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <HiOutlineHome
                      size={18}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-violet-600"
                      }
                    />
                    <span>Dashboard</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/shop/add-offer"
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <HiOutlinePlusCircle
                      size={18}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-violet-600"
                      }
                    />
                    <span>Add Offer</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/shop/my-offers"
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <HiOutlineTag
                      size={18}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-violet-600"
                      }
                    />
                    <span>My Offers</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/shop/analytics"
                className={({ isActive }) =>
                  `group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <HiOutlineChartBar
                      size={18}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-violet-600"
                      }
                    />
                    <span>Analytics</span>
                  </>
                )}
              </NavLink>
            </div>

            {/* ========== RIGHT: Notifications & Profile ========== */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Notifications */}
              <Link
                to="/shop/notifications"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition"
              >
                <HiOutlineBell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Desktop Profile Dropdown */}
              <div className="hidden md:relative md:block">
                <button
                  type="button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(shop?.name)}
                  </div>
                  <span className="hidden xl:block text-sm font-medium text-slate-700 max-w-20 truncate">
                    {shop?.name || "Shop"}
                  </span>
                  <HiOutlineChevronDown
                    size={14}
                    className={`hidden xl:block text-slate-400 transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">
                          {shop?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Merchant Account
                        </p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/shop/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-violet-50"
                        >
                          <HiOutlineUser size={18} /> Profile
                        </Link>
                        <Link
                          to="/shop/settings"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-violet-50"
                        >
                          <HiOutlineCog6Tooth size={18} /> Settings
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50"
                        >
                          <HiArrowRightOnRectangle size={18} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ✅ Mobile Hamburger - Now opens ShopSidebar */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition active:scale-95"
                aria-label="Open menu"
              >
                <HiBars3 size={26} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Slide-in Sidebar - Using ShopSidebar component */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-0 left-0 z-50 h-dvh w-80 max-w-[85vw] shadow-2xl md:hidden"
          >
            <ShopSidebar onClose={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ NAVBAR SPACER - This prevents content from hiding behind the fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default ShopNavbar;
