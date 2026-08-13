// frontend/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";

import { FcGoogle } from "react-icons/fc";

// ===============================
// EMAIL VALIDATION FUNCTION
// ===============================
const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setEmailError("");
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError(
        "Please enter a valid email address. Email must start with a letter and contain @ and a valid domain.",
      );
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email.trim())) {
      setEmailError(
        "Please enter a valid email address. Email must start with a letter and contain @ and a valid domain.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const { user, token } = response;

      if (!user || !token) {
        throw new Error("Login failed. Invalid server response.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Redirect based on role and shop status
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
        return;
      }

      if (user.role === "CUSTOMER") {
        navigate("/customer/dashboard");
        return;
      }

      if (user.role === "SHOP_OWNER") {
        // ✅ Use shop status from login response (no need to call getMyShop)
        if (!user.hasShop) {
          // No shop created yet
          navigate("/shop/create-shop");
          return;
        }

        if (user.shopStatus === "pending") {
          // Shop pending approval
          navigate("/shop/pending-approval");
          return;
        }

        if (user.shopStatus === "approved") {
          // Shop approved - go to dashboard
          navigate("/shop/dashboard");
          return;
        }

        if (user.shopStatus === "rejected") {
          setError("Your shop has been rejected. Please contact support.");
          navigate("/shop/create-shop");
          return;
        }

        // Fallback - go to dashboard
        navigate("/shop/dashboard");
        return;
      }

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-6xl w-full bg-white/80 backdrop-blur-xl rounded-[35px] shadow-2xl overflow-hidden border border-white grid lg:grid-cols-2">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center p-14 text-white bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500">
          <h1 className="text-6xl font-black">
            <span className="text-yellow-300">S</span>
            maze
            <span className="text-sm align-top">™</span>
          </h1>

          <h2 className="mt-8 text-4xl font-bold">
            Discover Amazing
            <br />
            Local Deals Near You
          </h2>

          <p className="mt-6 text-lg text-purple-100">
            Explore trusted shops, exclusive offers and save money every time
            you shop.
          </p>

          <div className="mt-10 bg-white/20 rounded-3xl p-7">
            <h3 className="text-xl font-semibold mb-5">Why choose Smaze? ✨</h3>
            <ul className="space-y-4 text-purple-100">
              <li>✅ Exclusive Local Offers</li>
              <li>✅ Verified Businesses</li>
              <li>✅ Instant Notifications</li>
              <li>✅ Free To Use</li>
            </ul>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-black text-gray-900">Welcome Back 👋</h2>
          <p className="text-gray-500 mt-3 mb-8">
            Sign in and continue exploring local offers.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative mt-2">
                <HiOutlineEnvelope
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  placeholder="Enter your email (e.g., john@example.com)"
                  required
                  className={`w-full pl-12 py-4 rounded-2xl border outline-none focus:ring-4 focus:ring-purple-100 ${
                    emailError ? "border-red-500" : ""
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Email must start with a letter and contain @ and a valid domain
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="font-semibold text-gray-700">Password</label>
              <div className="relative mt-2">
                <HiOutlineLockClosed
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border outline-none focus:ring-4 focus:ring-purple-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash size={22} />
                  ) : (
                    <HiOutlineEye size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            <div className="flex justify-between items-center">
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember Me
              </label>
              <Link
                to="/forgot-password"
                className="text-purple-600 font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t" />
              <span className="text-gray-400">OR</span>
              <div className="flex-1 border-t" />
            </div>

            <button
              type="button"
              className="w-full py-4 rounded-2xl border flex justify-center items-center gap-3 font-semibold"
            >
              <FcGoogle size={24} />
              Continue with Google
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?
              <Link to="/signup" className="ml-2 text-purple-600 font-bold">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
