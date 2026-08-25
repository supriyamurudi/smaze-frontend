// frontend/src/components/AdminNavbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Tag,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Bell,
  Sparkles,
  Shield,
  Award,
  LayoutGrid, // ✅ ADDED THIS IMPORT
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile } from "../../services/adminService";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Categories", // ✅ Updated to use the correct icon
      path: "/admin/categories",
      icon: LayoutGrid,
    },
    {
      name: "Shops",
      path: "/admin/shops",
      icon: Store,
    },
    {
      name: "Offers",
      path: "/admin/offers",
      icon: Tag,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: FileText,
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New user registered",
      description: "John Doe just joined the platform",
      time: "5 min ago",
      type: "user",
      read: false,
    },
    {
      id: 2,
      title: "New shop listed",
      description: "Fashion Hub has been approved",
      time: "1 hour ago",
      type: "shop",
      read: false,
    },
    {
      id: 3,
      title: "Offer expiring soon",
      description: "Summer Sale ends in 2 days",
      time: "3 hours ago",
      type: "offer",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const userData = response.user || response.data || response;
        setProfile(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "user":
        return <Users size={14} className="text-blue-500" />;
      case "shop":
        return <Store size={14} className="text-violet-500" />;
      case "offer":
        return <Tag size={14} className="text-emerald-500" />;
      default:
        return <Bell size={14} className="text-amber-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "user":
        return "bg-blue-50 border-blue-100";
      case "shop":
        return "bg-violet-50 border-violet-100";
      case "offer":
        return "bg-emerald-50 border-emerald-100";
      default:
        return "bg-amber-50 border-amber-100";
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role) => {
    if (!role) return "Administrator";
    const roleMap = {
      ADMIN: "Administrator",
      SUPER_ADMIN: "Super Admin",
      USER: "User",
      SHOP_OWNER: "Shop Owner",
    };
    return roleMap[role] || role;
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-2xl shadow-xl"
            : "bg-white/90 backdrop-blur-md shadow-sm"
        } border-b border-slate-200/60`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 group relative"
            >
              <motion.div
                whileHover={{ rotate: -5, scale: 1.05 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Smaze
                </span>
                <span className="ml-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-400">
                  Admin
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-violet-700 bg-violet-50/80 shadow-sm"
                        : "text-slate-600 hover:text-violet-700 hover:bg-violet-50/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <link.icon
                        size={18}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "text-violet-600"
                            : "text-slate-400 group-hover:text-violet-500"
                        }`}
                      />
                      <span>{link.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-all relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-rose-200"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-96 max-h-[500px] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-100"
                    >
                      <div className="sticky top-0 z-10 bg-white p-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-800">
                            Notifications
                          </h3>
                          <p className="text-xs text-slate-500">
                            {unreadCount} unread
                          </p>
                        </div>
                        <button className="text-xs font-medium text-violet-600 hover:text-violet-700">
                          Mark all as read
                        </button>
                      </div>

                      <div className="p-2 space-y-1">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              notification.read
                                ? "bg-white border-transparent"
                                : `bg-gradient-to-r ${getNotificationColor(
                                    notification.type,
                                  )} bg-opacity-10`
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {notification.description}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="flex-shrink-0 h-2 w-2 rounded-full bg-violet-500"></span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="sticky bottom-0 bg-white p-3 border-t border-slate-100 text-center">
                        <Link
                          to="/admin/notifications"
                          className="text-xs font-medium text-violet-600 hover:text-violet-700"
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-violet-50 transition-all group"
                >
                  <div className="relative">
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="h-9 w-9 rounded-2xl object-cover ring-2 ring-violet-300"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-200">
                        {loadingProfile ? "..." : getInitials(profile?.name)}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-slate-700">
                      {loadingProfile
                        ? "Loading..."
                        : profile?.name || "Admin User"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {loadingProfile ? "..." : getRoleDisplay(profile?.role)}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      {/* Profile Header */}
                      <div className="relative p-5 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                          {profile?.image ? (
                            <img
                              src={profile.image}
                              alt={profile.name}
                              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-violet-300 shadow-lg"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-violet-200">
                              {loadingProfile
                                ? "..."
                                : getInitials(profile?.name)}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-slate-800">
                              {loadingProfile
                                ? "Loading..."
                                : profile?.name || "Admin User"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {loadingProfile
                                ? "..."
                                : profile?.email || "admin@smaze.com"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Shield size={12} className="text-violet-500" />
                              <span className="text-[10px] font-medium text-violet-600">
                                {loadingProfile
                                  ? "..."
                                  : getRoleDisplay(profile?.role)}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <Award size={12} className="text-amber-500" />
                              <span className="text-[10px] font-medium text-amber-600">
                                {profile?.status === "ACTIVE"
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-0.5">
                        <Link
                          to="/admin/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-all group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User size={16} className="text-violet-500" />
                          </div>
                          <div>
                            <p className="font-medium">Profile Settings</p>
                            <p className="text-[10px] text-slate-400">
                              Edit your profile information
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/admin/settings"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-all group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Settings size={16} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">System Settings</p>
                            <p className="text-[10px] text-slate-400">
                              Configure application settings
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-slate-100 p-2">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-all group"
                        >
                          <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LogOut size={16} className="text-rose-500" />
                          </div>
                          <div>
                            <p className="font-medium">Logout</p>
                            <p className="text-[10px] text-rose-400">
                              Sign out of your account
                            </p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        isActive
                          ? "text-violet-700 bg-violet-50 shadow-sm"
                          : "text-slate-600 hover:text-violet-700 hover:bg-violet-50/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon
                          size={18}
                          className={
                            isActive ? "text-violet-600" : "text-slate-400"
                          }
                        />
                        <span className="flex-1">{link.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="border-t border-slate-100 mt-4 pt-4 space-y-1">
                  <Link
                    to="/admin/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-600 hover:text-violet-700 hover:bg-violet-50/50 transition-all"
                  >
                    <Settings size={18} className="text-slate-400" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="h-8 w-8 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {loadingProfile ? "..." : getInitials(profile?.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {loadingProfile
                          ? "Loading..."
                          : profile?.name || "Admin User"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {loadingProfile
                          ? "..."
                          : profile?.email || "admin@smaze.com"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default AdminNavbar;
