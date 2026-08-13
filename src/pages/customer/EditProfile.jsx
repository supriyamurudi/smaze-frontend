import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineArrowLeft,
  HiOutlineCamera,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getMyProfile, updateProfile } from "../../services/profileService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-10 rounded-full bg-slate-200"></div>
      <div className="h-8 bg-slate-200 rounded w-48"></div>
    </div>
    <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-slate-200"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div className="h-5 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-12 bg-slate-200 rounded-xl"></div>
          </div>
        ))}
        <div className="flex justify-end gap-4 pt-4">
          <div className="h-12 bg-slate-200 rounded-xl w-24"></div>
          <div className="h-12 bg-slate-200 rounded-xl w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
const EditProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        const user = response.user;

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          city: user.city || "",
          address: user.address || "",
        });

        setPreview(
          user.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=7c3aed&color=fff&size=256&bold=true`,
        );
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      formData.phone &&
      !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (formData.city && formData.city.length < 2) {
      newErrors.city = "City name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("city", formData.city);
      data.append("address", formData.address);

      if (image) {
        data.append("image", image);
      }

      await updateProfile(data);
      toast.success("Profile updated successfully! 🎉");
      navigate("/customer/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md transition hover:shadow-lg hover:scale-105"
          >
            <HiOutlineArrowLeft
              size={22}
              className="text-slate-600 group-hover:text-violet-600"
            />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Edit Profile</h1>
            <p className="text-sm text-slate-500">
              Update your personal information
            </p>
          </div>
        </motion.div>

        {/* ========== FORM ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl bg-white shadow-xl"
          >
            <div className="p-6 sm:p-8 space-y-8">
              {/* ===== PROFILE IMAGE ===== */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-violet-100 shadow-lg transition group-hover:border-violet-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100 flex items-center justify-center">
                      <HiOutlineCamera size={28} className="text-white" />
                    </div>
                  </div>
                  <label className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transition hover:scale-110">
                    <HiOutlineCamera size={18} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </label>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Click the camera icon to change photo
                </p>
              </div>

              {/* ===== FORM FIELDS ===== */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HiOutlineUser className="text-violet-600" size={18} />
                    Full Name
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.name
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HiOutlineEnvelope className="text-violet-600" size={18} />
                    Email Address
                  </label>
                  <input
                    value={formData.email}
                    disabled
                    className="w-full rounded-xl border-0 bg-slate-100 px-4 py-3.5 text-slate-500 shadow-sm outline-none ring-1 ring-slate-200 cursor-not-allowed"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HiOutlinePhone className="text-violet-600" size={18} />
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.phone
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HiOutlineMapPin className="text-violet-600" size={18} />
                    City
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.city
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HiOutlinePencilSquare
                      className="text-violet-600"
                      size={18}
                    />
                    Address
                  </label>
                  <textarea
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
              </div>

              {/* ===== FORM ACTIONS ===== */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-50 hover:scale-[1.02]"
                >
                  <HiOutlineXMark size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <HiOutlineCheck size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* ========== TIPS CARD ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-5 border border-violet-100">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-violet-200 p-2 text-violet-600">
                <HiOutlineUser size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Profile Tips</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  <li>• Keep your profile information up to date</li>
                  <li>• Add a profile photo to personalize your account</li>
                  <li>• Your email address cannot be changed</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
