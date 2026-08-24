import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Using your actual file: smazeLogo.jpeg
import smazeLogo from "../../assets/icons/smazeLogo.jpeg";

import {
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineBell,
  HiBars3,
  HiOutlineXMark,
  HiOutlineChevronDown,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

import { getMyShop } from "../../services/shopService";
import { getUnreadCount } from "../../services/notificationService";
import toast from "react-hot-toast";
import { logoutUser } from "../../services/authService";

// ========== NAV LINKS ==========
const navLinks = [
  { name: "Dashboard", path: "/shop/dashboard", icon: HiOutlineHome },
  { name: "Add Offer", path: "/shop/add-offer", icon: HiOutlinePlusCircle },
  { name: "My Offers", path: "/shop/my-offers", icon: HiOutlineTag },
  { name: "Analytics", path: "/shop/analytics", icon: HiOutlineChartBar },
];

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

      {/* ✅ FIXED: Changed from sticky to fixed */}
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
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
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
                        <Icon
                          size={18}
                          className={
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-violet-600"
                          }
                        />
                        <span>{link.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
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

              {/* Mobile Hamburger */}
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

      {/* Mobile Slide-in Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-0 left-0 z-50 h-dvh w-72 max-w-[85vw] bg-white shadow-2xl md:hidden"
          >
            {/* Menu Header */}
            <div className="h-16 flex items-center justify-between border-b border-slate-100 px-5">
              <div className="flex items-center gap-2">
                <img
                  src={smazeLogo}
                  alt="Smaze Logo"
                  className="h-8 w-8 rounded-full object-cover border border-violet-200"
                />
                <span className="text-xl font-bold text-slate-800">Smaze</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100"
                aria-label="Close menu"
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="h-[calc(100dvh-64px)] overflow-y-auto p-4 space-y-1">
              {/* Shop Info */}
              <div className="flex items-center gap-3 p-3 mb-2 bg-violet-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {getInitials(shop?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-slate-800 truncate">
                    {shop?.name || "No Shop Yet"}
                  </span>
                  <span className="text-xs text-slate-500">Merchant</span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Active
                </span>
              </div>

              {/* Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                        isActive
                          ? "text-violet-600 bg-violet-50"
                          : "text-slate-600 hover:bg-violet-50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={20}
                          className={
                            isActive ? "text-violet-600" : "text-slate-400"
                          }
                        />
                        <span className="flex-1">{link.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}

              <div className="my-3 border-t border-slate-100" />

              {/* Profile & Logout */}
              <Link
                to="/shop/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-violet-50"
              >
                <HiOutlineUser size={18} /> Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-500 hover:bg-rose-50"
              >
                <HiArrowRightOnRectangle size={18} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ✅ NAVBAR SPACER - This prevents content from hiding behind the fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default ShopNavbar;
