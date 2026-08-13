import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineBars3,
  HiOutlineXMark,
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
  // Fetch Unread Count (with debug)
  // ===============================
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadCount();
        console.log("🔔 Unread count from API:", data.count);
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();

    // Auto-refresh every 15 seconds (more frequent)
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  // Get shop initials for avatar
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
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-slate-200/50"
            : "bg-white shadow-md border-b border-slate-200"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              to="/shop/dashboard"
              className="flex items-center gap-2 group"
            >
              <div className="rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 p-1.5 text-white">
                <span className="font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-extrabold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                  S
                </span>
                <span className="text-slate-800">maze</span>
              </span>
              <span className="hidden sm:inline-block text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Shop
              </span>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Link
                to="/shop/notifications"
                className="relative rounded-full p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
                onClick={() => {
                  // Refresh count when clicking the bell
                  getUnreadCount()
                    .then((data) => {
                      setUnreadCount(data.count || 0);
                    })
                    .catch((err) => console.error(err));
                }}
              >
                <HiOutlineBell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-rose-200">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="hidden md:flex items-center gap-3">
                <div className="h-px w-6 bg-slate-200 rotate-90"></div>
                <Link
                  to="/shop/profile"
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 p-1 pr-3 transition hover:shadow-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-bold text-white">
                    {getInitials(shop?.name)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">
                    {shop?.name || "Shop"}
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-600 md:hidden"
              >
                {mobileMenuOpen ? (
                  <HiOutlineXMark size={24} />
                ) : (
                  <HiOutlineBars3 size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden"
        >
          <div className="border-t border-slate-200 bg-white px-4 py-3 space-y-1">
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

            <div className="border-t border-slate-200 pt-3 mt-2">
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
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </nav>
    </>
  );
};

export default ShopNavbar;
