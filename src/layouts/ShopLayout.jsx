// frontend/src/layouts/ShopLayout.jsx
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiArrowRightOnRectangle,
  HiOutlineBars3,
} from "react-icons/hi2";

import ShopSidebar from "../components/ShopSidebar";
import { getMyShop } from "../services/shopService";
import { getUnreadCount } from "../services/notificationService";
import toast from "react-hot-toast";
import { logoutUser } from "../services/authService";

// ========== CONTENT SKELETON LOADER ==========
const ContentSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] rounded-3xl bg-white p-4 shadow-sm border border-slate-200 sm:p-5 md:p-7">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="mt-2 h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="mt-4 md:mt-0 h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="mt-4 h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
              <div className="mt-1 h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid gap-3 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-slate-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>

        {/* Recent Offers Table Skeleton */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
            <div className="mt-1 h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="divide-y divide-slate-100">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-5"
              >
                <div>
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
                  <div className="mt-1 h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MOBILE SIDEBAR ==========
const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />

          {/* Slide-in Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden"
          >
            <ShopSidebar isMobile onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ========== MAIN COMPONENT ==========
const ShopLayout = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadShop = async () => {
      try {
        setLoading(true);
        const res = await getMyShop();
        setShop(res.shop);
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 400) {
          setShop(null);
          const currentPath = window.location.pathname;
          if (currentPath !== "/shop/create-shop") {
            navigate("/shop/create-shop", { replace: true });
          }
        } else {
          console.error("Failed to load shop:", error);
          toast.error("Failed to load shop data");
        }
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [navigate]);

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
    const interval = setInterval(fetchUnreadCount, 30000);
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Desktop Sidebar (Always visible) */}
      <div className="hidden lg:block">
        <ShopSidebar />
      </div>

      {/* Main Content Area (Pushed right on desktop) */}
      <div className="flex-1 lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 md:px-8">
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-600 lg:hidden"
              >
                <HiOutlineBars3 size={24} />
              </button>

              <div>
                {loading ? (
                  <>
                    <div className="h-7 w-48 bg-slate-200 rounded animate-pulse"></div>
                    <div className="mt-1 h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {shop ? shop.name : "Create Your Shop"}
                    </h2>
                    <p className="hidden text-sm text-slate-500 sm:block">
                      {shop
                        ? "Welcome to the Smaze Merchant Portal 👋"
                        : "Create your shop to start posting offers."}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <Link
                to="/shop/notifications"
                className="relative rounded-full p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
              >
                <HiOutlineBell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-rose-200">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 p-1 pr-2 transition hover:shadow-md sm:pr-3"
                >
                  {loading ? (
                    <>
                      <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse sm:h-9 sm:w-9"></div>
                      <div className="hidden sm:block text-left">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-bold text-white shadow-md sm:h-9 sm:w-9">
                        {getInitials(shop?.owner?.name || "User")}
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-slate-800">
                          {shop?.owner?.name || "Shop Owner"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {shop?.owner?.email || "Merchant Account"}
                        </p>
                      </div>
                    </>
                  )}
                  <HiOutlineChevronDown
                    size={16}
                    className={`hidden sm:block text-slate-400 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50">
                      <p className="font-semibold text-slate-800">
                        {shop?.owner?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {shop?.owner?.email || "Merchant Account"}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => navigate("/shop/profile")}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
                      >
                        <HiOutlineUser size={18} />
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                      >
                        <HiArrowRightOnRectangle size={18} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {loading ? (
            <ContentSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[calc(100vh-140px)]"
            >
              <Outlet />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopLayout;
