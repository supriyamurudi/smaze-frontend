import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineKey,
  HiOutlineSave,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineUserCircle,
  HiOutlineCamera,
} from "react-icons/hi2";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../../services/adminService";

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        // Handle different response structures
        const userData = response.user || response.data || response;
        setProfile(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await updateProfile(formData);
      toast.success("Profile updated successfully!");
      const userData = response.user || response.data || response;
      setProfile(userData);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setUpdating(true);
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-slate-200 rounded"></div>
              <div className="h-32 bg-slate-200 rounded-2xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                    <div className="h-12 bg-slate-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center ring-4 ring-white relative group">
                <HiOutlineUserCircle size={56} className="text-violet-600" />
                <button className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineCamera size={24} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-14 px-8 pb-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {profile?.name || "Admin"}
                </h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-sm text-slate-500">
                    {profile?.email}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">
                    <HiOutlineShieldCheck size={14} />
                    {profile?.role || "Admin"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${profile?.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    <HiOutlineCheckCircle size={14} />
                    {profile?.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0 text-sm text-slate-500 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <HiOutlineCalendar size={16} />
                  <span>
                    Joined:{" "}
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HiOutlineClock size={16} />
                  <span>
                    Updated:{" "}
                    {profile?.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineUser size={18} />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineMail size={18} />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium shadow-lg shadow-violet-200 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <HiOutlineSave size={18} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
                >
                  <HiOutlineKey size={18} />
                  Change Password
                </button>
              </div>
            </form>

            {/* Password Change Form */}
            {showPasswordForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-slate-100"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Change Password
                </h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {updating ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <HiOutlineKey size={18} />
                          Update Password
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
                    >
                      <HiOutlineX size={18} />
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h4 className="text-sm font-medium text-slate-500">Total Shops</h4>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {profile?._count?.shops || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h4 className="text-sm font-medium text-slate-500">Saved Offers</h4>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {profile?._count?.savedOffers || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <h4 className="text-sm font-medium text-slate-500">Offer Claims</h4>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {profile?._count?.offerClaims || 0}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
