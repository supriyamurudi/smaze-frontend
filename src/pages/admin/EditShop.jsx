// frontend/src/pages/admin/EditShop.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

import {
  getShopById,
  updateShop,
  getCategories,
} from "../../services/adminService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4 mb-8">
      <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse"></div>
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-1 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-8">
      <div>
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t pt-8">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
        <div className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="border-t pt-8">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
        <div className="h-64 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="border-t pt-8">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6"></div>
        <div className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
      <div className="flex justify-end gap-4 border-t pt-8">
        <div className="h-12 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
export default function EditShop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [shopData, setShopData] = useState(null);
  const [offerCount, setOfferCount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const [shopRes, categoriesRes] = await Promise.all([
          getShopById(id),
          getCategories(),
        ]);

        if (!ignore) {
          const shop = shopRes.shop;
          setShopData(shop);
          setOfferCount(shop._count?.offers || 0);

          reset({
            name: shop.name || "",
            ownerName: shop.owner?.name || "",
            phone: shop.phone || "",
            city: shop.city || "",
            address: shop.address || "",
            categoryId: shop.categoryId || "",
            status: shop.status || "pending",
            description: shop.description || "",
            latitude: shop.latitude || "",
            longitude: shop.longitude || "",
            googleMapLink: shop.googleMapLink || "",
          });

          setImagePreview(shop.image || null);
          setCategories(categoriesRes.categories || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load shop");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    } else {
      toast.error("Invalid shop ID");
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [id, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Getting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setValue("latitude", lat);
        setValue("longitude", lng);

        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        setValue("googleMapLink", mapsLink);

        toast.dismiss();
        toast.success("Location captured successfully!");
      },
      (error) => {
        toast.dismiss();
        toast.error("Failed to get location: " + error.message);
      },
    );
  };

  // ✅ UPDATED: Handle form submission with better error handling
  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      // ✅ Required fields
      formData.append("name", data.name || "");
      formData.append("phone", data.phone || "");
      formData.append("status", data.status || "pending");

      // ✅ Handle categoryId - only append if selected
      if (data.categoryId && data.categoryId !== "") {
        formData.append("categoryId", data.categoryId);
      }

      // ✅ Optional fields - only append if they have values
      if (data.city && data.city.trim() !== "") {
        formData.append("city", data.city.trim());
      }

      if (data.address && data.address.trim() !== "") {
        formData.append("address", data.address.trim());
      }

      if (data.description && data.description.trim() !== "") {
        formData.append("description", data.description.trim());
      }

      if (data.latitude && data.latitude.toString().trim() !== "") {
        formData.append("latitude", data.latitude);
      }

      if (data.longitude && data.longitude.toString().trim() !== "") {
        formData.append("longitude", data.longitude);
      }

      if (data.googleMapLink && data.googleMapLink.trim() !== "") {
        formData.append("googleMapLink", data.googleMapLink.trim());
      }

      // ✅ Image - only append if a new file is selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // ✅ Log FormData contents for debugging
      console.log("📝 Updating shop with data:");
      for (let [key, value] of formData.entries()) {
        console.log(
          `${key}: ${value instanceof File ? `[File: ${value.name}]` : value}`,
        );
      }

      const response = await updateShop(id, formData);
      console.log("✅ Update response:", response);

      toast.success("Shop updated successfully 🎉");
      navigate("/admin/shops");
    } catch (error) {
      console.error("❌ Update error:", error);
      console.error("❌ Error response:", error.response?.data);

      // Show more detailed error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update shop";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
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
                Edit Shop
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Update shop information and details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
              <HiOutlineBuildingStorefront size={16} />
              Edit Mode
            </span>
            {shopData && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
                <HiOutlineTag size={16} />
                {offerCount} Offers
              </span>
            )}
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
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    {...register("name", { required: "Shop name is required" })}
                    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.name
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                    placeholder="Enter shop name"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Owner Name
                  </label>
                  <input
                    {...register("ownerName")}
                    disabled
                    className="w-full rounded-xl border-0 bg-slate-100 px-4 py-3 text-sm text-slate-500 shadow-sm outline-none ring-1 ring-slate-200 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.phone
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                    placeholder="9876543210"
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    {...register("city")}
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("categoryId", {
                      required: "Category is required",
                    })}
                    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition focus:ring-2 ${
                      errors.categoryId
                        ? "ring-rose-500 focus:ring-rose-500"
                        : "ring-slate-200 focus:ring-violet-500"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="rejected">Rejected</option>
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
              <textarea
                {...register("address")}
                rows="3"
                className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter shop address"
              />
            </section>

            {/* Location */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5 text-blue-700">
                    <HiOutlineMapPin size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Shop Location
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <HiOutlineMapPin size={16} />
                  Get Current Location
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Latitude
                  </label>
                  <input
                    {...register("latitude")}
                    type="number"
                    step="any"
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g., 12.9716"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Longitude
                  </label>
                  <input
                    {...register("longitude")}
                    type="number"
                    step="any"
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g., 77.5946"
                  />
                </div>
              </div>

              {latitude && longitude && (
                <div className="mt-4">
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <iframe
                      title="Shop Location"
                      src={`https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
                      className="h-64 w-full"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      📍 Location: {latitude}, {longitude}
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700"
                    >
                      <HiOutlineGlobeAlt size={16} />
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              )}

              <input type="hidden" {...register("googleMapLink")} />
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
              <textarea
                {...register("description")}
                rows="4"
                className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-violet-500"
                placeholder="Write a short description about your shop..."
              />
            </section>

            {/* Logo Upload */}
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
                      alt="Shop"
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
                    PNG, JPG (Max 2MB)
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
              <Link to="/admin/shops">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                >
                  <HiOutlineXCircle size={18} />
                  Cancel
                </motion.button>
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
                    Updating...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={18} />
                    Update Shop
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
