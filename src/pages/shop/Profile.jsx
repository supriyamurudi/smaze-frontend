// frontend/src/pages/shop/Profile.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  HiOutlineCamera,
  HiOutlineCheckBadge,
  HiOutlineMapPin,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { getMyShop, updateShop } from "../../services/shopService";

// ========== SKELETON LOADER (Mobile optimized) ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div>
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
    </div>
    <div className="rounded-3xl border bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col items-center">
        <div className="h-28 w-28 rounded-full bg-slate-200 animate-pulse"></div>
        <div className="mt-4 h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-11 bg-slate-200 rounded-xl animate-pulse"></div>
          </div>
        ))}
        <div className="md:col-span-2">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
          <div className="h-11 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-end border-t pt-6">
        <div className="h-11 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

// ========== FORM FIELD ==========
const FormField = ({ label, required, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ className = "", disabled = false, ...props }) => (
  <input
    className={`w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 ${
      disabled ? "cursor-not-allowed opacity-60" : ""
    } ${className}`}
    disabled={disabled}
    {...props}
  />
);

// ========== MAIN COMPONENT ==========
export default function Profile() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  // =========================
  // Load Shop Profile
  // =========================
  useEffect(() => {
    const loadShop = async () => {
      try {
        const response = await getMyShop();
        const shop = response.shop;

        setFormData({
          name: shop.name || "",
          ownerName: shop.owner?.name || "",
          email: shop.owner?.email || "",
          phone: shop.phone || "",
          address: shop.address || "",
          latitude: shop.latitude || "",
          longitude: shop.longitude || "",
        });

        setPreview(shop.image || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load shop profile");
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, []);

  // =========================
  // Input Change
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // Image Change
  // =========================
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

  // =========================
  // Get Current Location
  // =========================
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`,
          );
          const data = await response.json();
          const address = data.address;

          const formattedAddress = [
            address.road,
            address.suburb,
            address.neighbourhood,
            address.city || address.town || address.village,
            address.state,
            address.postcode,
          ]
            .filter(Boolean)
            .join(", ");

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            address: formattedAddress,
          }));

          toast.success("Current location selected");
        } catch {
          toast.error("Failed to fetch address");
        } finally {
          setGettingLocation(false);
        }
      },
      () => {
        toast.error("Unable to get current location");
        setGettingLocation(false);
      },
    );
  };

  // =========================
  // Update Profile
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);

      if (image) {
        data.append("image", image);
      }

      await updateShop(data);
      toast.success("Profile updated successfully 🎉");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20"
    >
      {/* Removed mx-auto, max-w-5xl, p-8 - ShopLayout handles spacing! */}
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-4xl">
                Shop Profile
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Manage your shop details and public information
              </p>
            </div>
            <span className="self-start rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 sm:self-center">
              <HiOutlineCheckBadge className="inline mr-1" size={16} />
              Verified
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
          <div className="p-4 sm:p-8 space-y-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={preview || "https://via.placeholder.com/128"}
                  alt="Shop"
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-violet-100 shadow-lg transition group-hover:border-violet-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/128";
                  }}
                />
                <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg transition hover:scale-110">
                  <HiOutlineCamera size={20} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">
                  {formData.name}
                </h2>
                <HiOutlineCheckBadge className="text-violet-600" size={20} />
              </div>
              <p className="text-sm text-slate-500">Verified Shop</p>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Shop Name" required>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter shop name"
                />
              </FormField>

              <FormField label="Owner Name">
                <Input
                  type="text"
                  value={formData.ownerName}
                  disabled
                  placeholder="Owner name"
                />
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  placeholder="Email address"
                />
              </FormField>

              <FormField label="Phone Number">
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Shop Address">
                  {/* Stack on Mobile, Side-by-side on Desktop */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter shop address"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleCurrentLocation}
                      disabled={gettingLocation}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-medium text-white transition hover:scale-105 hover:shadow-lg disabled:opacity-50 sm:w-auto"
                    >
                      {gettingLocation ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        <HiOutlineMapPin size={20} />
                      )}
                      Location
                    </button>
                  </div>
                </FormField>
              </div>
            </div>

            {/* Location Preview */}
            {formData.address && (
              <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-emerald-200 p-2 text-emerald-600">
                    <HiOutlineMapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">
                      📍 Current Location
                    </h3>
                    <p className="mt-1 text-sm text-emerald-700">
                      {formData.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Map Preview */}
            {formData.latitude && formData.longitude && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">
                  Location Preview
                </h3>
                <iframe
                  title="Shop Location"
                  src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=16&output=embed`}
                  className="h-64 w-full rounded-2xl border border-slate-200 sm:h-72"
                  loading="lazy"
                />
                <a
                  href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:scale-105 hover:shadow-lg sm:w-auto"
                >
                  <HiOutlineArrowTopRightOnSquare size={18} />
                  Open in Google Maps
                </a>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={saving}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3 font-semibold text-white transition sm:w-auto ${
                  saving
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-200 hover:scale-105 hover:shadow-xl"
                }`}
              >
                {saving ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
