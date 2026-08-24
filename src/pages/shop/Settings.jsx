// frontend/src/pages/shop/Settings.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineXMark,
  HiOutlineBuildingStorefront,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
  HiOutlineEnvelope,
  HiOutlineCog6Tooth,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlinePaintBrush,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    shopName: "Beauty Salon",
    email: "beauty@smaze.com",
    phone: "8656787656",
    address: "123 Main Street, New York, NY 10001",
    website: "https://beautysalon.example.com",
    businessHours: {
      monday: "9:00 AM - 9:00 PM",
      tuesday: "9:00 AM - 9:00 PM",
      wednesday: "9:00 AM - 9:00 PM",
      thursday: "9:00 AM - 9:00 PM",
      friday: "9:00 AM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "10:00 AM - 8:00 PM",
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    theme: "light",
  });

  const tabs = [
    { id: "general", label: "General", icon: HiOutlineCog6Tooth },
    { id: "business", label: "Business", icon: HiOutlineBuildingStorefront },
    { id: "notifications", label: "Notifications", icon: HiOutlineBell },
    { id: "appearance", label: "Appearance", icon: HiOutlinePaintBrush },
    { id: "security", label: "Security", icon: HiOutlineShieldCheck },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked,
        },
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your shop preferences and configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              General Settings
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Update your shop's basic information
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Shop Name
                </label>
                <div className="relative">
                  <HiOutlineBuildingStorefront
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="shopName"
                    value={settings.shopName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter shop name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineEnvelope
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <div className="relative">
                  <HiOutlinePhone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Business Settings */}
        {activeTab === "business" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              Business Information
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Update your business details and location
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Address
                </label>
                <div className="relative">
                  <HiOutlineMapPin
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter shop address"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Website
                </label>
                <div className="relative">
                  <HiOutlineGlobeAlt
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="url"
                    name="website"
                    value={settings.website}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-10 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    placeholder="Enter website URL"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Business Hours
                </label>
                <div className="space-y-2">
                  {Object.entries(settings.businessHours).map(
                    ([day, hours]) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="w-24 text-sm capitalize text-slate-600">
                          {day}:
                        </span>
                        <input
                          type="text"
                          name={`businessHours.${day}`}
                          value={hours}
                          onChange={handleChange}
                          className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                          placeholder="e.g., 9:00 AM - 9:00 PM"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              Notification Preferences
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Choose how you want to receive notifications
            </p>

            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                >
                  <div>
                    <h4 className="font-medium text-slate-800 capitalize">
                      {key} Notifications
                    </h4>
                    <p className="text-xs text-slate-500">
                      Receive updates via {key}
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-slate-300 peer-checked:bg-violet-600 peer-focus:ring-2 peer-focus:ring-violet-200"></div>
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></span>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Appearance Settings */}
        {activeTab === "appearance" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-slate-800">Appearance</h2>
            <p className="mb-4 text-sm text-slate-500">
              Customize your shop's appearance
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["light", "dark", "system"].map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, theme }))
                      }
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        settings.theme === theme
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 hover:border-violet-300"
                      }`}
                    >
                      <span className="text-sm font-medium capitalize text-slate-700">
                        {theme}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-slate-800">Security</h2>
            <p className="mb-4 text-sm text-slate-500">
              Manage your account security settings
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800">
                      Change Password
                    </h4>
                    <p className="text-xs text-slate-500">
                      Update your password regularly
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-xs text-slate-500">
                      Add an extra layer of security
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <HiOutlineCheckCircle size={18} />
                Save Settings
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <HiOutlineXMark size={18} />
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Settings;
