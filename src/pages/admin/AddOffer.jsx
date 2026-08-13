import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlinePlus,
  HiOutlineTag,
  HiOutlineBuildingStorefront,
  HiOutlineCalendar,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlinePercentBadge,
} from "react-icons/hi2";

import {
  createOffer,
  updateOffer,
  getShops,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
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

// ========== IMAGE UPLOAD PREVIEW - COMPLETELY FIXED ==========
const ImageUpload = ({
  onImageChange,
  error,
  defaultImage = null,
  imageFile = null,
}) => {
  const [preview, setPreview] = useState(defaultImage);
  const fileInputRef = useRef(null);

  // Update preview when defaultImage changes (edit mode)
  useEffect(() => {
    if (defaultImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(defaultImage);
    }
  }, [defaultImage]);

  // ✅ NEW: Update preview when imageFile changes (new file selected)
  useEffect(() => {
    if (imageFile instanceof File) {
      const previewUrl = URL.createObjectURL(imageFile);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(previewUrl);

      // Cleanup previous URL when component unmounts or imageFile changes
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, or WEBP)");
        e.target.value = "";
        return;
      }

      // Pass the file to parent component
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    // Clean up object URL
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Offer Banner Image{" "}
        {!defaultImage && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Offer Preview"
              className="w-full max-h-64 rounded-xl object-cover border-2 border-slate-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition hover:scale-110"
            >
              <HiOutlineXCircle size={20} />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 transition hover:border-violet-400 hover:bg-violet-50/30">
            <HiOutlinePhoto size={40} className="text-slate-400" />
            <p className="mt-3 text-sm font-medium text-slate-600">
              Click to upload or drag & drop
            </p>
            <p className="mt-1 text-xs text-slate-400">
              PNG, JPG, WEBP (Max 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-rose-500">{error.message}</p>
        )}
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export default function AddOffer({ editData = null }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const isEdit = !!editData;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      shopId: "",
      categoryId: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
    },
  });

  const discount = Number(watch("discount")) || 0;

  // Fetch shops and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [shopsRes, categoriesRes] = await Promise.all([
          getShops(),
          getCategories(),
        ]);

        const shopsData = shopsRes.shops || shopsRes.data || shopsRes || [];
        const categoriesData =
          categoriesRes.categories || categoriesRes.data || categoriesRes || [];

        setShops(Array.isArray(shopsData) ? shopsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load shops and categories");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Populate form with edit data when available
  useEffect(() => {
    if (editData && shops.length > 0 && categories.length > 0) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        } catch {
          return "";
        }
      };

      reset({
        title: editData.title || "",
        shopId: editData.shopId || editData.shop?.id || "",
        categoryId: editData.categoryId || editData.category?.id || "",
        description: editData.description || "",
        discount: editData.discount || "",
        startDate: formatDateForInput(editData.startDate),
        endDate: formatDateForInput(editData.endDate || editData.validUntil),
      });

      // ✅ Reset imageFile when editing to prevent old files from being sent
      setImageFile(null);
    }
  }, [editData, shops, categories, reset]);

  // Handle image file change
  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      // Append all text fields
      formData.append("title", data.title);
      formData.append("shopId", data.shopId);
      formData.append("categoryId", data.categoryId);
      formData.append("description", data.description || "");
      formData.append("discount", data.discount || 0);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);

      // ✅ Enhanced logging for debugging
      console.log("🔍 Image file state:", {
        imageFile: imageFile,
        isFile: imageFile instanceof File,
        name: imageFile?.name,
        size: imageFile?.size,
        type: imageFile?.type,
        isEdit: isEdit,
        hasExistingImage: !!editData?.image,
      });

      // ✅ Append image file if it exists and is a File object
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
        console.log("✅ Image appended to FormData:", {
          name: imageFile.name,
          size: `${(imageFile.size / 1024).toFixed(2)} KB`,
          type: imageFile.type,
        });
      } else if (isEdit && editData?.image && !imageFile) {
        // If editing and no new image selected, keep the existing one
        console.log("📸 Keeping existing image:", editData.image);
        // Send a flag to backend to keep existing image
        formData.append("keepExistingImage", "true");
      } else {
        console.warn("⚠️ No image file to upload");
      }

      // ✅ Log all FormData entries for debugging
      console.log("📦 Final FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`,
          );
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      let response;
      if (isEdit) {
        response = await updateOffer(editData.id, formData);
        toast.success("Offer updated successfully! 🎉");
      } else {
        response = await createOffer(formData);
        toast.success("Offer created successfully! 🎉");
      }

      console.log("✅ Server response:", response);

      // Reset form
      reset();
      setImageFile(null);
      navigate("/admin/offers");
    } catch (error) {
      console.error("❌ Error saving offer:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Show specific error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save offer";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
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
            <Link to="/admin/offers">
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
                {isEdit ? "Edit Offer" : "Add New Offer"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isEdit
                  ? "Update your offer details"
                  : "Create attractive offers for your customers"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              {isEdit ? (
                <HiOutlineCheckCircle size={16} />
              ) : (
                <HiOutlinePlus size={16} />
              )}
              {isEdit ? "Edit Offer" : "New Offer"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
              <HiOutlineTag size={16} />
              {isEdit ? "Update" : "Promotion"}
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
            {/* Offer Information */}
            <section>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-2.5 text-violet-700">
                  <HiOutlineTag size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Offer Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Offer Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineTag size={18} />
                    </div>
                    <input
                      {...register("title", {
                        required: "Offer title is required",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.title
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                      placeholder="Enter offer title..."
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Shop */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Shop <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineBuildingStorefront size={18} />
                    </div>
                    <select
                      {...register("shopId", {
                        required: "Please select a shop",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition appearance-none focus:ring-2 ${
                        errors.shopId
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                    >
                      <option value="">Select Shop</option>
                      {shops.map((shop) => (
                        <option key={shop.id} value={shop.id}>
                          {shop.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.shopId && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.shopId.message}
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
                      {...register("categoryId", {
                        required: "Please select category",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition appearance-none focus:ring-2 ${
                        errors.categoryId
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.categoryId && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400">
                      <HiOutlineDocumentText size={18} />
                    </div>
                    <textarea
                      {...register("description")}
                      rows="4"
                      className="w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Describe your offer in detail..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 p-2.5 text-emerald-700">
                  <HiOutlineCurrencyRupee size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Pricing</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Discount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Discount Percentage <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlinePercentBadge size={18} />
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      {...register("discount", {
                        required: "Discount is required",
                        min: {
                          value: 0,
                          message: "Discount must be at least 0",
                        },
                        max: {
                          value: 100,
                          message: "Discount cannot exceed 100",
                        },
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.discount
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                      placeholder="Enter discount percentage (e.g., 25)"
                    />
                  </div>
                  {errors.discount && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.discount.message}
                    </p>
                  )}
                </div>

                {/* Discount Display */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Discount
                  </label>
                  <div className="flex h-12 items-center justify-between rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 px-4 ring-1 ring-violet-200">
                    <span className="text-xl font-bold text-violet-700">
                      {discount}%
                    </span>
                    <span className="text-xs font-medium text-violet-500">
                      <HiOutlinePercentBadge
                        className="inline mr-1"
                        size={14}
                      />
                      Discount applied
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Offer Duration */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5 text-blue-700">
                  <HiOutlineCalendar size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Offer Duration
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineClock size={18} />
                    </div>
                    <input
                      type="date"
                      {...register("startDate", {
                        required: "Start date is required",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition focus:ring-2 ${
                        errors.startDate
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineClock size={18} />
                    </div>
                    <input
                      type="date"
                      {...register("endDate", {
                        required: "End date is required",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition focus:ring-2 ${
                        errors.endDate
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Offer Banner */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 p-2.5 text-pink-700">
                  <HiOutlinePhoto size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Offer Banner
                </h2>
              </div>

              <ImageUpload
                onImageChange={handleImageChange}
                error={errors.image}
                defaultImage={editData?.image || null}
                imageFile={imageFile}
              />
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:justify-end sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setImageFile(null);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                <HiOutlineXCircle size={18} />
                Reset
              </button>
              <Link to="/admin/offers">
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
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={18} />
                    {isEdit ? "Update Offer" : "Create Offer"}
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
