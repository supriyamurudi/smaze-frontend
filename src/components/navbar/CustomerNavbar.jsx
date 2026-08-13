import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  HiOutlineSparkles,
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

  // Fetch user data from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (user?.name) setUserName(user.name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [searchOpen]);

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
    setProfileOpen(false);
    setMobileMenu(false);
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const isCategory = categoryKeywords.some(
      (keyword) => query.includes(keyword) || keyword.includes(query),
    );

    if (isCategory) {
      navigate(
        `/customer/categories?search=${encodeURIComponent(searchQuery)}`,
      );
    } else {
      navigate(`/customer/offers?search=${encodeURIComponent(searchQuery)}`);
    }

    setSearchOpen(false);
    setSearchQuery("");
  };

  const getInitials = () => {
    return userName.charAt(0).toUpperCase();
  };

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

  return (
    <>
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-100/50"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/customer/dashboard"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-200/50 group-hover:shadow-violet-300 transition-shadow">
                  <HiOutlineSparkles size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-slate-800">Sm</span>
                  <span className="text-violet-600">aze</span>
                </span>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Customer
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {CUSTOMER_LINKS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-violet-600 bg-violet-50/80"
                        : "text-slate-500 hover:text-violet-600 hover:bg-violet-50/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={
                          isActive ? "text-violet-500" : "text-slate-400"
                        }
                      >
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                      {item.title === "Alerts" && unreadCount > 0 && (
                        <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm shadow-rose-200">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-violet-600 transition-all duration-200"
                >
                  <HiOutlineMagnifyingGlass size={20} />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", damping: 25 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      <form onSubmit={handleSearch} className="p-4">
                        <div className="relative">
                          <HiOutlineMagnifyingGlass
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                          />
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search offers, shops..."
                            className="w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 focus:bg-white"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              <HiOutlineXCircle size={18} />
                            </button>
                          )}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                          >
                            Search
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Saved Offers */}
              <Link
                to="/customer/saved-offers"
                className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-500 transition-all duration-200"
              >
                <HiOutlineHeart size={20} />
              </Link>

              {/* Notifications */}
              <Link
                to="/customer/notifications"
                className="relative p-2.5 rounded-xl hover:bg-violet-50 text-slate-500 hover:text-violet-600 transition-all duration-200"
              >
                <HiOutlineBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-rose-200">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full transition-all duration-200 ${
                    profileOpen
                      ? "ring-2 ring-violet-500 ring-offset-2 bg-violet-50"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-violet-200/50">
                    {getInitials()}
                  </div>
                  <span className="hidden md:inline-block text-sm font-medium text-slate-700 max-w-[80px] truncate">
                    {userName}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", damping: 25 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      {/* Profile Header */}
                      <div className="px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                            {getInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {userName}
                            </p>
                            <p className="text-xs text-slate-500">Customer</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/customer/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all"
                        >
                          <HiOutlineUser size={18} />
                          Profile
                        </Link>
                        <Link
                          to="/customer/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all"
                        >
                          <HiOutlineCog6Tooth size={18} />
                          Settings
                        </Link>
                        <div className="my-1 border-t border-slate-100"></div>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <HiArrowRightOnRectangle size={18} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-all duration-200"
              >
                <HiBars3 size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <HiOutlineSparkles size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">Smaze</span>
              </div>
              <button
                onClick={() => setMobileMenu(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <HiXMark size={22} className="text-slate-600" />
              </button>
            </div>

            <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-64px)]">
              {/* User Info */}
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                  {getInitials()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {userName}
                  </p>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
              </div>

              {CUSTOMER_LINKS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "text-violet-600 bg-violet-50"
                        : "text-slate-600 hover:text-violet-600 hover:bg-violet-50/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={
                          isActive ? "text-violet-500" : "text-slate-400"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.title}</span>
                      {item.title === "Alerts" && unreadCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              <div className="border-t border-slate-100 my-3"></div>

              <Link
                to="/customer/profile"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50/50 transition-all"
              >
                <HiOutlineUser size={18} className="text-slate-400" />
                Profile
              </Link>
              <Link
                to="/customer/settings"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:text-violet-600 hover:bg-violet-50/50 transition-all"
              >
                <HiOutlineCog6Tooth size={18} className="text-slate-400" />
                Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenu(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-all"
              >
                <HiArrowRightOnRectangle size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
};

export default CustomerNavbar;
