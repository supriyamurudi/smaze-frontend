// src/components/navbar/CustomerNavbar.jsx

import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import smazeLogo from "../../assets/icons/smazeLogo.jpeg";

import {
  HiBars3,
  HiXMark,
  HiOutlineBell,
  HiOutlineHeart,
  HiOutlineMagnifyingGlass,
  HiOutlineCog6Tooth,
  HiArrowRightOnRectangle,
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineGift,
  HiOutlineXCircle,
  HiOutlineUser,
} from "react-icons/hi2";

import toast from "react-hot-toast";
import { logoutUser } from "../../services/authService";
import { getUnreadCount } from "../../services/notificationService";

const CustomerNavbar = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState("Customer");

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const CUSTOMER_LINKS = [
    {
      title: "Dashboard",
      path: "/customer/dashboard",
      icon: <HiOutlineHome size={20} />,
    },
    {
      title: "Categories",
      path: "/customer/categories",
      icon: <HiOutlineTag size={20} />,
    },
    {
      title: "Offers",
      path: "/customer/offers",
      icon: <HiOutlineGift size={20} />,
    },
    {
      title: "Saved",
      path: "/customer/saved-offers",
      icon: <HiOutlineHeart size={20} />,
    },
    {
      title: "Alerts",
      path: "/customer/notifications",
      icon: <HiOutlineBell size={20} />,
    },
  ];

  const categoryKeywords = [
    "food",
    "fashion",
    "electronics",
    "beauty",
    "grocery",
    "fitness",
    "salon",
    "cafe",
    "restaurant",
  ];

  // User
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.name) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserName(user.name);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  // Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Unread notifications
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadCount();
        setUnreadCount(data?.count || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdowns outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  const getInitials = () => {
    return userName?.charAt(0)?.toUpperCase() || "C";
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logoutUser();

    setProfileOpen(false);
    setMobileMenu(false);

    toast.success("Logged out successfully");

    navigate("/login", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    const isCategory = categoryKeywords.some(
      (keyword) =>
        query.toLowerCase().includes(keyword) ||
        keyword.includes(query.toLowerCase()),
    );

    navigate(
      `${
        isCategory ? "/customer/categories" : "/customer/offers"
      }?search=${encodeURIComponent(query)}`,
    );

    closeSearch();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-100"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-3">
            {/* Logo */}
            <Link
              to="/customer/dashboard"
              className="flex items-center gap-2 shrink-0"
            >
              {/* Clean, standalone image */}
              <img
                src={smazeLogo}
                alt="Smaze Logo"
                className="h-10 w-10 object-contain"
              />

              {/* Modern text with bold S and purple maze */}
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-slate-900">S</span>
                <span className="text-violet-600">maze</span>
              </span>

              <span className="hidden sm:block text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Customer
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {CUSTOMER_LINKS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "text-violet-600 bg-violet-50"
                        : "text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                    }`
                  }
                >
                  {item.icon}
                  {item.title}

                  {item.title === "Alerts" && unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen((prev) => !prev)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-violet-600 hover:bg-slate-100 transition"
                  aria-label="Search"
                >
                  <HiOutlineMagnifyingGlass size={20} />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                        scale: 0.95,
                      }}
                      transition={{
                        type: "spring",
                        damping: 25,
                      }}
                      className="fixed left-3 right-3 top-20 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[60]"
                    >
                      <form onSubmit={handleSearch} className="p-4">
                        <div className="relative">
                          <HiOutlineMagnifyingGlass
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search offers, shops..."
                            className="w-full rounded-xl bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-500"
                          />

                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                              <HiOutlineXCircle size={18} />
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            type="submit"
                            className="flex-1 rounded-xl bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700"
                          >
                            Search
                          </button>

                          <button
                            type="button"
                            onClick={closeSearch}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Saved */}
              <Link
                to="/customer/saved-offers"
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition"
                aria-label="Saved offers"
              >
                <HiOutlineHeart size={20} />
              </Link>

              {/* Desktop Notifications */}
              <Link
                to="/customer/notifications"
                className="hidden lg:flex relative w-10 h-10 items-center justify-center rounded-xl text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition"
                aria-label="Notifications"
              >
                <HiOutlineBell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Desktop Profile */}
              <div ref={profileRef} className="hidden lg:block relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials()}
                  </div>

                  <span className="hidden xl:block text-sm font-medium text-slate-700 max-w-20 truncate">
                    {userName}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2"
                    >
                      <Link
                        to="/customer/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-violet-50"
                      >
                        <HiOutlineUser size={18} />
                        Profile
                      </Link>

                      <Link
                        to="/customer/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-violet-50"
                      >
                        <HiOutlineCog6Tooth size={18} />
                        Settings
                      </Link>

                      <div className="my-1 border-t" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50"
                      >
                        <HiArrowRightOnRectangle size={18} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition active:scale-95"
                aria-label="Open menu"
              >
                <HiBars3 size={26} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{
              type: "spring",
              damping: 30,
            }}
            className="fixed top-0 left-0 z-50 h-dvh w-72 max-w-[85vw] bg-white shadow-2xl lg:hidden"
          >
            {/* Menu Header */}
            <div className="h-16 flex items-center justify-between border-b border-slate-100 px-5">
              <div className="flex items-center gap-2">
                <img
                  src={smazeLogo}
                  alt="Smaze Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />

                <span className="text-xl font-bold text-slate-800">Smaze</span>
              </div>

              <button
                onClick={() => setMobileMenu(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100"
                aria-label="Close menu"
              >
                <HiXMark size={24} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="h-[calc(100dvh-64px)] overflow-y-auto p-4 space-y-1">
              {/* User */}
              <div className="flex items-center gap-3 p-3 mb-2 bg-violet-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {getInitials()}
                </div>

                <span className="text-sm font-semibold text-slate-800">
                  {userName}
                </span>
              </div>

              {/* Navigation */}
              {CUSTOMER_LINKS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                      isActive
                        ? "text-violet-600 bg-violet-50"
                        : "text-slate-600 hover:bg-violet-50"
                    }`
                  }
                >
                  {item.icon}

                  <span className="flex-1">{item.title}</span>

                  {item.title === "Alerts" && unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}

              <div className="my-3 border-t border-slate-100" />

              <Link
                to="/customer/profile"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-violet-50"
              >
                <HiOutlineUser size={18} />
                Profile
              </Link>

              <Link
                to="/customer/settings"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-violet-50"
              >
                <HiOutlineCog6Tooth size={18} />
                Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-500 hover:bg-rose-50"
              >
                <HiArrowRightOnRectangle size={18} />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Navbar Spacer */}
      <div className="h-16" />
    </>
  );
};

export default CustomerNavbar;
