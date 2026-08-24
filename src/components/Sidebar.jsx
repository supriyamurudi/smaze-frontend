// frontend/src/components/customer/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
  HiBars3,
} from "react-icons/hi2";

const menuItems = [
  {
    name: "Dashboard",
    path: "/customer/dashboard",
    icon: HiOutlineHome,
  },
  {
    name: "Offers",
    path: "/customer/offers",
    icon: HiOutlineTag,
  },
  {
    name: "Saved Offers",
    path: "/customer/saved-offers",
    icon: HiOutlineHeart,
  },
  {
    name: "Notifications",
    path: "/customer/notifications",
    icon: HiOutlineBell,
  },
  {
    name: "Profile",
    path: "/customer/profile",
    icon: HiOutlineUser,
  },
  {
    name: "Settings",
    path: "/customer/settings",
    icon: HiOutlineCog6Tooth,
  },
];

// ========== DESKTOP SIDEBAR ==========
const DesktopSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  return (
    <aside
      className="
        hidden
        lg:flex
        fixed
        left-0
        top-0
        z-40
        h-screen
        w-64
        xl:w-72
        flex-col
        bg-white
        border-r
        border-slate-200
        shadow-sm
      "
    >
      {/* Logo */}
      <div className="border-b border-slate-200 px-5 sm:px-6 py-5 sm:py-7">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="text-violet-600">S</span>
          <span className="text-slate-900">maze</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Customer Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-1 sm:space-y-2 px-3 sm:px-4 py-4 sm:py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                  group
                  flex
                  items-center
                  gap-3
                  sm:gap-4
                  rounded-xl
                  px-3
                  sm:px-4
                  py-2.5
                  sm:py-3
                  text-xs
                  sm:text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`
                      sm:w-[22px] sm:h-[22px]
                      ${
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-violet-700"
                      }
                    `}
                  />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto text-[8px] sm:text-xs text-white/60">
                      ●
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 sm:p-5">
        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 p-3 sm:p-4 border border-violet-100">
          <h3 className="text-xs sm:text-sm font-semibold text-violet-700">
            Smaze Customer
          </h3>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-500">
            Discover best local offers
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            mt-3
            sm:mt-4
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            sm:px-4
            py-2.5
            sm:py-3
            text-xs
            sm:text-sm
            font-medium
            text-red-500
            hover:bg-red-50
            transition
          "
        >
          <HiOutlineArrowRightOnRectangle
            size={18}
            className="sm:w-[22px] sm:h-[22px]"
          />
          Logout
        </button>
      </div>
    </aside>
  );
};

// ========== MOBILE SIDEBAR ==========
const MobileSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    // Add logout logic here
    navigate("/login");
  };

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

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30 }}
            className="
              fixed
              left-0
              top-0
              z-50
              h-screen
              w-72
              max-w-[85vw]
              bg-white
              shadow-2xl
              flex
              flex-col
              lg:hidden
            "
          >
            {/* Logo & Close Button */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-violet-600">S</span>
                <span className="text-slate-900">maze</span>
              </h1>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-600"
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>

            {/* User Info */}
            <div className="mx-4 mt-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 p-4 border border-violet-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Guest User
                  </h4>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-1 px-4 py-4">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-200"
                            : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                        }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={20}
                          className={
                            isActive
                              ? "text-white"
                              : "text-slate-500 group-hover:text-violet-700"
                          }
                        />
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <span className="text-[8px] text-white/60">●</span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4">
              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-500
                  hover:bg-red-50
                  transition
                "
              >
                <HiOutlineArrowRightOnRectangle size={20} />
                Logout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ========== MOBILE HAMBURGER BUTTON ==========
export const MobileMenuButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-white shadow-lg border border-slate-100 hover:bg-slate-50 transition"
    >
      <HiBars3 size={24} className="text-slate-700" />
    </button>
  );
};

// ========== MAIN SIDEBAR COMPONENT ==========
export default function Sidebar({ isMobileOpen, onClose }) {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar isOpen={isMobileOpen} onClose={onClose} />
    </>
  );
}
