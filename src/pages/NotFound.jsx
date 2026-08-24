// frontend/src/pages/NotFound.jsx

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiOutlineQuestionMarkCircle,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

const NotFound = () => {
  const navigate = useNavigate();

  // Optional: Redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl text-center"
      >
        {/* 404 Number with Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
            404
          </h1>

          {/* Decorative floating elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 text-4xl sm:text-6xl opacity-20"
          >
            <HiOutlineQuestionMarkCircle />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 text-4xl sm:text-6xl opacity-20"
          >
            <HiOutlineMagnifyingGlass />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
            Oops! Page Not Found
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-[1.02] transition shadow-lg shadow-violet-200 hover:shadow-violet-300"
          >
            <HiOutlineHome size={20} />
            Go Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
          >
            <HiOutlineArrowLeft size={20} />
            Go Back
          </button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-200"
        >
          <p className="text-xs sm:text-sm text-slate-400">
            Need help? Try these links:
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium transition"
            >
              Home
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/about"
              className="text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium transition"
            >
              About Us
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/contact"
              className="text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium transition"
            >
              Contact
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/offers"
              className="text-xs sm:text-sm text-violet-600 hover:text-violet-700 font-medium transition"
            >
              Browse Offers
            </Link>
          </div>
        </motion.div>

        {/* Auto Redirect Timer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-xs text-slate-400"
        >
          You will be redirected to the home page in 10 seconds...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
