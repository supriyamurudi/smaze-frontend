import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
  HiOutlineMapPin,
  HiOutlineBell,
  HiOutlineTag,
  HiOutlineCheck,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";

import { getSettings, updateSettings } from "../../services/settingsService";

const categories = ["Food", "Fashion", "Electronics", "Salon", "Fitness"];

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div>
      <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
      <div className="mt-2 h-6 w-64 bg-slate-200 rounded animate-pulse"></div>
    </div>

    {/* Settings Card Skeleton */}
    <div className="bg-white rounded-3xl shadow-sm border p-8 space-y-8">
      {/* Location Section */}
      <div>
        <div className="h-6 w-24 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-4 h-12 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="mt-4 h-24 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Categories Section */}
      <div>
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="flex flex-wrap gap-3 mt-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-20 bg-slate-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Notifications Section */}
      <div>
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button Skeleton */}
      <div className="border-t pt-6 flex justify-end">
        <div className="h-12 w-36 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

// ========== MAIN COMPONENT ==========
const Settings = () => {
  const [settings, setSettings] = useState({
    city: "",
    address: "",
    notifyOffers: true,
    notifyExpiry: true,
    notifyShopUpdates: false,
    preferredCategories: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // Load Settings - Now defined INSIDE the effect
  // =========================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSettings();
        setSettings(response.settings);
      } catch (error) {
        console.error("Load settings error:", error);
        toast.error(error.response?.data?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    setSettings((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // Category Select
  // =========================

  const toggleCategory = (category) => {
    setSettings((previous) => ({
      ...previous,
      preferredCategories: previous.preferredCategories.includes(category)
        ? previous.preferredCategories.filter((item) => item !== category)
        : [...previous.preferredCategories, category],
    }));
  };

  // =========================
  // Save Settings
  // =========================

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Update settings error:", error);
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Settings</h1>
              <p className="mt-1 text-slate-500">
                Manage your preferences and notifications
              </p>
            </div>
            <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
              <HiOutlineCog6Tooth className="inline mr-1" size={16} />
              Preferences
            </div>
          </div>
        </motion.div>

        {/* ========== SETTINGS CARD ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100"
        >
          <div className="p-6 sm:p-8 space-y-8">
            {/* ===== LOCATION SECTION ===== */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineMapPin className="text-violet-600" size={22} />
                <h2 className="text-xl font-bold text-slate-800">Location</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={settings.city || ""}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={settings.address || ""}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your full address"
                    className="w-full rounded-xl border-0 bg-slate-50 px-4 py-3.5 text-slate-800 shadow-sm outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* ===== CATEGORIES SECTION ===== */}
            <section className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineTag className="text-violet-600" size={22} />
                <h2 className="text-xl font-bold text-slate-800">
                  Preferred Categories
                </h2>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                Select categories you're interested in
              </p>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const isSelected =
                    settings.preferredCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`group relative px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md hover:shadow-lg"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {category}
                        {isSelected && (
                          <HiOutlineCheck size={16} className="text-white" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ===== NOTIFICATIONS SECTION ===== */}
            <section className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineBell className="text-violet-600" size={22} />
                <h2 className="text-xl font-bold text-slate-800">
                  Notifications
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: "notifyOffers",
                    label: "New offers nearby",
                    checked: settings.notifyOffers,
                  },
                  {
                    id: "notifyExpiry",
                    label: "Offer expiry reminders",
                    checked: settings.notifyExpiry,
                  },
                  {
                    id: "notifyShopUpdates",
                    label: "Shop updates and announcements",
                    checked: settings.notifyShopUpdates,
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [item.id]: e.target.checked,
                        })
                      }
                      className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                    />
                    <span className="text-slate-700 font-medium">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* ===== SAVE BUTTON ===== */}
            <div className="border-t border-slate-100 pt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <HiOutlineCheck size={18} />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
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
                <HiOutlineBell size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Settings Tips</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  <li>• Update your location for personalized offers</li>
                  <li>• Choose categories you're interested in</li>
                  <li>• Manage notification preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
