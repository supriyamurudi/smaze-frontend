// frontend/src/pages/Signup.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineBuildingStorefront,
  HiOutlineKey,
  HiOutlineArrowLeft,
  HiOutlineShieldCheck,
  HiOutlinePhone,
} from "react-icons/hi2";

import { registerUser } from "../services/authService";

// ===============================
// STRICT EMAIL VALIDATION
// ===============================
const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// ===============================
// STRONG PASSWORD VALIDATION
// ===============================
const validatePassword = (password) => {
  // Minimum 8 characters
  if (password.length < 8)
    return "Password must be at least 8 characters long.";

  // At least one uppercase letter
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";

  // At least one lowercase letter
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";

  // At least one number
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";

  // At least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character.";

  return "";
};

// ===============================
// PHONE NUMBER VALIDATION (10 digits)
// ===============================
const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile: starts with 6-9, exactly 10 digits
  return phoneRegex.test(phone);
};

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER",
    shopName: "",
    adminSecret: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "role") {
        if (value !== "SHOP_OWNER") {
          updated.shopName = "";
        }
        if (value !== "ADMIN") {
          updated.adminSecret = "";
        }
      }

      return updated;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email:
          "Email must start with a letter and contain @ and a valid domain (e.g., john@example.com)",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone && !validatePhone(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits and start with 6-9.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handlePasswordBlur = () => {
    const passwordMsg = validatePassword(formData.password);
    if (formData.password && passwordMsg) {
      setErrors((prev) => ({
        ...prev,
        password: passwordMsg,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email =
        "Email must start with a letter and contain @ and a valid domain (e.g., john@example.com)";
    }

    // Strong Password Check
    const passwordMsg = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordMsg) {
      newErrors.password = passwordMsg;
    }

    // Phone Check (Optional but validated if present)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone =
        "Phone number must be exactly 10 digits and start with 6-9.";
    }

    if (formData.role === "SHOP_OWNER") {
      if (!formData.shopName.trim()) {
        newErrors.shopName = "Shop name is required";
      }
    }

    if (formData.role === "ADMIN") {
      if (!formData.adminSecret.trim()) {
        newErrors.adminSecret = "Admin secret code required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: formData.role,
        ...(formData.role === "SHOP_OWNER" && {
          shopName: formData.shopName.trim(),
        }),
        ...(formData.role === "ADMIN" && {
          adminSecret: formData.adminSecret.trim(),
        }),
      };

      await registerUser(payload);

      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white lg:grid lg:grid-cols-2"
      >
        {/* LEFT SECTION - Hidden on mobile, shown on large screens */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 text-white p-10 xl:p-14">
          <div className="flex items-center gap-2">
            <h1 className="text-5xl xl:text-6xl font-black">
              <span className="text-yellow-300">S</span>
              maze
            </h1>
            <span className="text-sm text-white/70">™</span>
          </div>

          <h2 className="mt-8 text-3xl xl:text-4xl font-bold leading-tight">
            Join Smaze 🚀
            <br />
            <span className="text-yellow-200">Discover Local Deals</span>
          </h2>

          <p className="mt-4 text-base xl:text-lg text-purple-100">
            Connect with shops, explore exclusive offers and save more every
            day.
          </p>

          <div className="mt-8 xl:mt-10 space-y-4 xl:space-y-6">
            <div className="flex gap-4 items-center bg-white/10 rounded-2xl p-4 xl:p-5 backdrop-blur-sm">
              <div className="bg-white/20 p-2.5 xl:p-3 rounded-xl">
                <HiOutlineBuildingStorefront
                  size={22}
                  className="xl:w-6 xl:h-6"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm xl:text-base">
                  Local Shops
                </h3>
                <p className="text-xs xl:text-sm text-purple-100">
                  Explore nearby offers
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center bg-white/10 rounded-2xl p-4 xl:p-5 backdrop-blur-sm">
              <div className="bg-white/20 p-2.5 xl:p-3 rounded-xl">
                <HiOutlineUser size={22} className="xl:w-6 xl:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm xl:text-base">
                  Easy Access
                </h3>
                <p className="text-xs xl:text-sm text-purple-100">
                  Manage your account easily
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center bg-white/10 rounded-2xl p-4 xl:p-5 backdrop-blur-sm">
              <div className="bg-white/20 p-2.5 xl:p-3 rounded-xl">
                <HiOutlineShieldCheck size={22} className="xl:w-6 xl:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm xl:text-base">
                  Secure Platform
                </h3>
                <p className="text-xs xl:text-sm text-purple-100">
                  Safe and protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
          {/* Mobile Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="lg:hidden flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors mb-4"
          >
            <HiOutlineArrowLeft size={20} />
            <span className="text-sm">Back to Login</span>
          </button>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
              Create Account
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 mb-6 sm:mb-8">
              Register to continue with Smaze
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <InputField
              icon={<HiOutlineUser />}
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              error={errors.name}
            />

            <InputField
              icon={<HiOutlineEnvelope />}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              placeholder="Enter email (e.g., john@example.com)"
              error={errors.email}
              helperText="Email must start with a letter, contain @ and a valid domain"
            />

            <InputField
              icon={<HiOutlinePhone />}
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handlePhoneBlur}
              placeholder="10-digit mobile number"
              error={errors.phone}
              helperText="Phone number must be exactly 10 digits and start with 6-9"
            />

            <InputField
              icon={<HiOutlineLockClosed />}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              placeholder="Create strong password"
              error={errors.password}
              helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <div>
              <label className="text-sm font-medium text-gray-700">
                Register As
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1.5 px-4 py-3 sm:py-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm sm:text-base bg-white"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SHOP_OWNER">Shop Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {formData.role === "SHOP_OWNER" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InputField
                  icon={<HiOutlineBuildingStorefront />}
                  label="Shop Name"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Enter shop name"
                  error={errors.shopName}
                />
              </motion.div>
            )}

            {formData.role === "ADMIN" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InputField
                  icon={<HiOutlineKey />}
                  label="Admin Secret Code"
                  name="adminSecret"
                  type="password"
                  value={formData.adminSecret}
                  onChange={handleChange}
                  placeholder="Enter secret code"
                  error={errors.adminSecret}
                />
              </motion.div>
            )}

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:scale-[1.02] transition shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm sm:text-base text-gray-500 mt-6">
            Already have an account?
            <Link
              to="/login"
              className="text-violet-600 font-semibold ml-2 hover:text-violet-700 transition-colors"
            >
              Login
            </Link>
          </p>

          {/* Mobile Features - Show on small screens */}
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="text-xs text-gray-600">
                <span className="block text-lg mb-1">🛍️</span>
                Local Shops
              </div>
              <div className="text-xs text-gray-600">
                <span className="block text-lg mb-1">✅</span>
                Easy Access
              </div>
              <div className="text-xs text-gray-600">
                <span className="block text-lg mb-1">🔒</span>
                Secure
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  showPassword,
  setShowPassword,
}) => {
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1.5">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-11" : "px-4"} pr-4 py-3 sm:py-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition text-sm sm:text-base ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />
        {isPassword && setShowPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? (
              <HiOutlineLockClosed size={18} className="text-green-500" />
            ) : (
              <HiOutlineLockClosed size={18} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-400 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Signup;
