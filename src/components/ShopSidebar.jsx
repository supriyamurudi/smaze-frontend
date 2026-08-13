import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyShop } from "../services/shopService";
import { getUnreadCount } from "../services/notificationService";
import toast from "react-hot-toast";
import { logoutUser } from "../services/authService";

import {
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBuildingStorefront,
  HiOutlineGift,
  HiOutlineSparkles,
  HiOutlineBell,
} from "react-icons/hi2";

// ========== MENU ITEMS ==========
const getMenuItems = (hasShop) => {
  const shopItems = [
    { name: "Dashboard", path: "/shop/dashboard", icon: HiOutlineHome },
    { name: "Add Offer", path: "/shop/add-offer", icon: HiOutlinePlusCircle },
    { name: "My Offers", path: "/shop/my-offers", icon: HiOutlineTag },
    { name: "Analytics", path: "/shop/analytics", icon: HiOutlineChartBar },
    { name: "Notifications", path: "/shop/notifications", icon: HiOutlineBell },
    { name: "Profile", path: "/shop/profile", icon: HiOutlineUser },
    { name: "Settings", path: "/shop/settings", icon: HiOutlineCog6Tooth },
  ];

  const createShopItems = [
    {
      name: "Create Shop",
      path: "/shop/create-shop",
      icon: HiOutlineBuildingStorefront,
    },
    { name: "Profile", path: "/shop/profile", icon: HiOutlineUser },
    { name: "Settings", path: "/shop/settings", icon: HiOutlineCog6Tooth },
  ];

  return hasShop ? shopItems : createShopItems;
};

// ========== NAV ITEM COMPONENT ==========
const NavItem = ({ item, unreadCount }) => {
  const Icon = item.icon;
  const isNotification = item.name === "Notifications";

  return (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `
          group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
          ${
            isActive
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
              : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 h-8 w-1 rounded-r-full bg-white"
              transition={{ type: "spring", duration: 0.3 }}
            />
          )}
          <div className="relative">
            <Icon
              size={22}
              className={
                isActive
                  ? "text-white"
                  : "text-slate-500 group-hover:text-violet-700"
              }
            />
            {isNotification && unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-lg shadow-rose-200">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          <span>{item.name}</span>
          {isActive && <span className="ml-auto text-xs text-white/60">●</span>}
        </>
      )}
    </NavLink>
  );
};

// ========== MAIN COMPONENT ==========
export default function ShopSidebar() {
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
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
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const menuItems = getMenuItems(!!shop);

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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col bg-white border-r border-slate-200 lg:flex">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 p-2 text-white">
            <HiOutlineBuildingStorefront size={22} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              S
            </span>
            <span className="text-slate-900">maze</span>
          </h1>
        </div>
        <p className="mt-1 text-xs font-medium text-slate-400">
          Merchant Dashboard
        </p>
      </div>

      {/* Shop Info */}
      <div className="mx-4 mt-5 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 p-4 border border-violet-100">
        <div className="flex items-center gap-3">
          {shop?.image ? (
            <img
              src={shop.image}
              alt={shop.name}
              className="h-12 w-12 rounded-xl object-cover border-2 border-violet-200"
              onError={(e) => {
                e.target.src = "";
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200">
              <span className="text-lg font-bold">
                {getInitials(shop?.name)}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {shop?.name || "No Shop Yet"}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {shop?.phone || "Create your first shop"}
            </p>
          </div>
          {shop && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Active
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1 px-4 py-5">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {shop ? "Main Menu" : "Getting Started"}
        </div>
        {menuItems.map((item) => (
          <NavItem key={item.path} item={item} unreadCount={unreadCount} />
        ))}

        {shop && (
          <>
            <div className="my-4 border-t border-slate-200"></div>
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Insights
            </div>
            <div className="rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-4 border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-200 p-2 text-violet-700">
                  <HiOutlineSparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">
                    Total Offers
                  </p>
                  <p className="text-sm font-bold text-violet-700">0</p>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-3 border border-violet-100">
          <div className="flex items-center gap-2">
            <HiOutlineGift className="text-violet-600" size={16} />
            <p className="text-xs font-medium text-slate-600">
              Grow your business with Smaze
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:shadow-md"
        >
          <HiOutlineArrowLeftOnRectangle size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
