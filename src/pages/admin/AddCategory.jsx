import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePhoto,
  HiOutlineTag,
  HiOutlineFolder,
  HiOutlinePlus,
} from "react-icons/hi2";

import { createCategory } from "../../services/categoryService";

// ========== IMAGE UPLOAD ==========
const ImageUpload = ({ register, setValue, error }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }
      setPreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setPreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setValue("image", null);
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Category Image <span className="text-rose-500">*</span>
      </label>
      <div
        className={`relative rounded-2xl border-2 border-dashed transition ${
          isDragging
            ? "border-violet-500 bg-violet-50"
            : preview
              ? "border-emerald-300 bg-emerald-50/30"
              : "border-slate-300 hover:border-violet-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative p-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                <img
                  src={preview}
                  alt="Category preview"
                  className="h-32 w-32 rounded-xl object-cover border-2 border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white transition hover:scale-110"
                  title="Remove image"
                >
                  <HiOutlineXCircle size={20} />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-medium text-slate-700">
                  Image uploaded successfully!
                </p>
                <p className="text-xs text-slate-500">
                  Click below to change or drag a new image
                </p>
                <div className="mt-3">
                  <label className="cursor-pointer rounded-lg bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-200">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center px-6 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <HiOutlinePhoto size={32} className="text-violet-600" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600">
              Click to upload or drag & drop
            </p>
            <p className="mt-1 text-xs text-slate-400">
              PNG, JPG, WEBP (Max 5MB)
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              {...register("image", {
                required: "Category image is required",
              })}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-rose-500">{error.message}</p>}
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const AddCategory = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name);

      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      console.log("📦 Submitting category:", Object.fromEntries(formData));

      await createCategory(formData);

      toast.success("Category created successfully! 🎉");
      reset();
      setValue("image", null);
      navigate("/admin/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-4xl">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link to="/admin/categories">
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
                Add Category
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Create a new category for your marketplace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              <HiOutlinePlus size={16} />
              New Category
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
              <HiOutlineFolder size={16} />
              Category
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
                  <HiOutlineFolder size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Category Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Category Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <HiOutlineTag size={18} />
                    </div>
                    <input
                      {...register("name", {
                        required: "Category name is required",
                      })}
                      className={`w-full rounded-xl border-0 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-800 shadow-sm outline-none ring-1 transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.name
                          ? "ring-rose-500 focus:ring-rose-500"
                          : "ring-slate-200 focus:ring-violet-500"
                      }`}
                      placeholder="Enter category name..."
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-rose-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Image Upload */}
            <section className="border-t border-slate-200 pt-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 p-2.5 text-pink-700">
                  <HiOutlinePhoto size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Category Image
                </h2>
              </div>

              <ImageUpload
                register={register}
                setValue={setValue}
                error={errors.image}
              />
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:justify-end sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setValue("image", null);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                <HiOutlineXCircle size={18} />
                Reset
              </button>
              <Link to="/admin/categories">
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
                    Creating...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle size={18} />
                    Create Category
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddCategory;
