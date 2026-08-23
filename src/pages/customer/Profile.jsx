import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineChevronRight,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineCog6Tooth,
  HiOutlineMapPin,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePencilSquare,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineUser,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getMyProfile } from "../../services/profileService";
import { logoutUser } from "../../services/authService";

// ========== REUSABLE COMPONENTS ==========

// Skeleton Loader (Optimized for mobile)
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-slate-200 rounded w-48"></div>
    <div className="bg-white rounded-3xl p-6 flex items-center gap-4 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-slate-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-200 rounded w-32"></div>
        <div className="h-4 bg-slate-200 rounded w-24"></div>
      </div>
    </div>
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-5 border-t border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="h-5 bg-slate-200 rounded w-32"></div>
          </div>
          <div className="w-4 h-4 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

// Menu Item Component (Compact for mobile)
const MenuItem = ({ icon, label, path, color, bg, onClick, isLast }) => {
  const className = `group flex items-center justify-between px-4 py-4 transition ${
    !isLast ? "border-b border-slate-100" : ""
  } ${bg || ""}`;

  const content = (
    <>
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl p-2.5 ${color || "text-slate-500"} bg-slate-50`}
        >
          {icon}
        </div>
        <span className="font-semibold text-slate-700 group-hover:text-slate-900 text-sm sm:text-base">
          {label}
        </span>
      </div>
      <HiOutlineChevronRight
        size={18}
        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-500"
      />
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={`w-full ${className}`}>
        {content}
      </button>
    );
  }

  return (
    <Link to={path} className={className}>
      {content}
    </Link>
  );
};

// Logout Modal
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <HiOutlineArrowRightOnRectangle
              size={26}
              className="text-red-500"
            />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Logout?</h3>
          <p className="mt-2 text-sm text-slate-500">
            Are you sure you want to logout? You can always log back in.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    city: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        const data = response.user;

        setUser({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          image:
            data.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=7c3aed&color=fff&size=256&bold=true`,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      icon: <HiOutlinePencilSquare size={20} />,
      label: "Edit Profile",
      path: "/customer/edit-profile",
      color: "text-violet-600 bg-violet-50",
      bg: "hover:bg-violet-50/50",
    },
    {
      icon: <HiOutlineHeart size={20} />,
      label: "Saved Offers",
      path: "/customer/saved-offers",
      color: "text-rose-500 bg-rose-50",
      bg: "hover:bg-rose-50/50",
    },
    {
      icon: <HiOutlineBell size={20} />,
      label: "Notifications",
      path: "/customer/notifications",
      color: "text-amber-500 bg-amber-50",
      bg: "hover:bg-amber-50/50",
    },
    {
      icon: <HiOutlineShieldCheck size={20} />,
      label: "Privacy & Security",
      path: "/customer/privacy",
      color: "text-indigo-500 bg-indigo-50",
      bg: "hover:bg-indigo-50/50",
    },
    {
      icon: <HiOutlineCog6Tooth size={20} />,
      label: "Settings",
      path: "/customer/settings",
      color: "text-slate-500 bg-slate-50",
      bg: "hover:bg-slate-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-black text-slate-900">My Account</h1>
        </motion.div>

        {/* Profile Card (Horizontal glass effect for mobile) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 sm:p-6 shadow-lg"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

          <div className="relative flex items-center gap-4">
            <img
              src={user.image}
              alt={user.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=ffffff&color=7c3aed&size=256&bold=true`;
              }}
            />

            <div className="flex-1 min-w-0 text-white">
              <h2 className="text-lg sm:text-2xl font-bold truncate">
                {user.name}
              </h2>
              <p className="text-sm text-violet-100 truncate flex items-center gap-1">
                <HiOutlineEnvelope size={14} />
                {user.email}
              </p>
              {user.city && (
                <p className="text-xs text-violet-200 mt-0.5 flex items-center gap-1">
                  <HiOutlineMapPin size={12} />
                  {user.city}
                </p>
              )}
            </div>

            <button
              onClick={() => navigate("/customer/edit-profile")}
              className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition text-white"
            >
              <HiOutlinePencilSquare size={20} />
            </button>
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100"
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.path}
              {...item}
              isLast={index === menuItems.length - 1}
            />
          ))}

          <MenuItem
            icon={<HiOutlineArrowRightOnRectangle size={20} />}
            label="Logout"
            color="text-red-500 bg-red-50"
            bg="hover:bg-red-50/50"
            onClick={() => setShowLogoutModal(true)}
            isLast
          />
        </motion.div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-slate-400">
            App Version 2.0.0 • Made with ❤️ by Smaze
          </p>
        </motion.div>
      </div>

      {/* Fixed Bottom Navigation (Mobile UX) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md pb-safe">
        <div className="mx-auto flex max-w-md items-center justify-around py-3">
          <Link
            to="/customer/home"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-violet-600 transition"
          >
            <HiOutlineHome size={22} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link
            to="/customer/offers"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-violet-600 transition"
          >
            <HiOutlineTag size={22} />
            <span className="text-[10px] font-medium">Offers</span>
          </Link>
          <Link
            to="/customer/saved-offers"
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-violet-600 transition"
          >
            <HiOutlineHeart size={22} />
            <span className="text-[10px] font-medium">Saved</span>
          </Link>
          <Link
            to="/customer/profile"
            className="flex flex-col items-center gap-1 text-violet-600"
          >
            <HiOutlineUser size={22} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </motion.div>
  );
};

export default Profile;
