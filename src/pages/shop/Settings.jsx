// frontend/src/pages/shop/Settings.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineBell,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineShieldCheck,
  HiOutlineCog6Tooth,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import {
  getSettings,
  updateSettings,
  changePassword,
} from "../../services/userService";
import { deleteShop } from "../../services/shopService";

// ========== SKELETON LOADER (Mobile optimized) ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div>
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
    </div>
    <div className="rounded-2xl border bg-white p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-11 bg-slate-200 rounded-xl animate-pulse"
        ></div>
      ))}
      <div className="flex justify-end">
        <div className="h-11 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
    <div className="rounded-2xl border bg-white p-5 sm:p-6 shadow-sm">
      <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-6"></div>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b"
        >
          <div className="flex gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse"></div>
            <div>
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mt-1"></div>
            </div>
          </div>
          <div className="h-6 w-11 bg-slate-200 rounded-full animate-pulse mt-3 sm:mt-0"></div>
        </div>
      ))}
    </div>
    <div className="flex justify-end">
      <div className="h-11 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
  </div>
);

// ========== TOGGLE COMPONENT ==========
const Toggle = ({ checked, onChange, disabled = false }) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    className={`
      relative h-6 w-11 flex-shrink-0 rounded-full transition-all duration-300
      ${checked ? "bg-gradient-to-r from-violet-600 to-purple-600" : "bg-slate-300"}
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
    `}
  >
    <span
      className={`
        absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300
        ${checked ? "left-5" : "left-0.5"}
      `}
    />
  </button>
);

// ========== INPUT COMPONENT ==========
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 ${className}`}
    {...props}
  />
);

// ========== DELETE CONFIRMATION MODAL ==========
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [confirmText, setConfirmText] = useState("");

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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <HiOutlineExclamationTriangle size={28} className="text-red-500" />
          </div>
          <h3 className="text-center text-xl font-bold text-slate-800">
            Delete Shop Account?
          </h3>
          <p className="mt-2 text-center text-sm text-slate-500">
            This action is{" "}
            <span className="font-bold text-red-500">permanent</span>. All your
            offers, data, and shop information will be deleted forever.
          </p>
          <p className="mt-3 text-center text-sm text-slate-400">
            Type <span className="font-bold text-red-500">DELETE</span> to
            confirm
          </p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Type DELETE to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmText !== "DELETE" || isLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting..." : "Delete Forever"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [notifyOffers, setNotifyOffers] = useState(true);
  const [notifyShopUpdates, setNotifyShopUpdates] = useState(true);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        if (ignore) return;

        const settings = response.settings;
        setNotifyOffers(
          settings.notifyOffers !== undefined ? settings.notifyOffers : true,
        );
        setNotifyShopUpdates(
          settings.notifyShopUpdates !== undefined
            ? settings.notifyShopUpdates
            : true,
        );
      } catch (error) {
        if (!ignore) {
          console.error(error);
          toast.error(
            error.response?.data?.message || "Failed to load settings",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings({
        notifyOffers,
        notifyShopUpdates,
      });
      toast.success("Settings updated successfully 🎉");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return toast.error("Please fill all password fields");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (passwordData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setChangingPassword(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully 🔒");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteShop = async () => {
    try {
      setIsDeleting(true);
      await deleteShop();
      toast.success("Shop account deleted successfully");
      setShowDeleteModal(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete shop");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
      >
        {/* Removed mx-auto max-w-5xl px-4 py-8 - Layout handles spacing! */}
        <div className="w-full">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 sm:text-4xl">
                  Shop Settings
                </h1>
                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Manage your account security and preferences
                </p>
              </div>
              <span className="self-start rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 sm:self-center">
                <HiOutlineCog6Tooth className="inline mr-1" size={16} />
                Preferences
              </span>
            </div>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 px-5 sm:px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-200 p-2.5 text-violet-700">
                    <HiOutlineLockClosed size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    Change Password
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-violet-600 shadow-sm transition hover:bg-violet-50"
                >
                  {showPasswordFields ? "Hide" : "Change"}
                </button>
              </div>
            </div>

            {showPasswordFields && (
              <div className="p-5 sm:p-6 space-y-4">
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <div className="flex flex-col sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={changingPassword}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:scale-105 hover:shadow-lg disabled:opacity-50 sm:w-auto"
                  >
                    {changingPassword ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <HiOutlineShieldCheck size={18} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 px-5 sm:px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50">
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                Preferences
              </h2>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Push Notifications */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <HiOutlineBell size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-slate-500">
                      Receive updates about new offers
                    </p>
                  </div>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <Toggle
                    checked={notifyOffers}
                    onChange={() => setNotifyOffers(!notifyOffers)}
                  />
                </div>
              </div>

              {/* Shop Updates */}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <HiOutlineEnvelope size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Shop Updates
                    </h3>
                    <p className="text-sm text-slate-500">
                      Receive shop and offer updates
                    </p>
                  </div>
                </div>
                <div className="flex justify-start sm:justify-end">
                  <Toggle
                    checked={notifyShopUpdates}
                    onChange={() => setNotifyShopUpdates(!notifyShopUpdates)}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row sm:justify-end"
          >
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-105 hover:shadow-xl disabled:opacity-50 sm:w-auto"
            >
              {saving ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <HiOutlineCheck size={18} />
                  Save Settings
                </>
              )}
            </button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-sm"
          >
            <div className="border-b border-red-200 px-5 sm:px-6 py-4 bg-red-100/30">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl bg-red-200 p-2.5 text-red-600">
                  <HiOutlineTrash size={20} />
                </div>
                <h2 className="text-lg font-bold text-red-600 sm:text-xl">
                  Danger Zone
                </h2>
                <span className="ml-auto rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-700">
                  <HiOutlineExclamationTriangle
                    className="inline mr-1"
                    size={14}
                  />
                  Irreversible
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm text-slate-600">
                Deleting your shop account is permanent and all data will be
                removed. This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:scale-105 hover:shadow-xl sm:w-auto"
              >
                <HiOutlineTrash size={18} />
                Delete Shop Account
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteShop}
        isLoading={isDeleting}
      />
    </>
  );
}
