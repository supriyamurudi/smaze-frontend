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
  LayoutGrid,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile } from "../../services/adminService";
import {
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  getTimeAgo,
} from "../../services/notificationService";
import toast from "react-hot-toast";

// ========== HELPER FUNCTIONS ==========
const getNotificationIcon = (type) => {
  const iconMap = {
    user: <Users size={14} className="text-blue-500" />,
    shop: <Store size={14} className="text-violet-500" />,
    offer: <Tag size={14} className="text-emerald-500" />,
    category: <LayoutGrid size={14} className="text-amber-500" />,
    order: <FileText size={14} className="text-orange-500" />,
    user_registered: <Users size={14} className="text-blue-500" />,
    shop_created: <Store size={14} className="text-violet-500" />,
    offer_created: <Tag size={14} className="text-emerald-500" />,
  };
  return iconMap[type] || <Bell size={14} className="text-slate-400" />;
};

const getNotificationColor = (type) => {
  const colorMap = {
    user: "bg-blue-50 border-blue-100",
    shop: "bg-violet-50 border-violet-100",
    offer: "bg-emerald-50 border-emerald-100",
    category: "bg-amber-50 border-amber-100",
    order: "bg-orange-50 border-orange-100",
    user_registered: "bg-blue-50 border-blue-100",
    shop_created: "bg-violet-50 border-violet-100",
    offer_created: "bg-emerald-50 border-emerald-100",
  };
  return colorMap[type] || "bg-slate-50 border-slate-100";
};

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const isFirstRender = useRef(true);
  const pollingInterval = useRef(null);

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
      name: "Categories",
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

  // ========== FETCH FUNCTIONS ==========
  const fetchUnreadCount = async () => {
    try {
      const response = await getAdminUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await getAdminNotifications({
        limit: 5,
        page: 1,
        filter: "all",
      });
      setNotifications(response.notifications || []);
      await fetchUnreadCount();
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // ========== MARK AS READ FUNCTIONS ==========
  const handleMarkSingleAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await markAdminNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAdminNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  // ========== HANDLE NOTIFICATION CLICK ==========
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAdminNotificationAsRead(notification.id).catch(console.error);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    if (notification.link) {
      navigate(notification.link);
      setIsNotificationsOpen(false);
    }
  };

  // ========== FETCH PROFILE ==========
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

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
      fetchRecentNotifications();
      fetchUnreadCount();

      pollingInterval.current = setInterval(() => {
        fetchRecentNotifications();
      }, 30000);
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  // ========== SCROLL HANDLER ==========
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ========== CLICK OUTSIDE HANDLER ==========
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

  // ========== HANDLE LOGOUT ==========
  const handleLogout = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ========== GET INITIALS ==========
  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ========== GET ROLE DISPLAY ==========
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 sm:gap-3 group relative flex-shrink-0"
            >
              <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-violet-200">
                <Sparkles size={16} className="sm:size-5 animate-pulse" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-violet-700 hidden sm:block">
                Smaze
              </span>
              <span className="text-base font-bold text-violet-700 sm:hidden">
                Smaze
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "text-violet-700 bg-violet-50/80 shadow-sm"
                        : "text-slate-600 hover:text-violet-700 hover:bg-violet-50/50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <link.icon
                        size={16}
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
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    if (!isNotificationsOpen) {
                      fetchRecentNotifications();
                    }
                  }}
                  className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 flex items-center justify-center rounded-lg sm:rounded-xl text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-all relative"
                >
                  <Bell size={18} className="sm:size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[8px] sm:text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-rose-200">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-[400px] max-h-[400px] sm:max-h-[500px] overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border border-slate-100 z-50"
                      style={{ right: "1", left: "auto" }}
                    >
                      {/* Header */}
                      <div className="sticky top-0 z-10 bg-white p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                            Notifications
                            {unreadCount > 0 && (
                              <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                                {unreadCount} new
                              </span>
                            )}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-slate-500">
                            {notifications.length} notifications
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-[10px] sm:text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors whitespace-nowrap"
                            >
                              Mark all read
                            </button>
                          )}
                          <Link
                            to="/admin/notifications"
                            className="text-[10px] sm:text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors whitespace-nowrap"
                            onClick={() => setIsNotificationsOpen(false)}
                          >
                            View All
                          </Link>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="p-2 space-y-1">
                        {loadingNotifications ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="text-3xl sm:text-4xl mb-2">🔔</div>
                            <p className="text-sm font-medium text-slate-700">
                              No notifications yet
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              We'll notify you when something happens
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                                notification.isRead
                                  ? "bg-white border-transparent hover:bg-slate-50"
                                  : `bg-gradient-to-r ${getNotificationColor(
                                      notification.type,
                                    )} bg-opacity-10 border-opacity-30`
                              }`}
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() =>
                                    handleNotificationClick(notification)
                                  }
                                >
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="flex-shrink-0 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center">
                                      {getNotificationIcon(notification.type)}
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                                      {notification.title}
                                    </p>
                                    {notification.priority === "high" && (
                                      <span className="px-1 py-0.5 bg-rose-100 text-rose-600 text-[6px] sm:text-[7px] lg:text-[8px] font-bold rounded-full flex-shrink-0">
                                        HIGH
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2 ml-8 sm:ml-9 lg:ml-10 break-words">
                                    {notification.message}
                                  </p>
                                  <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-slate-400 mt-0.5 ml-8 sm:ml-9 lg:ml-10">
                                    {getTimeAgo(notification.createdAt)}
                                  </p>
                                </div>

                                {!notification.isRead && (
                                  <button
                                    onClick={(e) =>
                                      handleMarkSingleAsRead(notification.id, e)
                                    }
                                    className="flex-shrink-0 p-1 rounded-lg text-violet-600 hover:bg-violet-100 transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check size={12} className="sm:size-3.5" />
                                  </button>
                                )}

                                {!notification.isRead && (
                                  <span className="flex-shrink-0 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-violet-500 mt-1"></span>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 hover:bg-violet-50 transition-all group"
                >
                  <div className="relative">
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-xl sm:rounded-2xl object-cover ring-2 ring-violet-300"
                      />
                    ) : (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-200">
                        {loadingProfile ? "..." : getInitials(profile?.name)}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                  </div>
                  <div className="hidden lg:block text-left min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[100px]">
                      {loadingProfile
                        ? "Loading..."
                        : profile?.name || "Admin User"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[100px]">
                      {loadingProfile ? "..." : getRoleDisplay(profile?.role)}
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-300 hidden sm:block ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl sm:rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-50"
                    >
                      {/* Profile Header */}
                      <div className="relative p-4 sm:p-5 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-b border-slate-100">
                        <div className="flex items-center gap-3 sm:gap-4">
                          {profile?.image ? (
                            <img
                              src={profile.image}
                              alt={profile.name}
                              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl object-cover ring-2 ring-violet-300 shadow-lg"
                            />
                          ) : (
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-violet-200">
                              {loadingProfile
                                ? "..."
                                : getInitials(profile?.name)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm sm:text-base truncate">
                              {loadingProfile
                                ? "Loading..."
                                : profile?.name || "Admin User"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {loadingProfile
                                ? "..."
                                : profile?.email || "admin@smaze.com"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <Shield
                                size={12}
                                className="text-violet-500 flex-shrink-0"
                              />
                              <span className="text-[10px] font-medium text-violet-600">
                                {loadingProfile
                                  ? "..."
                                  : getRoleDisplay(profile?.role)}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <Award
                                size={12}
                                className="text-amber-500 flex-shrink-0"
                              />
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
                          <div className="h-8 w-8 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                            <User size={16} className="text-violet-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium">Profile Settings</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              Edit your profile information
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/admin/settings"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-all group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                            <Settings size={16} className="text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium">System Settings</p>
                            <p className="text-[10px] text-slate-400 truncate">
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
                          <div className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                            <LogOut size={16} className="text-rose-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium">Logout</p>
                            <p className="text-[10px] text-rose-400 truncate">
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
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
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
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden max-h-[calc(100vh-56px)] overflow-y-auto"
            >
              <div className="px-3 py-3 space-y-0.5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="border-t border-slate-100 mt-3 pt-3 space-y-0.5">
                  <Link
                    to="/admin/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-violet-700 hover:bg-violet-50/50 transition-all"
                  >
                    <Settings size={18} className="text-slate-400" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 mt-3 pt-3 flex items-center gap-2">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {loadingProfile
                        ? "Loading..."
                        : profile?.name || "Admin User"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {loadingProfile
                        ? "..."
                        : profile?.email || "admin@smaze.com"}
                    </p>
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
