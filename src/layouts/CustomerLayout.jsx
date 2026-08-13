import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CustomerNavbar from "../components/navbar/CustomerNavbar";
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
      staggerChildren: 0.1,
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

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const CustomerLayout = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // ===============================
  // Scroll effect for layout
  // ===============================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===============================
  // Get page title from location
  // ===============================
  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 1) {
      return segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Navbar */}
      <CustomerNavbar unreadCount={unreadCount} />

      {/* Page Header (optional - can be hidden) */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100/50 transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}
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

      {/* Main Content */}
      <main className="flex-1 pt-4 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative"
            >
              <motion.div variants={contentVariants}>
                <Outlet />
              </motion.div>

              {/* Decorative gradient orb */}
              <div className="fixed -top-40 -right-40 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action Button (optional - can be customized) */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerLayout;
