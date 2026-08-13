import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineUser,
  HiOutlineEnvelope, // ✅ Fixed: Changed from HiOutlineMail
  HiOutlineLockClosed,
  HiOutlineKey,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineServer,
  HiOutlineFolder,
  HiOutlineCalendar,
  HiOutlineArrowPath,
} from "react-icons/hi2";

import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../../services/adminService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div>
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
    </div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-6 space-y-4">
          {[...Array(i === 0 ? 2 : i === 1 ? 3 : 2)].map((_, j) => (
            <div
              key={j}
              className="h-12 bg-slate-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ========== SECTION HEADER ==========
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3 text-violet-700">
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

// ========== INFO ITEM ==========
const InfoItem = ({ label, value, icon: Icon, valueClassName = "" }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0"
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon size={16} className="text-slate-400" />}
      <span className="text-sm text-slate-500">{label}</span>
    </div>
    <span
      className={`text-sm font-semibold ${valueClassName || "text-slate-800"}`}
    >
      {value}
    </span>
  </motion.div>
);

// ========== MAIN COMPONENT ==========
export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm();

  // ========== FETCH PROFILE ==========
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      const data = response.user || response.data || response;
      setProfile(data);
      reset({
        name: data.name || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message || "Failed to load profile");
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ========== UPDATE PROFILE ==========
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      await updateProfile(data);
      toast.success("Profile updated successfully! 🎉");
      fetchProfile();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  // ========== UPDATE PASSWORD ==========
  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordSubmitting(true);
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully! 🔒");
      resetPassword();
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const newPassword = watch("newPassword");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <HiOutlineXCircle size={32} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-rose-800">
              Failed to Load Settings
            </h2>
            <p className="mt-2 text-rose-600">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              <HiOutlineArrowPath className="text-lg" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Admin Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your account, security and platform information
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              <HiOutlineCheckCircle size={16} />
              Settings
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
              <HiOutlineUser size={16} />
              {profile?.name || "Admin"}
            </span>
          </div>
        </motion.div>

        {/* ========== PROFILE INFORMATION ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <SectionHeader
              icon={HiOutlineUser}
              title="Profile Information"
              description="Update your personal information"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiOutlineUser size={18} />
                  </div>
                  <input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.name
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-rose-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiOutlineEnvelope size={18} /> {/* ✅ Fixed here */}
                  </div>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Enter a valid email",
                      },
                    })}
                    className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.email
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-rose-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition sm:w-auto ${
                  submitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-200 hover:shadow-xl"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={18} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* ========== CHANGE PASSWORD ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <SectionHeader
              icon={HiOutlineLockClosed}
              title="Change Password"
              description="Keep your account secure by updating your password"
            />
          </div>

          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiOutlineKey size={18} />
                  </div>
                  <input
                    type="password"
                    {...passwordRegister("currentPassword", {
                      required: "Current password is required",
                    })}
                    className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      passwordErrors.currentPassword
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                    placeholder="Enter current password"
                  />
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-1.5 text-sm text-rose-500">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiOutlineLockClosed size={18} />
                  </div>
                  <input
                    type="password"
                    {...passwordRegister("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      passwordErrors.newPassword
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                    placeholder="Enter new password"
                  />
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-1.5 text-sm text-rose-500">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <HiOutlineLockClosed size={18} />
                  </div>
                  <input
                    type="password"
                    {...passwordRegister("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      passwordErrors.confirmPassword
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                    placeholder="Confirm new password"
                  />
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-rose-500">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                type="submit"
                disabled={passwordSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition sm:w-auto ${
                  passwordSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-200 hover:shadow-xl"
                }`}
              >
                {passwordSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <HiOutlineLockClosed size={18} />
                    Update Password
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* ========== PLATFORM INFORMATION ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <SectionHeader
              icon={HiOutlineInformationCircle}
              title="Platform Information"
              description="Current application details"
            />
          </div>

          <div className="p-6 sm:p-8">
            <InfoItem
              label="Application"
              value="Smaze"
              icon={HiOutlineServer}
              valueClassName="text-violet-600 font-bold"
            />
            <InfoItem
              label="Version"
              value="v1.0.0"
              icon={HiOutlineInformationCircle}
              valueClassName="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700"
            />
            <InfoItem
              label="Frontend"
              value="React + Tailwind CSS"
              icon={HiOutlineServer}
            />
            <InfoItem
              label="Backend"
              value="Express.js"
              icon={HiOutlineServer}
            />
            <InfoItem
              label="Database"
              value="PostgreSQL"
              icon={HiOutlineFolder}
            />
            <InfoItem
              label="Last Updated"
              value={new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
              icon={HiOutlineCalendar}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
