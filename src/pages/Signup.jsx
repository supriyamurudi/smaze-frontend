import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineBuildingStorefront,
  HiOutlineKey,
} from "react-icons/hi2";

import { registerUser } from "../services/authService";

// ===============================
// EMAIL VALIDATION FUNCTION
// ===============================
const validateEmail = (email) => {
  // Must start with a letter (a-z or A-Z)
  // Can contain letters, numbers, dots, underscores, hyphens
  // Must have @ symbol
  // Must have valid domain
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

    // Clear error for this field
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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain minimum 6 characters";
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
        email: formData.email.trim().toLowerCase(), // Convert to lowercase
        password: formData.password,
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-violet-600 text-white p-12">
          <h1 className="text-4xl font-bold mb-5">Join Smaze 🚀</h1>
          <p className="text-violet-100 text-lg">
            Discover local deals, connect with shops and save more every day.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex gap-4 items-center">
              <div className="bg-white/20 p-3 rounded-xl">
                <HiOutlineBuildingStorefront size={25} />
              </div>
              <div>
                <h3 className="font-semibold">Local Shops</h3>
                <p className="text-sm text-violet-100">Explore nearby offers</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-white/20 p-3 rounded-xl">
                <HiOutlineUser size={25} />
              </div>
              <div>
                <h3 className="font-semibold">Easy Access</h3>
                <p className="text-sm text-violet-100">
                  Manage your account easily
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="bg-white/20 p-3 rounded-xl">
                <HiOutlineKey size={25} />
              </div>
              <div>
                <h3 className="font-semibold">Secure Platform</h3>
                <p className="text-sm text-violet-100">Safe and protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2 mb-8">
            Register to continue with Smaze
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              icon={<HiOutlineLockClosed />}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password (min 6 characters)"
              error={errors.password}
            />

            <div>
              <label className="text-sm font-medium">Register As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SHOP_OWNER">Shop Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {formData.role === "SHOP_OWNER" && (
              <InputField
                label="Shop Name"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Enter shop name"
                error={errors.shopName}
              />
            )}

            {formData.role === "ADMIN" && (
              <InputField
                label="Admin Secret Code"
                name="adminSecret"
                type="password"
                value={formData.adminSecret}
                onChange={handleChange}
                placeholder="Enter secret code"
                error={errors.adminSecret}
              />
            )}

            <button
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?
            <Link to="/login" className="text-violet-600 font-semibold ml-2">
              Login
            </Link>
          </p>
        </div>
      </div>
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
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        {icon && (
          <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-10" : "px-4"
          } py-3 border rounded-xl outline-none focus:ring-2 focus:ring-violet-500 ${
            error ? "border-red-500" : ""
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-400 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Signup;
