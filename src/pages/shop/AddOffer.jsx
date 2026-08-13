// pages/shop/AddOffer.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlineCloudArrowUp,
  HiOutlinePhoto,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getCategories } from "../../services/categoryService";
import { createOffer } from "../../services/offerService";
import WhatsAppChannelModal from "../../components/WhatsAppChannelModal";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    <div>
      <div className="h-10 w-48 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-2 h-6 w-64 bg-slate-200 rounded animate-pulse"></div>
    </div>
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="h-32 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-4 h-64 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
const AddOffer = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // WhatsApp Modal state
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [channelLink, setChannelLink] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    categoryId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load categories",
        );
      } finally {
        setPageLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload an image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an offer image");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("discount", formData.discount);
      data.append("categoryId", formData.categoryId);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      if (image) {
        data.append("image", image);
      }

      const response = await createOffer(data);

      // Check if WhatsApp channel message is available
      if (response?.notifications?.channel?.message) {
        setWhatsappMessage(response.notifications.channel.message);
        setChannelLink(response.notifications.channel.channelLink || "");
        setShowWhatsAppModal(true);
        toast.success("Offer created successfully 🎉");
      } else {
        toast.success("Offer created successfully 🎉");
        navigate("/shop/my-offers");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create offer");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
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
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          {/* ========== HEADER ========== */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-black text-slate-900">
                  Add New Offer
                </h1>
                <p className="mt-1 text-slate-500">
                  Create attractive offers for customers
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <HiOutlineCheckCircle className="inline mr-1" size={14} />
                  Draft
                </span>
              </div>
            </div>
          </motion.div>

          {/* ========== FORM ========== */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Offer Information */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4">
                <div className="flex items-center gap-2">
                  <HiOutlineTag className="text-violet-600" size={20} />
                  <h2 className="font-semibold text-slate-800">
                    Offer Information
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Offer Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., 50% Off on Pizza"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </div>

                {/* Category & Discount */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Discount (%) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="e.g., 25"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      <HiOutlineCalendar className="inline mr-1" size={16} />
                      Start Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      <HiOutlineCalendar className="inline mr-1" size={16} />
                      End Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    <HiOutlineDocumentText className="inline mr-1" size={16} />
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your offer in detail..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition resize-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Image Upload */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4">
                <div className="flex items-center gap-2">
                  <HiOutlinePhoto className="text-violet-600" size={20} />
                  <h2 className="font-semibold text-slate-800">Offer Image</h2>
                  <span className="text-xs text-rose-500">*</span>
                </div>
              </div>
              <div className="p-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="offerImage"
                />

                <label
                  htmlFor="offerImage"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-300 ${
                    dragActive
                      ? "border-violet-500 bg-violet-50"
                      : imagePreview
                        ? "border-emerald-400 bg-emerald-50/30"
                        : "border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/30"
                  }`}
                >
                  {imagePreview ? (
                    <div className="w-full">
                      <div className="relative overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-[400px] w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white transition hover:scale-110 hover:bg-red-600"
                        >
                          <HiOutlineXCircle size={20} />
                        </button>
                      </div>
                      <p className="mt-3 text-sm font-medium text-emerald-600">
                        ✅ {image?.name || "Image uploaded"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 rounded-full bg-violet-100 p-4 text-violet-600">
                        <HiOutlineCloudArrowUp size={32} />
                      </div>
                      <p className="text-center text-slate-600">
                        <span className="font-semibold text-violet-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        PNG, JPG, WEBP (Max 5MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full overflow-hidden rounded-2xl py-4 font-bold text-white transition-all duration-300 ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-200 hover:scale-[1.01] hover:shadow-xl"
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
                    Publishing Offer...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <HiOutlineCheckCircle size={20} />
                    Publish Offer
                  </span>
                )}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>

      {/* WhatsApp Channel Modal */}
      <WhatsAppChannelModal
        isOpen={showWhatsAppModal}
        onClose={() => {
          setShowWhatsAppModal(false);
          navigate("/shop/my-offers");
        }}
        message={whatsappMessage}
        channelLink={channelLink}
      />
    </>
  );
};

export default AddOffer;
