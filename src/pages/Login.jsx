// frontend/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

// ===============================
// EMAIL VALIDATION FUNCTION (Strict)
// ===============================
const validateEmail = (email) => {
  // Must start with letter, allow numbers, dots, underscores, percent, +, -
  // Must have @ and a valid domain with at least 2 letters
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  // ❌ Removed passwordError because we don't validate strength on login

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

      setTimeout(() => {
        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
          return;
        }

        if (user.role === "CUSTOMER") {
          navigate("/customer/dashboard");
          return;
        }

        if (user.role === "SHOP_OWNER") {
          if (!user.hasShop) {
            navigate("/shop/create-shop");
            return;
          }

          if (user.shopStatus === "pending") {
            navigate("/shop/pending-approval");
            return;
          }

          if (user.shopStatus === "approved") {
            navigate("/shop/dashboard");
            return;
          }

          if (user.shopStatus === "rejected") {
            setError("Your shop has been rejected. Please contact support.");
            navigate("/shop/create-shop");
            return;
          }

          navigate("/shop/dashboard");
          return;
        }

        navigate("/");
      }, 100);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-6xl bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[35px] shadow-2xl overflow-hidden border border-white lg:grid lg:grid-cols-2">
        {/* LEFT SECTION - Hidden on mobile, shown on large screens */}
        <div className="hidden lg:flex flex-col justify-center p-10 xl:p-14 text-white bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500">
          <div className="flex items-center gap-2">
            <h1 className="text-5xl xl:text-6xl font-black">
              <span className="text-yellow-300">S</span>
              maze
            </h1>
            <span className="text-sm text-white/70">™</span>
          </div>

          <h2 className="mt-8 text-3xl xl:text-4xl font-bold leading-tight">
            Discover Amazing
            <br />
            Local Deals Near You
          </h2>

          <p className="mt-6 text-base xl:text-lg text-purple-100">
            Explore trusted shops, exclusive offers and save money every time
            you shop.
          </p>

          <div className="mt-8 xl:mt-10 bg-white/20 rounded-2xl xl:rounded-3xl p-6 xl:p-7">
            <h3 className="text-lg xl:text-xl font-semibold mb-4 xl:mb-5">
              Why choose Smaze? ✨
            </h3>
            <ul className="space-y-3 xl:space-y-4 text-purple-100 text-sm xl:text-base">
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✦</span> Exclusive Local
                Offers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✦</span> Verified Businesses
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✦</span> Instant Notifications
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">✦</span> Free To Use
              </li>
            </ul>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-center">
          {/* Mobile Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 transition-colors"
          >
            <HiOutlineArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
              Welcome Back 👋
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 mb-6 sm:mb-8">
              Sign in and continue exploring local offers.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <HiOutlineEnvelope
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  placeholder="Enter your email"
                  required
                  className={`w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border outline-none focus:ring-4 focus:ring-purple-100 text-sm sm:text-base ${
                    emailError ? "border-red-500" : ""
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-red-500">{emailError}</p>
              )}
              <p className="mt-1 text-xs text-gray-400 hidden sm:block">
                Email must start with a letter and contain @ and a valid domain
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <HiOutlineLockClosed
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border outline-none focus:ring-4 focus:ring-purple-100 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash size={20} />
                  ) : (
                    <HiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <label className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-gray-700">Remember Me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              disabled={loading}
              className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-white font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
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
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* SIGN UP LINK */}
            <p className="text-center text-sm sm:text-base text-gray-600">
              Don't have an account?
              <Link
                to="/signup"
                className="ml-2 text-purple-600 font-bold hover:text-purple-700 transition-colors"
              >
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
