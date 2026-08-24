import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineChevronDown,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

import { getMyShop } from "../services/shopService";
import { getUnreadCount } from "../services/notificationService";
import toast from "react-hot-toast";
import { logoutUser } from "../services/authService";

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

  // ===============================
  // Load Shop
  // ===============================
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

  // ===============================
  // Handle Scroll Effect
  // ===============================
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===============================
  // Fetch Unread Count
  // ===============================
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
      {/* ===== MOBILE MENU OVERLAY ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50"
            : "bg-white shadow-md border-b border-slate-200"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo & Shop Name */}
            <div className="flex items-center gap-3">
              {/* Logo */}
              <Link
                to="/shop/dashboard"
                className="flex items-center gap-2 group shrink-0"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200">
                  <span className="text-lg font-black">S</span>
                </div>
                <span className="hidden sm:block text-xl font-extrabold tracking-tight">
                  <span className="text-slate-800">Sm</span>
                  <span className="text-violet-600">aze</span>
                </span>
              </Link>

              {/* Divider */}
              <div className="hidden h-6 w-px bg-slate-200 sm:block"></div>

              {/* Shop Name (Center) */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base sm:text-lg font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-[200px]">
                  {shop?.name || "Shop"}
                </span>
                {shop && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Center: Desktop Navigation */}
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

            {/* Right: Notifications & Profile */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Link
                to="/shop/notifications"
                className="relative rounded-full p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
              >
                <HiOutlineBell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-rose-200">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Desktop Profile Dropdown */}
              <div className="hidden md:relative md:block">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 p-1 pr-2 transition hover:shadow-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-bold text-white">
                    {getInitials(shop?.name)}
                  </div>
                  <HiOutlineChevronDown
                    size={14}
                    className={`text-slate-500 transition-transform ${
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
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800">
                          {shop?.name || "Shop"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Merchant Account
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => navigate("/shop/profile")}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-violet-50"
                        >
                          <HiOutlineUser size={18} /> Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                        >
                          <HiArrowRightOnRectangle size={18} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-600 md:hidden"
              >
                <HiOutlineBars3 size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE SLIDE-IN SIDEBAR ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl md:hidden"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold">
                  S
                </div>
                <span className="text-lg font-extrabold">
                  <span className="text-slate-800">Sm</span>
                  <span className="text-violet-600">aze</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <HiOutlineXMark size={22} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                          : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={20}
                          className={isActive ? "text-white" : "text-slate-400"}
                        />
                        <span>{link.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}

              <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                <Link
                  to="/shop/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <HiOutlineBell size={20} />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/shop/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <HiOutlineUser size={20} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                >
                  <HiArrowRightOnRectangle size={20} />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShopNavbar;
