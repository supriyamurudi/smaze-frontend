import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineBuildingStorefront,
  HiOutlineUser,
  HiOutlineEnvelope, // ✅ Fixed: Changed from HiOutlineMail to HiOutlineEnvelope
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePlus,
} from "react-icons/hi2";

// ========== MAIN COMPONENT ==========
export default function AddShop() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const formData = new FormData();
      formData.append("shopName", data.shopName);
      formData.append("ownerName", data.ownerName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("address", data.address);
      formData.append("description", data.description);

      if (imageFile) {
        formData.append("logo", imageFile);
      }

      console.log("Form Data:", Object.fromEntries(formData));

      toast.success("Shop added successfully! 🎉");
      reset();
      setImagePreview(null);
      setImageFile(null);
      navigate("/admin/shops");
    } catch {
      toast.error("Failed to add shop. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReset = () => {
    reset();
    setImagePreview(null);
    setImageFile(null);
  };

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
          <div className="flex items-center gap-4">
            <Link to="/admin/shops">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
              >
                <HiOutlineArrowLeft size={20} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Add New Shop
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Register a new business to start publishing offers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              <HiOutlinePlus size={16} />
              New Shop
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
              <HiOutlineBuildingStorefront size={16} />
              Registration
            </span>
          </div>
        </motion.div>

        {/* ========== FORM ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8 space-y-8"
          >
            {/* Basic Information */}
            <section>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-2.5 text-violet-700">
                  <HiOutlineBuildingStorefront size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Shop Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineBuildingStorefront size={18} />
                    </div>
                    <input
                      {...register("shopName", {
                        required: "Shop name is required",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.shopName
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                      placeholder="Enter shop name"
                    />
                  </div>
                  {errors.shopName && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.shopName.message}
                    </p>
                  )}
                </div>

                {/* Owner Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Owner Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineUser size={18} />
                    </div>
                    <input
                      {...register("ownerName", {
                        required: "Owner name is required",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.ownerName
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                      placeholder="Enter owner name"
                    />
                  </div>
                  {errors.ownerName && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.ownerName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineEnvelope size={18} /> {/* ✅ Updated here */}
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
                      placeholder="shop@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlinePhone size={18} />
                    </div>
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Enter a valid 10-digit phone number",
                        },
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.phone
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineTag size={18} />
                    </div>
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition appearance-none focus:ring-2 ${
                        errors.category
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                    >
                      <option value="">Select Category</option>
                      <option value="fashion">Fashion</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="electronics">Electronics</option>
                      <option value="grocery">Grocery</option>
                      <option value="salon">Salon</option>
                      <option value="medical">Medical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {errors.category && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition appearance-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 p-2.5 text-emerald-700">
                  <HiOutlineMapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Shop Address
                </h2>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-4 text-slate-400">
                  <HiOutlineMapPin size={18} />
                </div>
                <textarea
                  {...register("address", {
                    required: "Address is required",
                  })}
                  rows="4"
                  className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 resize-none focus:ring-2 ${
                    errors.address
                      ? "ring-rose-500 focus:ring-rose-500"
                      : "ring-slate-200 focus:ring-violet-500"
                  }`}
                  placeholder="Enter complete shop address"
                />
              </div>
              {errors.address && (
                <p className="mt-1.5 text-sm text-rose-500">
                  {errors.address.message}
                </p>
              )}
            </section>

            {/* Description */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 p-2.5 text-amber-700">
                  <HiOutlineDocumentText size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Shop Description
                </h2>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-4 text-slate-400">
                  <HiOutlineDocumentText size={18} />
                </div>
                <textarea
                  {...register("description")}
                  rows="5"
                  className="w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Write a short description about the shop..."
                />
              </div>
            </section>

            {/* Shop Logo */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 p-2.5 text-pink-700">
                  <HiOutlinePhoto size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Shop Logo</h2>
              </div>

              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Shop Logo"
                      className="h-32 w-32 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/128";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition hover:scale-110"
                    >
                      <HiOutlineXCircle size={16} />
                    </button>
                  </div>
                )}

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-6 transition hover:border-violet-400 hover:bg-violet-50/30 sm:flex-1">
                  <HiOutlinePhoto size={32} className="text-slate-400" />
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {imagePreview ? "Change Logo" : "Upload Logo"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG, SVG (Max 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:justify-end sm:gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                <HiOutlineXCircle size={18} />
                Reset
              </button>
              <Link to="/admin/shops">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                >
                  <HiOutlineXCircle size={18} />
                  Cancel
                </button>
              </Link>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition sm:w-auto ${
                  submitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-200 hover:shadow-xl"
                }`}
              >
                {submitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={18} />
                    Add Shop
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
