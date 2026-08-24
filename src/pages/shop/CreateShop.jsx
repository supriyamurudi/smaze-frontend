// frontend/src/pages/shop/CreateShop.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlinePhoto,
  HiOutlineBuildingStorefront,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

import toast from "react-hot-toast";
import { createShop } from "../../services/shopService";
import { getCategories } from "../../services/categoryService";

// ========== SKELETON LOADER (Mobile optimized) ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
    <div className="h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-5">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
          <div className="h-11 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
      ))}
      <div>
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
        <div className="h-40 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="h-12 bg-slate-200 rounded-2xl animate-pulse"></div>
    </div>
  </div>
);

// ========== FORM FIELD COMPONENT ==========
const FormField = ({ label, required, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${className}`}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${className}`}
    {...props}
  >
    {children}
  </select>
);

// ========== IMAGE UPLOAD COMPONENT (Mobile friendly) ==========
const ImageUpload = ({ preview, onImageChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageChange(file);
    } else {
      toast.error("Please upload an image file");
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageChange(e.target.files[0])}
        className="hidden"
        id="shopImage"
      />
      <label
        htmlFor="shopImage"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 transition-all duration-300 ${
          dragActive
            ? "border-violet-500 bg-violet-50"
            : preview
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/30"
        }`}
      >
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-40 rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onImageChange(null, true);
              }}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition hover:scale-110"
            >
              <HiOutlineXCircle size={18} />
            </button>
          </div>
        ) : (
          <>
            <HiOutlinePhoto size={40} className="text-violet-600" />
            <p className="mt-2 text-center text-sm text-slate-600">
              <span className="font-semibold text-violet-600">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="mt-1 text-xs text-slate-400">PNG, JPG (Max 2MB)</p>
          </>
        )}
      </label>
    </>
  );
};

// ========== PENDING APPROVAL COMPONENT (PERFECT MOBILE FIX) ==========
const PendingApproval = ({ shopName }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4 sm:mb-6">
            <HiOutlineClock className="text-amber-600 text-3xl sm:text-4xl" />
          </div>

          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mb-3">
            Shop Submitted for Review
          </h2>

          <p className="text-sm sm:text-base text-slate-500 mb-6">
            Your shop{" "}
            <span className="font-semibold text-slate-800">"{shopName}"</span>{" "}
            has been successfully submitted. Our admin team will review your
            shop details and verify it.
          </p>

          {/* Status Timeline */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-6 text-left">
            {/* Heading shortened to fit on one line! */}
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 flex-shrink-0">
              <HiOutlineShieldCheck className="text-violet-600 flex-shrink-0" />
              Status
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <HiOutlineCheckCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">Shop Created</p>
                  <p className="text-sm text-slate-500">
                    Your shop has been registered
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <HiOutlineClock size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-800">Pending Review</p>
                  <p className="text-sm text-slate-500">
                    Admin is reviewing your shop
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                  <HiOutlineCheckCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-500">Approved</p>
                  <p className="text-sm text-slate-400">
                    Your shop will be active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <HiOutlineInformationCircle className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  What happens next?
                </p>
                <ul className="text-xs sm:text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Admin will review your shop details</li>
                  <li>• You'll receive a notification once approved</li>
                  <li>• You can start creating offers after approval</li>
                  <li>• This usually takes 24-48 hours</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/shop/dashboard")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ==========
export default function CreateShop() {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [createdShopName, setCreatedShopName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    categoryId: "",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setPageLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (file, remove = false) => {
    if (remove) {
      setImage(null);
      setPreview("");
      return;
    }
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Shop name is required");
    if (!formData.address.trim()) return toast.error("Address is required");
    if (!formData.phone.trim()) return toast.error("Phone number is required");
    if (!formData.categoryId) return toast.error("Please select a category");

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      const res = await createShop(data);

      // Shop created successfully - show pending approval page
      setCreatedShopName(res.shop?.name || formData.name);
      setShowPending(true);

      toast.success(res.message || "Shop submitted for review! 🎉");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  // Show pending approval page
  if (showPending) {
    return <PendingApproval shopName={createdShopName} />;
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header (Mobile-first, compact) */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                Create Your Shop
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-500">
                Add your shop details and submit for verification
              </p>
            </div>
            <span className="self-start sm:self-center rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <HiOutlineClock className="inline mr-1" size={14} />
              Needs Approval
            </span>
          </div>

          {/* Info Banner (Compact) */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <HiOutlineShieldCheck className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Shop Verification Required
                </p>
                <p className="text-xs sm:text-sm text-blue-700">
                  Your shop will be reviewed by our admin team before it becomes
                  visible to customers. This ensures a trusted marketplace.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Shop Name */}
            <FormField label="Shop Name" required>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Pizza Hub"
              />
            </FormField>

            {/* Address */}
            <FormField label="Address" required>
              <Textarea
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="Shop Address"
              />
            </FormField>

            {/* Phone */}
            <FormField label="Phone Number" required>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </FormField>

            {/* Category */}
            <FormField label="Category" required>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Shop Image
              </label>
              <ImageUpload
                preview={preview}
                onImageChange={handleImageChange}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full rounded-2xl py-3.5 sm:py-4 font-bold text-white transition-all ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-200 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting Shop...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <HiOutlineCheckCircle size={20} />
                  Submit for Review
                </span>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-4 sm:p-5 border border-violet-100">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-violet-200 p-2 text-violet-600">
                <HiOutlineBuildingStorefront size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                  Shop Tips
                </h3>
                <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-600">
                  <li>• Add a clear shop logo to attract customers</li>
                  <li>• Provide accurate address for location-based offers</li>
                  <li>• Select the right category for better visibility</li>
                  <li>• Keep your contact details up to date</li>
                  <li>• Complete verification to unlock all features</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
