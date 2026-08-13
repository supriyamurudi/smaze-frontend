// frontend/src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";

import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [email, setEmail] = useState("");

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifying(false);
        toast.error("No reset token provided");
        return;
      }

      try {
        const response = await api.get(`/auth/verify-reset-token/${token}`);
        setValidToken(true);
        setEmail(response.data.email);
        // eslint-disable-next-line no-undef
        setName(response.data.name);
      } catch (error) {
        setValidToken(false);
        toast.error(
          error.response?.data?.message || "Invalid or expired reset token",
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });

      toast.success(response.data.message || "Password reset successfully!");
      setSubmitted(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50"
      >
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[35px] shadow-2xl border border-white p-8 sm:p-10 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-gray-500 mb-6">
            The reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-6 py-3 font-semibold text-white hover:scale-[1.02] transition"
          >
            Request New Link
          </Link>
        </div>
      </motion.div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50"
      >
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[35px] shadow-2xl border border-white p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <HiOutlineCheckCircle size={40} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Password Reset Successfully!
          </h2>
          <p className="text-gray-500 mb-6">
            Your password has been updated. You can now login with your new
            password.
          </p>
          <div className="animate-pulse text-sm text-gray-400">
            Redirecting to login...
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50"
    >
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[35px] shadow-2xl border border-white p-8 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-xl">
            <span className="text-white text-4xl font-black">S</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900">
            Set New Password
          </h1>
          <p className="text-gray-500 mt-4 leading-7">
            Enter your new password for{" "}
            <strong className="text-purple-600">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              New Password
            </label>

            <div className="relative">
              <HiOutlineLockClosed
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <HiOutlineEyeSlash size={22} />
                ) : (
                  <HiOutlineEye size={22} />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Must be at least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <HiOutlineLockClosed
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <HiOutlineEyeSlash size={22} />
                ) : (
                  <HiOutlineEye size={22} />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 shadow-lg transition ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Back Login */}
        <p className="text-center mt-8 text-gray-600">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline"
          >
            <HiOutlineArrowLeft size={16} />
            Back to Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
