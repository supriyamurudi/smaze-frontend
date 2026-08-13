// frontend/src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";

import {
  HiOutlineEnvelope,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      toast.success(response.data.message || "Password reset link sent!");
      setSubmitted(true);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset link";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Check Your Email
          </h2>

          <p className="text-gray-500 mb-6">
            We've sent a password reset link to{" "}
            <strong className="text-purple-600">{email}</strong>
          </p>

          <div className="bg-amber-50 rounded-2xl p-4 mb-6 text-left">
            <p className="text-sm text-amber-700">
              📧 The link will expire in <strong>1 hour</strong>
            </p>
            <p className="text-sm text-amber-700 mt-1">
              💡 If you don't see it, check your <strong>spam folder</strong>
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:underline"
          >
            <HiOutlineArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
            Forgot Password?
          </h1>
          <p className="text-gray-500 mt-4 leading-7">
            Don't worry! Enter your email and we'll send you a password reset
            link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <HiOutlineEnvelope
                size={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                required
              />
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
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back Login */}
        <p className="text-center mt-8 text-gray-600">
          Remember your password?
          <Link
            to="/login"
            className="ml-2 text-purple-600 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
