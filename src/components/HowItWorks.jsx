// frontend/src/components/HowItWorks.jsx
import { motion } from "framer-motion";
import { FaUserPlus, FaSearch, FaTags, FaStore } from "react-icons/fa";

const steps = [
  {
    id: "01",
    icon: <FaUserPlus />,
    title: "Create Account",
    description:
      "Sign up quickly and personalize your profile to start exploring amazing local deals.",
    color: "from-purple-600 to-fuchsia-500",
  },
  {
    id: "02",
    icon: <FaSearch />,
    title: "Explore Offers",
    description:
      "Discover discounts and promotions from verified businesses near your location.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "03",
    icon: <FaTags />,
    title: "Save Favorites",
    description:
      "Bookmark your favorite shops and offers to access them anytime.",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "04",
    icon: <FaStore />,
    title: "Visit & Save",
    description:
      "Visit stores, redeem offers and enjoy exciting savings on your purchases.",
    color: "from-green-500 to-emerald-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-10 sm:py-14 md:py-20 lg:py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20"
        >
          <span className="inline-flex px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold text-[10px] sm:text-xs md:text-sm">
            How It Works
          </span>

          <h2 className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900">
            Find Amazing Deals
            <span className="block sm:inline bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              {" "}
              In 4 Simple Steps
            </span>
          </h2>

          <p className="mt-2 sm:mt-3 md:mt-4 lg:mt-5 max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-slate-500 px-2">
            Smaze makes discovering local offers simple, fast and rewarding.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 relative">
          {/* Desktop Horizontal Connector */}
          <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-purple-200 via-pink-300 to-purple-200 -translate-y-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative group bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 text-center border border-purple-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 md:hover:-translate-y-3 transition-all duration-500"
            >
              {/* Number */}
              <div className="absolute -top-3 sm:-top-4 md:-top-5 left-1/2 -translate-x-1/2 w-8 sm:w-10 md:w-11 lg:w-12 h-8 sm:h-10 md:h-11 lg:h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm lg:text-base shadow-lg z-10">
                {step.id}
              </div>

              {/* Mobile/Tablet Vertical Connector */}
              {index < steps.length - 1 && (
                <div className="lg:hidden absolute -bottom-4 sm:-bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-4 sm:h-5 md:h-6 bg-gradient-to-b from-purple-300 to-pink-300" />
              )}

              {/* Icon */}
              <div
                className={`mt-5 sm:mt-6 md:mt-7 lg:mt-8 mx-auto w-12 sm:w-14 md:w-16 lg:w-20 h-12 sm:h-14 md:h-16 lg:h-20 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl shadow-lg group-hover:scale-110 transition-all duration-300`}
              >
                {step.icon}
              </div>

              <h3 className="mt-3 sm:mt-4 md:mt-5 lg:mt-7 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-1.5 sm:mt-2 md:mt-3 lg:mt-4 text-xs sm:text-sm md:text-base text-slate-500 leading-5 sm:leading-6 md:leading-7">
                {step.description}
              </p>

              {/* Step Number Indicator - Desktop only */}
              <div className="hidden lg:block mt-3 md:mt-4 text-[10px] sm:text-xs font-semibold text-purple-400">
                Step {step.id}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-10 md:mt-14 lg:mt-16"
        >
          <p className="text-xs sm:text-sm md:text-base text-slate-500">
            Ready to start saving?{" "}
            <a
              href="/signup"
              className="text-purple-600 font-semibold hover:text-purple-700 transition"
            >
              Sign up for free →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
