import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowUp } from "react-icons/hi2";

import CustomerNavbar from "../components/navbar/CustomerNavbar";
// ✅ ADD THIS IMPORT
import CustomerBottomNav from "../components/navbar/CustomerBottomNav";
import { getUnreadCount } from "../services/notificationService";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const CustomerLayout = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll handler for showing scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get page title from location
  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 1) {
      return segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
    }
    return "Dashboard";
  };

  // Check if current route is home/dashboard
  const isHomePage =
    location.pathname === "/" || location.pathname === "/customer";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Navbar */}
      <CustomerNavbar unreadCount={unreadCount} />

      {/* Page Header - Only show on non-home pages */}
      {!isHomePage && (
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-100/50 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-slate-800">
                  {getPageTitle()}
                </h1>
                <span className="hidden sm:inline-block h-4 w-px bg-slate-200"></span>
                <p className="hidden sm:inline-block text-sm text-slate-400">
                  Welcome back! 👋
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      {/* ✅ Added pb-24 to prevent content being hidden behind footer */}
      <main className={`flex-1 ${isHomePage ? "pt-2" : "pt-4"} pb-24`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Scroll to top"
          >
            <HiOutlineArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ✅ ADD THE FOOTER HERE */}
      <CustomerBottomNav />

      {/* Decorative gradient orbs - positioned fixed for performance */}
      <div className="fixed -top-40 -right-40 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default CustomerLayout;
