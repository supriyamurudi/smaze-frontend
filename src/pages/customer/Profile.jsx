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
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getMyProfile } from "../../services/profileService";
import { logoutUser } from "../../services/authService";

// ========== REUSABLE COMPONENTS ==========

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-slate-200 rounded w-48"></div>
    <div className="bg-slate-100 rounded-3xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-slate-200"></div>
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 rounded w-32"></div>
          <div className="h-4 bg-slate-200 rounded w-48"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
      </div>
      <div className="h-8 bg-slate-200 rounded w-16"></div>
    </div>
    <div className="rounded-2xl overflow-hidden border bg-white">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-6 py-5 border-t"
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

// Menu Item Component
const MenuItem = ({ icon, label, path, color, bg, onClick, isLast }) => {
  const className = `group flex items-center justify-between px-6 py-4 transition ${
    !isLast ? "border-t border-slate-100" : ""
  } ${bg || ""}`;

  const content = (
    <>
      <div className="flex items-center gap-3">
        <div className={color || "text-slate-500"}>{icon}</div>
        <span className="font-medium text-slate-700 group-hover:text-slate-900">
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
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <HiOutlineArrowRightOnRectangle
              size={32}
              className="text-red-500"
            />
          </div>
          <h3 className="text-center text-2xl font-bold text-slate-800">
            Logout Confirmation
          </h3>
          <p className="mt-2 text-center text-slate-500">
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

// Status Badge
const StatusBadge = () => (
  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
    <HiOutlineSparkles className="inline mr-1" size={12} />
    Active
  </span>
);

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
      icon: <HiOutlinePencilSquare size={22} />,
      label: "Edit Profile",
      path: "/customer/edit-profile",
      color: "text-violet-600",
      bg: "hover:bg-violet-50",
    },
    {
      icon: <HiOutlineHeart size={22} />,
      label: "Saved Offers",
      path: "/customer/saved-offers",
      color: "text-rose-500",
      bg: "hover:bg-rose-50",
    },
    {
      icon: <HiOutlineBell size={22} />,
      label: "Notifications",
      path: "/customer/notifications",
      color: "text-amber-500",
      bg: "hover:bg-amber-50",
    },
    {
      icon: <HiOutlineMapPin size={22} />,
      label: "Saved Addresses",
      path: "/customer/address",
      color: "text-emerald-500",
      bg: "hover:bg-emerald-50",
    },
    {
      icon: <HiOutlineShieldCheck size={22} />,
      label: "Privacy & Security",
      path: "/customer/privacy",
      color: "text-indigo-500",
      bg: "hover:bg-indigo-50",
    },
    {
      icon: <HiOutlineCog6Tooth size={22} />,
      label: "Settings",
      path: "/customer/settings",
      color: "text-slate-500",
      bg: "hover:bg-slate-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Account</h1>
            <p className="mt-1 text-slate-500">
              Manage your profile and preferences
            </p>
          </div>
          <StatusBadge />
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-1"
        >
          <div className="relative rounded-3xl bg-white/95 backdrop-blur-sm p-6 transition group-hover:bg-white">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-violet-100 shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=7c3aed&color=fff&size=256&bold=true`;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 border-2 border-white">
                    <div className="h-2 w-2 rounded-full bg-emerald-300"></div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {user.name}
                  </h2>
                  <div className="mt-1.5 space-y-1">
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <HiOutlineEnvelope size={15} />
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <HiOutlinePhone size={15} />
                        {user.phone}
                      </p>
                    )}
                    {user.city && (
                      <p className="flex items-center gap-2 text-sm text-slate-500">
                        <HiOutlineMapPin size={15} />
                        {user.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/customer/edit-profile")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
              >
                <HiOutlinePencilSquare size={18} />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Menu */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.path}
              {...item}
              isLast={index === menuItems.length - 1}
            />
          ))}

          <MenuItem
            icon={<HiOutlineArrowRightOnRectangle size={22} />}
            label="Logout"
            color="text-red-500"
            bg="hover:bg-red-50 border-t border-slate-100"
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
