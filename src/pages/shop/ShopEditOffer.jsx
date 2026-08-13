import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HiOutlinePhoto,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlinePercentBadge,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getOfferById, updateOffer } from "../../services/offerService";
import { getCategories } from "../../services/categoryService";

// ========== FORM FIELD ==========
const FormField = ({ label, required, icon: Icon, children }) => (
  <div>
    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
      {Icon && <Icon size={16} className="text-violet-600" />}
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 resize-none focus:ring-2 focus:ring-violet-500 ${className}`}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition focus:ring-2 focus:ring-violet-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);

// ========== MAIN COMPONENT ==========
export default function ShopEditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    categoryId: "",
  });

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const [offerRes, categoryRes] = await Promise.all([
          getOfferById(id),
          getCategories(),
        ]);

        if (ignore) return;

        const offer = offerRes.offer;

        setCategories(categoryRes.categories || []);

        setFormData({
          title: offer.title || "",
          description: offer.description || "",
          discount: offer.discount || "",
          categoryId: offer.categoryId || "",
        });

        setPreview(offer.image || "");
      } catch (error) {
        if (!ignore) {
          console.error(error);
          toast.error("Failed to load offer.");
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return toast.error("Title is required");
    }
    if (!formData.description.trim()) {
      return toast.error("Description is required");
    }
    if (!formData.discount || formData.discount <= 0) {
      return toast.error("Valid discount percentage is required");
    }
    if (!formData.categoryId) {
      return toast.error("Category is required");
    }

    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("image", image);
      await updateOffer(id, data);
      toast.success("Offer updated successfully 🎉");
      navigate("/shop/my-offers");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update offer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/shop/my-offers")}
                  className="rounded-full bg-white p-2 shadow-sm transition hover:shadow-md hover:scale-105"
                >
                  <HiOutlineArrowLeft size={20} className="text-slate-600" />
                </button>
                <div>
                  <h1 className="text-4xl font-black text-slate-900">
                    Edit Offer
                  </h1>
                  <p className="mt-1 text-slate-500">
                    Update your offer details
                  </p>
                </div>
              </div>
            </div>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              <HiOutlineTag className="inline mr-1" size={16} />
              Edit Mode
            </span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm"
        >
          <div className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <FormField label="Offer Title" required icon={HiOutlineTag}>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., 50% Off on Pizza"
                required
              />
            </FormField>

            {/* Description */}
            <FormField
              label="Description"
              required
              icon={HiOutlineDocumentText}
            >
              <Textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your offer in detail..."
                required
              />
            </FormField>

            {/* Discount & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Discount (%)"
                required
                icon={HiOutlinePercentBadge}
              >
                <Input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="e.g., 25"
                  min="1"
                  max="100"
                  required
                />
              </FormField>

              <FormField label="Category" required icon={HiOutlineTag}>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {/* Image */}
            <FormField label="Offer Image" icon={HiOutlinePhoto}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {preview && (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Offer"
                      className="h-28 w-28 rounded-xl border border-slate-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition hover:scale-110"
                    >
                      <HiOutlineXCircle size={16} />
                    </button>
                  </div>
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-violet-50 px-5 py-3 font-medium text-violet-700 transition hover:bg-violet-100">
                  <HiOutlinePhoto size={22} />
                  {preview ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
                <p className="text-xs text-slate-400">PNG, JPG (Max 2MB)</p>
              </div>
            </FormField>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/shop/my-offers")}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 hover:scale-[1.02]"
              >
                <HiOutlineXCircle size={18} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition ${
                  saving
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-200 hover:scale-[1.02] hover:shadow-xl"
                }`}
              >
                {saving ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={18} />
                    Update Offer
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
