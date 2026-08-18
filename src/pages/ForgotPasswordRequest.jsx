// frontend/src/components/ForgotPasswordRequest.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import { resetPassword } from "../services/authService";

const ForgotPasswordRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("One number");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, newPassword, confirmPassword } = formData;

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      toast.error(`Password must contain: ${passwordErrors.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({
        email,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        toast.success(
          "Password reset successfully! Please login with your new password.",
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(
        error.message || "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineLockClosed className="text-4xl text-violet-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              Reset Password
            </h2>
            <p className="text-slate-500 mt-2">
              Enter your email and new password to reset
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showNewPassword ? (
                    <HiOutlineEyeSlash size={20} />
                  ) : (
                    <HiOutlineEye size={20} />
                  )}
                </button>
              </div>

              {formData.newPassword && (
                <div className="mt-3 space-y-1 text-xs">
                  <p className="text-slate-600 font-medium">
                    Password requirements:
                  </p>
                  <ul className="space-y-1">
                    <li
                      className={`flex items-center gap-2 ${
                        formData.newPassword.length >= 8
                          ? "text-green-500"
                          : "text-slate-400"
                      }`}
                    >
                      <span>
                        {formData.newPassword.length >= 8 ? "✅" : "□"}
                      </span>
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        /[A-Z]/.test(formData.newPassword)
                          ? "text-green-500"
                          : "text-slate-400"
                      }`}
                    >
                      <span>
                        {/[A-Z]/.test(formData.newPassword) ? "✅" : "□"}
                      </span>
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        /[a-z]/.test(formData.newPassword)
                          ? "text-green-500"
                          : "text-slate-400"
                      }`}
                    >
                      <span>
                        {/[a-z]/.test(formData.newPassword) ? "✅" : "□"}
                      </span>
                      One lowercase letter
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        /[0-9]/.test(formData.newPassword)
                          ? "text-green-500"
                          : "text-slate-400"
                      }`}
                    >
                      <span>
                        {/[0-9]/.test(formData.newPassword) ? "✅" : "□"}
                      </span>
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? (
                    <HiOutlineEyeSlash size={20} />
                  ) : (
                    <HiOutlineEye size={20} />
                  )}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {formData.newPassword === formData.confirmPassword ? (
                    <>
                      <HiOutlineCheckCircle
                        className="text-green-500"
                        size={16}
                      />
                      <span className="text-green-500 font-medium">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <HiOutlineExclamationCircle
                        className="text-red-500"
                        size={16}
                      />
                      <span className="text-red-500 font-medium">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                loading ||
                formData.newPassword !== formData.confirmPassword ||
                formData.newPassword.length < 8
              }
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Back to Login */}
            <p className="text-center text-sm text-slate-500">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-violet-600 font-semibold hover:text-violet-700 transition"
              >
                Back to Login
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordRequest;
